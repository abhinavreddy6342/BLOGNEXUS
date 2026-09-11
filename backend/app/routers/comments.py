from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.comment import Comment
from app.models.post import Post
from app.models.user import User
from app.schemas.comment import (
    CommentCreate,
    CommentResponse,
    CommentUpdate,
)


router = APIRouter(
    tags=["Comments"],
)


@router.post(
    "/posts/{post_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_comment(
    post_id: int,
    data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = (
        db.query(Post)
        .filter(Post.id == post_id)
        .first()
    )

    if post is None:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    comment = Comment(
        content=data.content,
        post_id=post_id,
        author_id=current_user.id,
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return comment


@router.get(
    "/posts/{post_id}/comments",
    response_model=list[CommentResponse],
)
def get_comments(
    post_id: int,
    db: Session = Depends(get_db),
):
    post = (
        db.query(Post)
        .filter(Post.id == post_id)
        .first()
    )

    if post is None:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    return (
        db.query(Comment)
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())
        .all()
    )


@router.put(
    "/comments/{comment_id}",
    response_model=CommentResponse,
)
def update_comment(
    comment_id: int,
    data: CommentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    comment = (
        db.query(Comment)
        .filter(Comment.id == comment_id)
        .first()
    )

    if comment is None:
        raise HTTPException(
            status_code=404,
            detail="Comment not found",
        )

    if comment.author_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only edit your own comments",
        )

    comment.content = data.content

    db.commit()
    db.refresh(comment)

    return comment


@router.delete(
    "/comments/{comment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    comment = (
        db.query(Comment)
        .filter(Comment.id == comment_id)
        .first()
    )

    if comment is None:
        raise HTTPException(
            status_code=404,
            detail="Comment not found",
        )

    if comment.author_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own comments",
        )

    db.delete(comment)
    db.commit()

    return None
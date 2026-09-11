from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.like import Like
from app.models.post import Post
from app.models.user import User
from app.schemas.like import LikeCountResponse, LikeResponse


router = APIRouter(
    prefix="/posts",
    tags=["Likes"],
)


@router.post(
    "/{post_id}/like",
    response_model=LikeResponse,
    status_code=status.HTTP_201_CREATED,
)
def like_post(
    post_id: int,
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

    existing_like = (
        db.query(Like)
        .filter(
            Like.post_id == post_id,
            Like.user_id == current_user.id,
        )
        .first()
    )

    if existing_like is not None:
        raise HTTPException(
            status_code=409,
            detail="You already liked this post",
        )

    like = Like(
        post_id=post_id,
        user_id=current_user.id,
    )

    db.add(like)
    db.commit()
    db.refresh(like)

    return like


@router.delete(
    "/{post_id}/like",
    status_code=status.HTTP_204_NO_CONTENT,
)
def unlike_post(
    post_id: int,
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

    like = (
        db.query(Like)
        .filter(
            Like.post_id == post_id,
            Like.user_id == current_user.id,
        )
        .first()
    )

    if like is None:
        raise HTTPException(
            status_code=404,
            detail="Like not found",
        )

    db.delete(like)
    db.commit()

    return None


@router.get(
    "/{post_id}/likes",
    response_model=LikeCountResponse,
)
def get_post_likes(
    post_id: int,
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

    like_count = (
        db.query(Like)
        .filter(Like.post_id == post_id)
        .count()
    )

    liked_by_current_user = (
        db.query(Like)
        .filter(
            Like.post_id == post_id,
            Like.user_id == current_user.id,
        )
        .first()
        is not None
    )

    return LikeCountResponse(
        post_id=post_id,
        like_count=like_count,
        liked_by_current_user=liked_by_current_user,
    )
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.bookmark import Bookmark
from app.models.post import Post
from app.models.user import User
from app.schemas.bookmark import BookmarkResponse


router = APIRouter(
    tags=["Bookmarks"],
)


@router.post(
    "/posts/{post_id}/bookmark",
    response_model=BookmarkResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_bookmark(
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

    existing_bookmark = (
        db.query(Bookmark)
        .filter(
            Bookmark.post_id == post_id,
            Bookmark.user_id == current_user.id,
        )
        .first()
    )

    if existing_bookmark is not None:
        raise HTTPException(
            status_code=409,
            detail="You already bookmarked this post",
        )

    bookmark = Bookmark(
        post_id=post_id,
        user_id=current_user.id,
    )

    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)

    return bookmark


@router.delete(
    "/posts/{post_id}/bookmark",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_bookmark(
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

    bookmark = (
        db.query(Bookmark)
        .filter(
            Bookmark.post_id == post_id,
            Bookmark.user_id == current_user.id,
        )
        .first()
    )

    if bookmark is None:
        raise HTTPException(
            status_code=404,
            detail="Bookmark not found",
        )

    db.delete(bookmark)
    db.commit()

    return None


@router.get(
    "/bookmarks",
    response_model=list[BookmarkResponse],
)
def get_my_bookmarks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Bookmark)
        .filter(Bookmark.user_id == current_user.id)
        .order_by(Bookmark.created_at.desc())
        .all()
    )
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.category import Category
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreate, PostResponse, PostUpdate


router = APIRouter(
    prefix="/posts",
    tags=["Posts"],
)


@router.post(
    "",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_post(
    data: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.category_id is not None:
        category = (
            db.query(Category)
            .filter(Category.id == data.category_id)
            .first()
        )

        if category is None:
            raise HTTPException(
                status_code=404,
                detail="Category not found",
            )

    post = Post(
        title=data.title,
        content=data.content,
        author_id=current_user.id,
        category_id=data.category_id,
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    return post


@router.get(
    "",
    response_model=list[PostResponse],
)
def get_posts(
    search: str | None = Query(
        default=None,
        min_length=1,
        max_length=100,
    ),
    category_id: int | None = Query(
        default=None,
        ge=1,
    ),
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
    ),
    db: Session = Depends(get_db),
):
    query = db.query(Post)

    if search:
        search_pattern = f"%{search}%"

        query = query.filter(
            (Post.title.ilike(search_pattern))
            | (Post.content.ilike(search_pattern))
        )

    if category_id is not None:
        query = query.filter(
            Post.category_id == category_id
        )

    return (
        query
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get(
    "/{post_id}",
    response_model=PostResponse,
)
def get_post(
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

    return post


@router.put(
    "/{post_id}",
    response_model=PostResponse,
)
def update_post(
    post_id: int,
    data: PostUpdate,
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

    if post.author_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only edit your own posts",
        )

    if data.category_id is not None:
        category = (
            db.query(Category)
            .filter(Category.id == data.category_id)
            .first()
        )

        if category is None:
            raise HTTPException(
                status_code=404,
                detail="Category not found",
            )

        post.category_id = data.category_id

    if data.title is not None:
        post.title = data.title

    if data.content is not None:
        post.content = data.content

    db.commit()
    db.refresh(post)

    return post


@router.delete(
    "/{post_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_post(
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

    if post.author_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own posts",
        )

    db.delete(post)
    db.commit()

    return None
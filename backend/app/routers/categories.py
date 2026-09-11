from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryResponse


router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)


@router.post(
    "",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
):
    existing_category = (
        db.query(Category)
        .filter(Category.name == data.name)
        .first()
    )

    if existing_category is not None:
        raise HTTPException(
            status_code=409,
            detail="Category already exists",
        )

    category = Category(
        name=data.name,
    )

    db.add(category)
    db.commit()
    db.refresh(category)

    return category


@router.get(
    "",
    response_model=list[CategoryResponse],
)
def get_categories(
    db: Session = Depends(get_db),
):
    return (
        db.query(Category)
        .order_by(Category.name.asc())
        .all()
    )


@router.get(
    "/{category_id}",
    response_model=CategoryResponse,
)
def get_category(
    category_id: int,
    db: Session = Depends(get_db),
):
    category = (
        db.query(Category)
        .filter(Category.id == category_id)
        .first()
    )

    if category is None:
        raise HTTPException(
            status_code=404,
            detail="Category not found",
        )

    return category
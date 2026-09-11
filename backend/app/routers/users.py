from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_my_profile(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.get(
    "/{user_id}",
    response_model=UserResponse,
)
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


@router.put(
    "/me",
    response_model=UserResponse,
)
def update_my_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.username is not None:
        existing_username = (
            db.query(User)
            .filter(
                User.username == data.username,
                User.id != current_user.id,
            )
            .first()
        )

        if existing_username is not None:
            raise HTTPException(
                status_code=409,
                detail="Username already exists",
            )

        current_user.username = data.username

    if data.email is not None:
        existing_email = (
            db.query(User)
            .filter(
                User.email == data.email,
                User.id != current_user.id,
            )
            .first()
        )

        if existing_email is not None:
            raise HTTPException(
                status_code=409,
                detail="Email already exists",
            )

        current_user.email = data.email

    db.commit()
    db.refresh(current_user)

    return current_user
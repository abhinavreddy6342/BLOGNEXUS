from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    posts = relationship(
        "Post",
        back_populates="author",
        cascade="all, delete-orphan",
    )

    comments = relationship(
        "Comment",
        back_populates="author",
        cascade="all, delete-orphan",
    )

    likes = relationship(
        "Like",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    bookmarks = relationship(
        "Bookmark",
        back_populates="user",
        cascade="all, delete-orphan",
    )
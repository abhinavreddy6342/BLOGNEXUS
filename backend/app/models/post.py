from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    author_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    category_id: Mapped[int | None] = mapped_column(
        ForeignKey("categories.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    author = relationship(
        "User",
        back_populates="posts",
    )

    comments = relationship(
        "Comment",
        back_populates="post",
        cascade="all, delete-orphan",
    )

    likes = relationship(
        "Like",
        back_populates="post",
        cascade="all, delete-orphan",
    )

    bookmarks = relationship(
        "Bookmark",
        back_populates="post",
        cascade="all, delete-orphan",
    )

    category = relationship(
        "Category",
        back_populates="posts",
    )
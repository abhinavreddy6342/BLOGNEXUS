from datetime import datetime

from pydantic import BaseModel, Field


class PostCreate(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=200,
    )
    content: str = Field(
        min_length=10,
    )
    category_id: int | None = None


class PostUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=200,
    )
    content: str | None = Field(
        default=None,
        min_length=10,
    )
    category_id: int | None = None


class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    author_id: int
    category_id: int | None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
    }
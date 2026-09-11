from datetime import datetime

from pydantic import BaseModel


class LikeResponse(BaseModel):
    id: int
    user_id: int
    post_id: int
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }


class LikeCountResponse(BaseModel):
    post_id: int
    like_count: int
    liked_by_current_user: bool
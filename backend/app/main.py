import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine
from app.models import User, Post, Comment, Bookmark, Like, Category

from app.routers.posts import router as posts_router
from app.routers.auth import router as auth_router
from app.routers.comments import router as comments_router
from app.routers.users import router as users_router
from app.routers.likes import router as likes_router
from app.routers.bookmarks import router as bookmarks_router
from app.routers.categories import router as categories_router


# Create database tables when the application starts.
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="BLOGNEXUS API",
    description="REST API for the BLOGNEXUS blogging platform",
    version="1.0.0",
)


# ------------------------------------------------------------------
# CORS
# ------------------------------------------------------------------

# Local frontend for development.
allowed_origins = [
    "http://localhost:5173",
]

# Optional production frontend URL.
# We will set FRONTEND_URL on Render after deploying the frontend.
frontend_url = os.getenv("FRONTEND_URL")

if frontend_url:
    frontend_url = frontend_url.rstrip("/")

    if frontend_url not in allowed_origins:
        allowed_origins.append(frontend_url)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------------
# ROUTES
# ------------------------------------------------------------------

app.include_router(auth_router)
app.include_router(posts_router)
app.include_router(comments_router)
app.include_router(users_router)
app.include_router(likes_router)
app.include_router(bookmarks_router)
app.include_router(categories_router)


@app.get("/")
def root():
    return {
        "message": "BLOGNEXUS API is running",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "BLOGNEXUS API",
    }


@app.get("/db-check")
def database_check():
    try:
        with engine.connect():
            return {
                "status": "success",
                "message": "PostgreSQL connection successful",
            }

    except Exception as error:
        return {
            "status": "error",
            "message": str(error),
        }
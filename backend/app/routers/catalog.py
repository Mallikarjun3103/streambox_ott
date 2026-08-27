from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile, Form
from sqlalchemy import or_, select
from sqlalchemy.orm import Session
import uuid
import re
import shutil
from pathlib import Path

from app.database import get_db
from app.models import Movie, Watchlist
from app.schemas import HomeOut, MovieOut

router = APIRouter(tags=["catalog"])


def serialize(movie: Movie, db: Session) -> MovieOut:
    item = db.scalar(select(Watchlist).where(Watchlist.movie_id == movie.id))
    return MovieOut(
        **{c.name: getattr(movie, c.name) for c in Movie.__table__.columns},
        in_watchlist=item is not None,
        progress=item.progress if item else 0.0,
    )


@router.get("/home", response_model=HomeOut)
def home(db: Session = Depends(get_db)):
    movies = db.scalars(select(Movie)).all()
    if not movies:
        raise HTTPException(503, "Catalog is empty. Run the seed script first.")

    featured = next((m for m in movies if m.featured), movies[0])
    serialized = {m.id: serialize(m, db) for m in movies}

    return HomeOut(
        featured=serialized[featured.id],
        continue_watching=[serialized[m.id] for m in movies if 0 < next((w.progress for w in db.scalars(select(Watchlist).where(Watchlist.movie_id == m.id)).all()), 0) < 100][:5],
        trending=[serialized[m.id] for m in movies if m.trending][:10],
        originals=[serialized[m.id] for m in movies if m.original][:10],
        action=[serialized[m.id] for m in movies if "Action" in m.genre][:10],
        drama=[serialized[m.id] for m in movies if "Drama" in m.genre or "Romance" in m.genre][:10],
    )


@router.get("/movies/{slug}", response_model=MovieOut)
def movie(slug: str, db: Session = Depends(get_db)):
    item = db.scalar(select(Movie).where(Movie.slug == slug))
    if not item:
        raise HTTPException(404, "Movie not found")
    return serialize(item, db)


@router.get("/search", response_model=list[MovieOut])
def search(q: str = Query(default="", min_length=0, max_length=100), db: Session = Depends(get_db)):
    if not q.strip():
        results = db.scalars(select(Movie).limit(20)).all()
    else:
        pattern = f"%{q.strip()}%"
        results = db.scalars(
            select(Movie).where(
                or_(
                    Movie.title.ilike(pattern),
                    Movie.genre.ilike(pattern),
                    Movie.cast.ilike(pattern),
                    Movie.creator.ilike(pattern),
                    Movie.description.ilike(pattern),
                )
            ).limit(30)
        ).all()
    return [serialize(m, db) for m in results]


@router.post("/movies/upload", response_model=MovieOut)
def upload_movie(
    title: str = Form(...),
    description: str = Form(...),
    year: int = Form(...),
    duration: str = Form(...),
    rating: str = Form(...),
    genre: str = Form(...),
    content_type: str = Form("movie"),
    poster_url: str | None = Form(None),
    backdrop_url: str | None = Form(None),
    video_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Ensure filename is present
    if not video_file.filename:
        raise HTTPException(status_code=400, detail="Invalid video file")

    # Validate file is a video
    if video_file.content_type and not video_file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid video format")

    # Generate unique filename for storage
    file_ext = Path(video_file.filename).suffix
    if not file_ext:
        file_ext = ".mp4"  # Default fallback
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    dest_path = Path("static/uploads") / unique_filename

    # Save uploaded video
    try:
        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(video_file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save video: {str(e)}")

    # Create a unique slug from title
    base_slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
    if not base_slug:
        base_slug = "untitled"

    slug = base_slug
    counter = 1
    while db.scalar(select(Movie).where(Movie.slug == slug)):
        slug = f"{base_slug}-{counter}"
        counter += 1

    # Insert Movie to database
    new_movie = Movie(
        slug=slug,
        title=title,
        description=description,
        year=year,
        duration=duration,
        rating=rating,
        genre=genre,
        content_type=content_type,
        video_url=f"/static/uploads/{unique_filename}",
        poster_url=poster_url or "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=85",
        backdrop_url=backdrop_url or "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1800&q=85",
        cast="User Uploaded",
        creator="Self",
        featured=False,
        trending=False,
        original=False,
    )
    db.add(new_movie)
    db.commit()
    db.refresh(new_movie)

    return serialize(new_movie, db)

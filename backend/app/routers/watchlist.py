from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Movie, Watchlist

router = APIRouter(tags=["watchlist"])


@router.get("/watchlist")
def get_watchlist(db: Session = Depends(get_db)):
    rows = db.scalars(select(Watchlist).order_by(Watchlist.id.desc())).all()
    movies = []
    for row in rows:
        movie = db.get(Movie, row.movie_id)
        if movie:
            movies.append({
                "id": movie.id, "slug": movie.slug, "title": movie.title,
                "description": movie.description, "year": movie.year,
                "duration": movie.duration, "rating": movie.rating, "genre": movie.genre,
                "content_type": movie.content_type, "badge": movie.badge,
                "poster_url": movie.poster_url, "backdrop_url": movie.backdrop_url,
                "cast": movie.cast, "creator": movie.creator,
                "in_watchlist": True, "progress": row.progress
            })
    return movies


@router.post("/watchlist/{slug}/toggle")
def toggle_watchlist(slug: str, db: Session = Depends(get_db)):
    movie = db.scalar(select(Movie).where(Movie.slug == slug))
    if not movie:
        raise HTTPException(404, "Movie not found")

    row = db.scalar(select(Watchlist).where(Watchlist.movie_id == movie.id))
    if row:
        db.delete(row)
        db.commit()
        return {"slug": slug, "in_watchlist": False}

    db.add(Watchlist(movie_id=movie.id, progress=0))
    db.commit()
    return {"slug": slug, "in_watchlist": True}

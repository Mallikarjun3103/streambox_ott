from sqlalchemy import Boolean, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Movie(Base):
    __tablename__ = "movies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(160), index=True)
    description: Mapped[str] = mapped_column(Text)
    year: Mapped[int] = mapped_column(Integer)
    duration: Mapped[str] = mapped_column(String(40))
    rating: Mapped[str] = mapped_column(String(20))
    genre: Mapped[str] = mapped_column(String(80), index=True)
    content_type: Mapped[str] = mapped_column(String(30), default="movie")
    badge: Mapped[str | None] = mapped_column(String(40), nullable=True)
    poster_url: Mapped[str] = mapped_column(Text)
    backdrop_url: Mapped[str] = mapped_column(Text)
    cast: Mapped[str] = mapped_column(Text, default="")
    creator: Mapped[str] = mapped_column(String(160), default="")
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    trending: Mapped[bool] = mapped_column(Boolean, default=False)
    original: Mapped[bool] = mapped_column(Boolean, default=False)
    video_url: Mapped[str | None] = mapped_column(Text, nullable=True)


class Watchlist(Base):
    __tablename__ = "watchlist"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    movie_id: Mapped[int] = mapped_column(Integer, index=True, unique=True)
    progress: Mapped[float] = mapped_column(Float, default=0.0)

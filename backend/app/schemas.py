from pydantic import BaseModel, ConfigDict


class MovieOut(BaseModel):
    id: int
    slug: str
    title: str
    description: str
    year: int
    duration: str
    rating: str
    genre: str
    content_type: str
    badge: str | None
    poster_url: str
    backdrop_url: str
    cast: str
    creator: str
    video_url: str | None = None
    in_watchlist: bool = False
    progress: float = 0.0

    model_config = ConfigDict(from_attributes=True)


class HomeOut(BaseModel):
    featured: MovieOut
    continue_watching: list[MovieOut]
    trending: list[MovieOut]
    originals: list[MovieOut]
    action: list[MovieOut]
    drama: list[MovieOut]

from sqlalchemy import select

from app.database import Base, SessionLocal, engine
from app.models import Movie, Watchlist

Base.metadata.create_all(bind=engine)

POSTERS = [
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=700&q=85",
]

BACKDROPS = [
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=85",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1800&q=85",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=85",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1800&q=85",
]

VIDEOS = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
]

titles = [
    ("Neon Horizon", "A rogue navigator discovers a forgotten city beyond the edge of mapped space.", 2026, "2h 08m", "U/A 16+", "Action • Sci-Fi", "movie"),
    ("The Last Signal", "A communications engineer races to decode a transmission that should not exist.", 2025, "1h 52m", "U/A 13+", "Thriller • Drama", "movie"),
    ("Monsoon Letters", "Two strangers exchange letters across three cities and one impossible summer.", 2026, "1h 46m", "U/A 13+", "Drama • Romance", "movie"),
    ("Black Meridian", "An intelligence analyst follows a trail of clues hidden inside a vanished expedition.", 2025, "2h 14m", "U/A 16+", "Action • Thriller", "movie"),
    ("Orbit Nine", "A stranded crew must choose between returning home and saving a world they barely know.", 2024, "2h 02m", "U/A 13+", "Adventure • Sci-Fi", "series"),
    ("After Midnight", "A night-shift journalist uncovers a story powerful people want buried.", 2025, "8 Episodes", "U/A 16+", "Crime • Drama", "series"),
    ("Parallel Hearts", "A musician and an architect meet in two timelines with very different endings.", 2026, "10 Episodes", "U/A 13+", "Romance • Drama", "series"),
    ("Wild Atlas", "A visual journey through remote landscapes and the people who call them home.", 2025, "6 Episodes", "U", "Documentary", "series"),
]

with SessionLocal() as db:
    if db.scalar(select(Movie.id).limit(1)):
        print("Catalog already seeded.")
        raise SystemExit(0)

    movies = []
    for i, data in enumerate(titles):
        title, desc, year, duration, rating, genre, content_type = data
        movie = Movie(
            slug=title.lower().replace(" ", "-"),
            title=title,
            description=desc,
            year=year,
            duration=duration,
            rating=rating,
            genre=genre,
            content_type=content_type,
            badge="NEW" if i in (0, 2, 6) else ("TOP 10" if i in (1, 3) else None),
            poster_url=POSTERS[i % len(POSTERS)],
            backdrop_url=BACKDROPS[i % len(BACKDROPS)],
            cast="Aarav Menon, Mira Rao, Karan Dev",
            creator="StreamWave Studios",
            featured=(i == 0),
            trending=(i in (0, 1, 3, 4, 6)),
            original=(i in (0, 2, 5, 6)),
            video_url=VIDEOS[i % len(VIDEOS)],
        )
        movies.append(movie)

    db.add_all(movies)
    db.commit()

    db.add(Watchlist(movie_id=movies[4].id, progress=42))
    db.add(Watchlist(movie_id=movies[1].id, progress=18))
    db.commit()

print("Seed complete.")

import { Link } from "react-router-dom";
import { Play, Plus, Check } from "lucide-react";
import { toggleWatchlist } from "../api";
import { useState } from "react";

export default function MovieCard({ movie, compact = false }) {
  const [listed, setListed] = useState(Boolean(movie.in_watchlist));

  async function handleList(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await toggleWatchlist(movie.slug);
      setListed(result.in_watchlist);
    } catch {
      setListed(!listed);
    }
  }

  return (
    <Link className={`movie-card ${compact ? "compact" : ""}`} to={`/movie/${movie.slug}`}>
      <div className="poster-wrap">
        <img src={movie.poster_url} alt={movie.title} loading="lazy" />
        <div className="poster-overlay">
          <span className="play-circle"><Play size={17} fill="currentColor" /></span>
          <button className="list-btn" onClick={handleList} aria-label="Toggle watchlist">
            {listed ? <Check size={16} /> : <Plus size={16} />}
          </button>
        </div>
        {movie.badge && <span className="movie-badge">{movie.badge}</span>}
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="movie-meta">
          <span>{movie.year}</span>
          <span className="dot">•</span>
          <span>{movie.duration}</span>
          <span className="rating">{movie.rating}</span>
        </div>
      </div>
    </Link>
  );
}

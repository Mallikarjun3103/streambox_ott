import { useEffect, useState } from "react";
import { getWatchlist } from "../api";
import MovieCard from "../components/MovieCard";

export default function Watchlist() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getWatchlist().then(setMovies).catch(console.error);
  }, []);

  return (
    <section className="page-container">
      <div className="page-title">
        <span>YOUR LIBRARY</span>
        <h1>My List</h1>
      </div>
      {movies.length ? (
        <div className="movie-grid search-grid">{movies.map((m) => <MovieCard key={m.id} movie={m} />)}</div>
      ) : (
        <div className="empty-state">
          <h2>Your list is empty</h2>
          <p>Add movies and series to keep them here.</p>
        </div>
      )}
    </section>
  );
}

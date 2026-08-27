import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../api";
import MovieCard from "../components/MovieCard";

export default function Search() {
  const [params] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const q = params.get("q") || "";

  useEffect(() => {
    searchMovies(q).then(setMovies).catch(console.error);
  }, [q]);

  return (
    <section className="page-container search-page">
      <div className="page-title">
        <span>SEARCH</span>
        <h1>{q ? `Results for "${q}"` : "Explore the library"}</h1>
      </div>
      {movies.length ? (
        <div className="movie-grid search-grid">
          {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No titles found</h2>
          <p>Try another title, actor, genre, or keyword.</p>
        </div>
      )}
    </section>
  );
}

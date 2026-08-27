import { ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

export default function ContentRow({ title, movies, subtitle }) {
  if (!movies?.length) return null;
  return (
    <section className="content-row">
      <div className="section-heading">
        <div>
          <h2>{title} <ChevronRight size={22} /></h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <div className="movie-grid">
        {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, Plus, Check, ArrowLeft } from "lucide-react";
import { getMovie, toggleWatchlist } from "../api";
import MovieCard from "../components/MovieCard";

export default function Details() {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    getMovie(slug).then(setMovie).catch(console.error);
  }, [slug]);

  if (!movie) return <div className="loading">Loading title...</div>;

  async function list() {
    const result = await toggleWatchlist(movie.slug);
    setMovie({ ...movie, in_watchlist: result.in_watchlist });
  }

  return (
    <div className="details-page">
      <section className="details-hero" style={{ "--detail-image": `url("${movie.backdrop_url}")` }}>
        <div className="details-shade" />
        <div className="details-content">
          <Link to="/" className="back-link"><ArrowLeft size={17} /> Back</Link>
          <div className="detail-copy">
            <span className="eyebrow">{movie.content_type?.toUpperCase()}</span>
            <h1>{movie.title}</h1>
            <div className="hero-meta">
              <span>{movie.year}</span><span>{movie.rating}</span><span>{movie.duration}</span><span>{movie.genre}</span>
            </div>
            <p>{movie.description}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to={`/watch/${movie.slug}`}><Play size={18} fill="currentColor" /> Watch</Link>
              <button className="btn btn-secondary" onClick={list}>
                {movie.in_watchlist ? <><Check size={18} /> In My List</> : <><Plus size={18} /> My List</>}
              </button>
            </div>
            <div className="credits">
              <p><b>Cast:</b> {movie.cast}</p>
              <p><b>Creator:</b> {movie.creator}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="detail-related">
        <Content title="You May Also Like" movies={movie.recommendations || []} />
      </section>
    </div>
  );
}

function Content({ title, movies }) {
  return (
    <div className="content-row">
      <div className="section-heading"><h2>{title}</h2></div>
      <div className="movie-grid">{movies.map((m) => <MovieCard key={m.id} movie={m} />)}</div>
    </div>
  );
}

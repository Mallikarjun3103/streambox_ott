import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import { getMovie } from "../api";

export default function Player() {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovie(slug)
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="loading">Loading Player...</div>;
  if (!movie) return <div className="loading">Movie not found</div>;

  const isAbsolute = movie.video_url && (movie.video_url.startsWith("http://") || movie.video_url.startsWith("https://"));
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
  const backendBase = apiBase.replace("/api/v1", "");
  const videoSrc = movie.video_url
    ? (isAbsolute ? movie.video_url : `${backendBase}${movie.video_url}`)
    : null;

  return (
    <section className="player-page">
      <div className="player-top">
        <Link to={`/movie/${slug}`}><ArrowLeft size={19} /> Back to details</Link>
        <span>STREAMWAVE PLAYER — {movie.title}</span>
      </div>
      <div className="video-stage">
        {videoSrc ? (
          <video
            src={videoSrc}
            controls
            autoPlay
            poster={movie.backdrop_url}
            style={{ width: "100%", height: "100%", objectFit: "contain", background: "#000" }}
          />
        ) : (
          <div className="video-art">
            <div className="big-play"><Play size={36} fill="currentColor" /></div>
            <div className="demo-label">NO VIDEO SOURCE</div>
            <p>Please edit this movie or upload a file with a valid video stream.</p>
          </div>
        )}
      </div>
    </section>
  );
}

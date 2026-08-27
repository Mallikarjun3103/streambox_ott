import { useEffect, useState } from "react";
import { Play, Plus, Info, Volume2 } from "lucide-react";
import { getHome, toggleWatchlist } from "../api";
import ContentRow from "../components/ContentRow";

export default function Home() {
  const [data, setData] = useState(null);
  const [listed, setListed] = useState(false);

  useEffect(() => {
    getHome().then(setData).catch(console.error);
  }, []);

  if (!data) return <div className="loading">Loading StreamWave...</div>;

  const hero = data.featured;

  async function addToList() {
    try {
      const result = await toggleWatchlist(hero.slug);
      setListed(result.in_watchlist);
    } catch {}
  }

  return (
    <div>
      <section
        className="hero"
        style={{
          "--hero-image": `url("${hero.backdrop_url}")`
        }}
      >
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="eyebrow"><span className="live-dot" /> STREAMWAVE ORIGINAL</div>
          <h1>{hero.title}</h1>
          <div className="hero-meta">
            <span>{hero.year}</span><span>{hero.rating}</span><span>{hero.duration}</span><span>{hero.genre}</span>
          </div>
          <p>{hero.description}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={`/watch/${hero.slug}`}>
              <Play size={18} fill="currentColor" /> Watch Now
            </a>
            <button className="btn btn-secondary" onClick={addToList}>
              {listed ? <><Plus size={18} /> Added</> : <><Plus size={18} /> My List</>}
            </button>
            <button className="circle-action" title="More information">
              <Info size={19} />
            </button>
            <button className="circle-action" title="Sound">
              <Volume2 size={19} />
            </button>
          </div>
        </div>
        <div className="hero-bottom-fade" />
      </section>

      <div className="home-content">
        <ContentRow title="Continue Watching" subtitle="Pick up where you left off" movies={data.continue_watching} />
        <ContentRow title="Trending Now" movies={data.trending} />
        <ContentRow title="StreamWave Originals" movies={data.originals} />
        <ContentRow title="Action & Adventure" movies={data.action} />
        <ContentRow title="Drama & Romance" movies={data.drama} />
      </div>
    </div>
  );
}

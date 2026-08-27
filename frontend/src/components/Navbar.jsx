import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Play, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  }

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark"><Play size={15} fill="currentColor" /></span>
          <span>STREAM<span className="brand-accent">WAVE</span></span>
        </Link>

        <nav className={`nav-links ${open ? "mobile-open" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/?genre=action">Movies</Link>
          <Link to="/?genre=series">Series</Link>
          <Link to="/watchlist">My List</Link>
          <Link to="/upload">Upload</Link>
        </nav>

        <div className="nav-actions">
          <form className="search-box" onSubmit={submit}>
            <Search size={18} />
            <input
              id="global-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles..."
              aria-label="Search titles"
            />
            <kbd>/</kbd>
          </form>
          <button className="icon-btn" aria-label="Profile">
            <User size={20} />
          </button>
          <button className="mobile-menu icon-btn" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}

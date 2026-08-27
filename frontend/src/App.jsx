import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Details from "./pages/Details";
import Watchlist from "./pages/Watchlist";
import Player from "./pages/Player";
import Upload from "./pages/Upload";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:slug" element={<Details />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/watch/:slug" element={<Player />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  timeout: 10000
});

export async function getHome() {
  const { data } = await api.get("/home");
  return data;
}

export async function getMovie(slug) {
  const { data } = await api.get(`/movies/${slug}`);
  return data;
}

export async function searchMovies(query) {
  const { data } = await api.get("/search", { params: { q: query } });
  return data;
}

export async function getWatchlist() {
  const { data } = await api.get("/watchlist");
  return data;
}

export async function toggleWatchlist(slug) {
  const { data } = await api.post(`/watchlist/${slug}/toggle`);
  return data;
}

export async function uploadMovie(formData, onProgress) {
  const { data } = await api.post("/movies/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    timeout: 300000, // 5 minutes timeout
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    }
  });
  return data;
}

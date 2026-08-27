import { useState } from "react";
import { Link } from "react-router-dom";
import { UploadCloud, Film, CheckCircle, AlertCircle, Play } from "lucide-react";
import { uploadMovie } from "../api";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [contentType, setContentType] = useState("movie");
  const [year, setYear] = useState(new Date().getFullYear());
  const [duration, setDuration] = useState("");
  const [rating, setRating] = useState("U");
  const [posterUrl, setPosterUrl] = useState("");
  const [backdropUrl, setBackdropUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !description || !genre || !duration || !videoFile) {
      setError("Please fill in all required fields and select a video file.");
      return;
    }

    setError("");
    setSuccessData(null);
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("genre", genre);
    formData.append("content_type", contentType);
    formData.append("year", year);
    formData.append("duration", duration);
    formData.append("rating", rating);
    if (posterUrl) formData.append("poster_url", posterUrl);
    if (backdropUrl) formData.append("backdrop_url", backdropUrl);
    formData.append("video_file", videoFile);

    try {
      const data = await uploadMovie(formData, (percent) => {
        setProgress(percent);
      });
      setSuccessData(data);
      // Clear form
      setTitle("");
      setDescription("");
      setGenre("");
      setVideoFile(null);
      setDuration("");
      setPosterUrl("");
      setBackdropUrl("");
    } catch (err) {
      setError(
        err.response?.data?.detail || "An error occurred while uploading. Please try again."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="page-container">
      <div className="page-title">
        <span>CREATOR STUDIO</span>
        <h1>Upload Video</h1>
      </div>

      <div className="upload-layout">
        {successData && (
          <div className="alert-box success">
            <CheckCircle className="icon" size={24} />
            <div className="alert-content">
              <h3>Upload Successful!</h3>
              <p>"{successData.title}" has been successfully added to the catalog.</p>
              <div className="alert-actions">
                <Link to={`/watch/${successData.slug}`} className="btn btn-primary btn-sm">
                  <Play size={16} fill="currentColor" /> Watch Now
                </Link>
                <Link to={`/movie/${successData.slug}`} className="btn btn-secondary btn-sm">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="alert-box error">
            <AlertCircle className="icon" size={24} />
            <div className="alert-content">
              <h3>Upload Failed</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {uploading ? (
          <div className="upload-progress-container">
            <div className="spinner-wrap">
              <Film className="spinner-icon" size={48} />
            </div>
            <h2>Uploading video file...</h2>
            <p>Please do not close this page or navigate away.</p>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="progress-text">{progress}% Completed</span>
          </div>
        ) : (
          <form className="upload-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Movie Details</h2>
              
              <div className="form-group">
                <label htmlFor="title">Title <span className="required">*</span></label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Neon Horizon"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description <span className="required">*</span></label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief synopsis of the video..."
                  rows={4}
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="genre">Genre <span className="required">*</span></label>
                  <input
                    type="text"
                    id="genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="e.g. Sci-Fi • Action"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contentType">Type</label>
                  <select
                    id="contentType"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                  >
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                  </select>
                </div>
              </div>

              <div className="form-row ternary">
                <div className="form-group">
                  <label htmlFor="year">Release Year</label>
                  <input
                    type="number"
                    id="year"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
                    min={1900}
                    max={2100}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Duration <span className="required">*</span></label>
                  <input
                    type="text"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 2h 08m or 8 Episodes"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rating">Age Rating</label>
                  <input
                    type="text"
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="e.g. U/A 16+, U"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="posterUrl">Poster Image URL (Optional)</label>
                <input
                  type="url"
                  id="posterUrl"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... (leave empty for default)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="backdropUrl">Backdrop Image URL (Optional)</label>
                <input
                  type="url"
                  id="backdropUrl"
                  value={backdropUrl}
                  onChange={(e) => setBackdropUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... (leave empty for default)"
                />
              </div>
            </div>

            <div className="form-section upload-file-section">
              <h2>Media Upload</h2>
              
              <div className="file-drop-area">
                <input
                  type="file"
                  id="videoFile"
                  onChange={handleFileChange}
                  accept="video/*"
                  required
                />
                <UploadCloud className="upload-icon" size={48} />
                <div className="file-info">
                  {videoFile ? (
                    <span className="file-name">{videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  ) : (
                    <>
                      <span>Choose a video file from your laptop</span>
                      <span className="file-hint">Supports MP4, WebM (max 500MB)</span>
                    </>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary submit-btn">
                Publish Video
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

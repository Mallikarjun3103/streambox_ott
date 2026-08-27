import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="empty-state not-found">
      <span className="eyebrow">404</span>
      <h1>That title doesn't exist.</h1>
      <p>The page you requested could not be found.</p>
      <Link className="btn btn-primary" to="/">Return Home</Link>
    </section>
  );
}

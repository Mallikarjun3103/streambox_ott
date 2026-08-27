# StreamWave — 3-tier OTT reference application

Stack:
- Presentation: React 19 + Vite
- API/business layer: Python FastAPI
- Data layer: PostgreSQL

No Dockerfiles, Docker Compose, Nginx configuration, or Certbot configuration are included.

The frontend is a static SPA and the backend is a REST API. The intended production topology is:

Browser -> Nginx/TLS -> React static assets
                         -> /api/* -> FastAPI
                                      -> PostgreSQL

The player page is deliberately a media-origin placeholder. For a real OTT system, connect it to an HLS/DASH origin/CDN and add authentication, entitlements, signed playback URLs, transcoding, subtitles, DRM, object storage, observability, and a proper identity service.

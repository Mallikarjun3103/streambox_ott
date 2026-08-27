# StreamWave backend

## Requirements
- Python 3.11+
- PostgreSQL 16+

## Local setup
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Create the PostgreSQL database/user referenced by `DATABASE_URL`, then:

```bash
python scripts/create_db.py
python scripts/seed.py
fastapi run app/main.py --host 0.0.0.0 --port 8000
```

API:
- `GET /health`
- `GET /api/v1/home`
- `GET /api/v1/movies/{slug}`
- `GET /api/v1/search?q=`
- `GET /api/v1/watchlist`
- `POST /api/v1/watchlist/{slug}/toggle`

Swagger:
`/docs`

This source intentionally contains no Dockerfile, docker-compose file, Nginx configuration, or TLS configuration.

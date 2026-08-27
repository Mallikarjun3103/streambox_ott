# StreamWave frontend

## Requirements
- Node.js 20+

## Setup
```bash
npm install
cp .env.example .env
npm run build
```

For development:
```bash
npm run dev
```

The production build is generated in `dist/`.

Set `VITE_API_BASE_URL` to the API URL exposed by your Nginx reverse proxy, for example:
`https://streamwave.internal.example/api/v1`

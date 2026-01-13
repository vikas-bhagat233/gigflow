# Frontend Deployment Guide (Vercel + Netlify)

The frontend is a Vite + React app inside `frontend/`.

Important: the frontend must know the backend URL via environment variables.

## Required environment variables

Set these in your hosting provider:

- `VITE_API_URL` = your backend API base (example: `https://your-backend.onrender.com/api`)
- `VITE_SOCKET_URL` = your backend origin for Socket.IO (example: `https://your-backend.onrender.com`)

If you don’t use sockets, you can still set `VITE_SOCKET_URL` to the backend origin.

## Deploy on Vercel

1. Import your GitHub repo into Vercel.
2. Set **Root Directory** to `frontend`.
3. Build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add the env vars above.
5. Deploy.

## Deploy on Netlify

1. Import your GitHub repo into Netlify.
2. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. Add the env vars above.
4. Deploy.

Notes:
- A SPA redirect is already included via `frontend/netlify.toml`.
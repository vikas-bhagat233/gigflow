# Backend Deployment Guide

This backend is an Express server with:
- Cookie auth (`token` httpOnly cookie)
- Socket.IO (real-time notifications)
- MongoDB (Mongoose)

## Important: Vercel vs Socket.IO

Vercel “Serverless Functions” are not a good fit for long-lived Socket.IO connections.
Recommended:
- Host the backend on Render / Railway / Fly.io / a VPS
- Host the frontend on Vercel or Netlify

## Recommended (Render) deployment

1. Create a Render Web Service from the `backend/` directory.
2. Build command: `npm install`
3. Start command: `npm start`

### Required environment variables

- `PORT` = `5000` (or Render provided port)
- `MONGO_URI` = your MongoDB connection string
- `JWT_SECRET` = a strong secret
- `NODE_ENV` = `production`
- `CLIENT_URLS` = comma-separated list of allowed frontends, e.g.
	- `https://yourapp.vercel.app,https://yourapp.netlify.app`

## Cookies & CORS

For Netlify/Vercel cross-site cookies you must use HTTPS and set `NODE_ENV=production`.
This project already sets cookies as `SameSite=None; Secure` in production.

## If you insist on Vercel for backend

You would need to refactor the backend to serverless handlers and drop Socket.IO.
If you want that version, tell me and I’ll convert it.

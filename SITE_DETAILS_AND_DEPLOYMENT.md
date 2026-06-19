# Site Details and Deployment Guide

## Project Overview

This project is a full-stack hotel/guest-house website and CMS with:

- Public site pages (home, rooms, gallery, services, treks, testimonials, blog, contact, restaurant, about).
- Admin dashboard for content management.
- Booking and inquiry management with status updates and pagination.
- Image/video upload support through Cloudinary in production.
- MongoDB database for application data (content, bookings, settings, etc.).

Repository structure:

- `client`: React + Vite frontend.
- `server`: Express + MongoDB backend API.

## Tech Stack

Frontend (`client`):

- React
- React Router
- Axios
- Vite
- Bootstrap / Bootstrap Icons

Backend (`server`):

- Node.js + Express
- MongoDB + Mongoose
- Multer for upload parsing
- Cloudinary for production media storage
- JWT auth for admin-protected endpoints

## Current Media Handling

- The backend uploads images/videos to Cloudinary when Cloudinary env keys are configured.
- Cloudinary returns secure HTTPS URLs, which are stored in MongoDB.
- If Cloudinary env keys are missing, the backend falls back to local `server/public/uploads`.

Note:
- MongoDB stores text/content/metadata and media URLs, not binary image/video data.
- Do not rely on local disk storage in production cloud hosting.

## Environment Variables

### Backend (`server/.env`)

Use this as baseline:

```env
PORT=5000
MONGODB_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_strong_secret>
CLIENT_URL=https://<your-frontend-domain>
# Optional extra frontend origins:
# CLIENT_URLS=https://www.<your-frontend-domain>,https://<preview-domain>

# Cloudinary Settings
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

### Frontend (`client/.env`)

Create:

```env
VITE_API_URL=https://pittamdeurali.onrender.com/api
```

For local development:

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Run (Development)

Backend:

```bash
cd server
npm install
npm run dev
```

Frontend:

```bash
cd client
npm install
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Production Deployment (Recommended Split)

### 1) Database (MongoDB Atlas)

1. Create an Atlas cluster.
2. Create DB user + password.
3. Whitelist deployment IPs (or allow all for initial setup, then restrict).
4. Copy connection string into `MONGODB_URL`.

### 2) Backend Deployment

Suggested platforms: Render, Railway, Fly.io, VPS.

Steps:

1. Deploy `server` as a Node service.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add env vars:
   - `PORT` (platform may auto-provide)
   - `MONGODB_URL`
   - `JWT_SECRET`
   - `CLIENT_URL=https://<your-frontend-domain>`
   - `CLIENT_URLS` if you need multiple allowed frontend domains
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
5. Verify health: `GET /` should return API running JSON.

Important:

- CORS allows local Vite during development.
- For production, set `CLIENT_URL` to your deployed frontend domain.

### 3) Frontend Deployment

Suggested platforms: Vercel, Netlify, Cloudflare Pages.

Steps:

1. Deploy `client` as a Vite app.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add env var:
   - `VITE_API_URL=https://pittamdeurali.onrender.com/api`
5. Redeploy after setting env.

## Go-Live Checklist

- [ ] Backend reachable over HTTPS.
- [ ] Frontend points to production API (`VITE_API_URL`).
- [ ] Admin login works.
- [ ] CMS updates persist in MongoDB.
- [ ] Booking and inquiry forms submit successfully.
- [ ] Uploaded images/videos are accessible from Cloudinary HTTPS URLs.
- [ ] CORS restricted to your frontend domain.
- [ ] Strong JWT secret configured.
- [ ] MongoDB backups enabled (Atlas backup policy).

## Optional Hardening Before Launch

- Restrict CORS origin in `server/server.js`.
- Add rate limiting and helmet middleware.
- Add centralized logging and error tracking.
- Add upload size/type validation on both client and server.
- Keep Cloudinary configured for durable media storage.

## Useful Scripts

Backend:

- `npm run dev`: start server with nodemon
- `npm start`: start production server
- `npm run seed`: run seed script

Frontend:

- `npm run dev`: start Vite dev server
- `npm run build`: production build
- `npm run preview`: preview built output locally

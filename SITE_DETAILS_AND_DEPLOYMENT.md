# Site Details and Deployment Guide

## Project Overview

This project is a full-stack hotel/guest-house website and CMS with:

- Public site pages (home, rooms, gallery, services, treks, testimonials, blog, contact, restaurant, about).
- Admin dashboard for content management.
- Booking and inquiry management with status updates and pagination.
- Image upload support via backend file handling.
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
- Multer for image uploads
- JWT auth for admin-protected endpoints

## Current Image Handling

- The backend currently stores uploaded files in `server/public/uploads`.
- API serves images from `/uploads/...`.
- Cloudinary env keys are optional and can stay empty.

Note:
- This is local disk storage, not MongoDB binary storage.
- On many cloud platforms, local disk is ephemeral. For production durability, use persistent storage or object storage.

## Environment Variables

### Backend (`server/.env`)

Use this as baseline:

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_strong_secret>

# Optional cloudinary vars (leave empty if not used)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (`client/.env`)

Create:

```env
VITE_API_URL=https://<your-backend-domain>/api
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
4. Copy connection string into `MONGO_URI`.

### 2) Backend Deployment

Suggested platforms: Render, Railway, Fly.io, VPS.

Steps:

1. Deploy `server` as a Node service.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add env vars:
   - `PORT` (platform may auto-provide)
   - `MONGO_URI`
   - `JWT_SECRET`
5. Verify health: `GET /` should return API running JSON.

Important:

- Current CORS is open (`origin: '*'`) for development convenience.
- For production, restrict CORS to your frontend domain.

### 3) Frontend Deployment

Suggested platforms: Vercel, Netlify, Cloudflare Pages.

Steps:

1. Deploy `client` as a Vite app.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add env var:
   - `VITE_API_URL=https://<your-backend-domain>/api`
5. Redeploy after setting env.

## Go-Live Checklist

- [ ] Backend reachable over HTTPS.
- [ ] Frontend points to production API (`VITE_API_URL`).
- [ ] Admin login works.
- [ ] CMS updates persist in MongoDB.
- [ ] Booking and inquiry forms submit successfully.
- [ ] Uploaded images are accessible from production URLs.
- [ ] CORS restricted to your frontend domain.
- [ ] Strong JWT secret configured.
- [ ] MongoDB backups enabled (Atlas backup policy).

## Optional Hardening Before Launch

- Restrict CORS origin in `server/server.js`.
- Add rate limiting and helmet middleware.
- Add centralized logging and error tracking.
- Add upload size/type validation on both client and server.
- Move uploads to durable storage if your host has ephemeral disk.

## Useful Scripts

Backend:

- `npm run dev`: start server with nodemon
- `npm start`: start production server
- `npm run seed`: run seed script

Frontend:

- `npm run dev`: start Vite dev server
- `npm run build`: production build
- `npm run preview`: preview built output locally

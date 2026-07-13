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
VITE_API_URL=https://pittamdeuraliguesthouse.com/api
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

## Production Deployment (Ubuntu VPS)

### 1) Database (MongoDB Atlas)

1. Create an Atlas cluster.
2. Create DB user + password.
3. Whitelist deployment IPs (or allow all for initial setup, then restrict).
4. Copy connection string into `MONGODB_URL`.

### 2) Backend Deployment (Node + PM2 on VPS)

Steps:

1. SSH into your VPS and install Node.js LTS and npm.
2. In project root, install backend dependencies: `cd server && npm install`.
3. Create `server/.env` with production values.
4. Start backend with PM2:

```bash
cd server
pm2 start server.js --name pittamdeurali-api
pm2 save
pm2 startup
```

5. Verify API health on VPS: `curl http://127.0.0.1:5000/`.

Alternative systemd is fine if you do not use PM2.

Backend service values:
1. Use env vars:
   - `PORT` (platform may auto-provide)
   - `MONGODB_URL`
   - `JWT_SECRET`
   - `CLIENT_URL=https://pittamdeuraliguesthouse.com`
   - `CLIENT_URLS` if you need multiple allowed frontend domains
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
2. Verify health: `GET /` should return API running JSON.

Important:

- CORS allows local Vite during development.
- For production, set `CLIENT_URL` to your VPS domain.

### 3) Frontend Deployment (Nginx on VPS)

Steps:

1. Build frontend on VPS:

```bash
cd client
npm install
npm run build
```

2. Serve `client/dist` via Nginx.
3. Add reverse proxy for API so `/api` points to backend `http://127.0.0.1:5000/api`.
4. Add reverse proxy for `/uploads` to backend `http://127.0.0.1:5000/uploads`.

Example Nginx server block:

```nginx
server {
   listen 80;
   server_name pittamdeuraliguesthouse.com www.pittamdeuraliguesthouse.com;

   root /var/www/pittamdeurali/client/dist;
   index index.html;

   location / {
      try_files $uri $uri/ /index.html;
   }

   location /api/ {
      proxy_pass http://127.0.0.1:5000/api/;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
   }

   location /uploads/ {
      proxy_pass http://127.0.0.1:5000/uploads/;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
   }
}
```

Then enable HTTPS with Certbot.

### 4) CI/CD Direct Upload to VPS Web Root

This repository now deploys frontend files from GitHub Actions directly to:

- `/www/wwwroot/pittamdeurali`

Workflow file:

- `.github/workflows/deploy.yml`

Required GitHub repository secrets:

- `VPS_HOST` (example: `178.x.x.x`)
- `VPS_USER` (SSH user, usually `root` or deploy user)
- `VPS_SSH_KEY` (private key content for the above user)
- `VPS_PORT` (optional, default `22`)

Deploy flow on each push to `main`:

1. Build React frontend in `client`.
2. Upload `client/dist` to `/tmp/pittamdeurali-dist` on VPS.
3. Rsync to `/www/wwwroot/pittamdeurali` with delete enabled.
4. Preserve `.well-known` and `.git` on the server.

If your panel points domain root to `/www/wwwroot/pittamdeurali`, new pushes to `main` will publish production automatically.

## Go-Live Checklist

- [ ] Backend reachable over HTTPS.
- [ ] Frontend points to VPS API (`VITE_API_URL` or `/api` reverse proxy).
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

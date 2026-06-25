# Social Scheduler

A full stack social scheduling workspace with AI-assisted copy generation, optional image generation, account connection, scheduling, publishing automation, and a responsive SaaS dashboard.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, Lucide Icons
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose
- Auth: JWT with bcrypt password hashing
- Integrations: Gemini for copy, Pollinations or Hugging Face for image generation, Zernio for social accounts, Cloudinary for media storage

## Local Setup

1. Install dependencies:

```bash
cd server && npm install
cd ../client && npm install
```

2. Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Fill in required server values:

- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `ZERNIO_API_KEY` for social account publishing

4. Run the apps:

```bash
cd server && npm run dev
cd client && npm run dev
```

## Image Providers

Leonardo has been removed. Image generation now goes through `server/services/imageProviders.ts`.

- Default: `IMAGE_PROVIDER=pollinations`
- Optional: `IMAGE_PROVIDER=huggingface` with `HUGGINGFACE_API_TOKEN`

The post controller only calls the provider interface, so providers can be swapped without changing business logic.

## API

The current API is available under `/api/v1` with legacy `/api` aliases preserved.

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/accounts`
- `POST /api/v1/accounts`
- `DELETE /api/v1/accounts/:id`
- `GET /api/v1/oauth/:platform/url`
- `GET /api/v1/oauth/sync`
- `GET /api/v1/posts`
- `POST /api/v1/posts`
- `POST /api/v1/posts/generate`
- `GET /api/v1/posts/generations`
- `GET /api/v1/activity`
- `GET /health`

## Deployment

Frontend deploys cleanly to Vercel or Netlify. Set `VITE_API_BASE_URL` to the backend origin.

Backend deploys to Render, Railway, Fly.io, or a VPS. Set the variables from `server/.env.example`, run `npm run build`, then `npm start`.

Docker is also included:

```bash
docker compose up --build
```

## Production Notes

- Use MongoDB Atlas or another managed MongoDB service in production.
- Set a long random `JWT_SECRET`.
- Restrict `CLIENT_URL` to the deployed frontend origin.
- Use Cloudinary credentials for persistent uploads.
- The server includes security headers, JSON size limits, upload limits, basic rate limiting, environment validation, health checks, API versioning, request validation, pagination, and MongoDB indexes.

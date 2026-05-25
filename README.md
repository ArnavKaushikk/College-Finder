# College Finder (CollegeHub)

Full-stack college discovery platform with comparison, rank prediction, Q&A, and a saved dashboard.

## Tech Stack

- Frontend: Next.js App Router, React, Tailwind CSS
- Backend: Express, Mongoose, MongoDB Atlas
- Auth: Cookie-based JWT session

## Features

- Browse and filter colleges
- View detailed college pages
- Compare up to 3 colleges side-by-side
- Predictor endpoint for rank-based guidance
- Q&A board (questions + answers)
- User dashboard for saved colleges and saved comparisons

## Monorepo Structure

```text
Demo_Project_AI_Signal/
  client/   Next.js frontend
  server/   Express API + MongoDB models/services
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas connection string

## Environment Setup

### 1) Server env

Create `server/.env.local` (or `server/.env`) from `server/.env.example`:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your-long-random-secret-at-least-32-chars
```

### 2) Client env

Create `client/.env.local` from `client/.env.example`:

```env
API_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000
JWT_SECRET=same-value-as-server-jwt-secret
```

Important: `JWT_SECRET` must match in both client and server for dashboard route protection middleware.

## Run Locally

Open two terminals.

### Terminal A (API)

```bash
cd server
npm install
npm run seed
npm run dev
```

API runs at `http://localhost:5000`.

### Terminal B (Frontend)

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Main Routes

- `/` colleges listing
- `/colleges/[id]` college detail
- `/compare` compare page
- `/predictor` predictor page
- `/qa` questions list
- `/qa/new` ask question
- `/qa/[id]` question thread
- `/dashboard` saved colleges/comparisons (protected)
- `/auth/login`, `/auth/register`

## API Overview

- `GET /api/health`
- `GET /api/colleges`, `GET /api/colleges/:id`, `GET /api/colleges/courses`
- `POST /api/predictor`
- `GET/POST /api/questions`, `GET /api/questions/:id`, `POST /api/questions/:id/answers`
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET/POST/DELETE /api/user/saved-colleges`
- `GET/POST/DELETE /api/user/saved-comparisons`

## Deployment Notes

- Deploy `client/` on Vercel
- Deploy `server/` on Render/Railway
- Set `API_URL` in client env to deployed backend URL
- Set `CLIENT_URL` in server env to deployed frontend URL
- Keep `JWT_SECRET` strong and identical where required

## Troubleshooting

- Redirected from `/dashboard` to `/auth/login`: session cookie is missing or expired, or secrets do not match.
- Dashboard/API errors: verify server is running and `client/next.config.mjs` rewrite target matches API URL.

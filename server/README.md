# CollegeHub Server

Express REST API + MongoDB Atlas.

```bash
cp .env.example .env
npm install
npm run seed
npm run dev
```

## Endpoints

- `GET /api/colleges` — list (q, minFees, maxFees, course, page)
- `GET /api/colleges/courses` — distinct courses for filter
- `GET /api/colleges/:id` — detail
- `POST /api/predictor` — `{ exam, rank }`
- `GET/POST /api/questions` — Q&A
- `POST /api/auth/login`, `/register`, `/logout`
- `GET /api/auth/me`
- `GET/POST/DELETE /api/user/saved-colleges`
- `GET/POST /api/user/saved-comparisons`

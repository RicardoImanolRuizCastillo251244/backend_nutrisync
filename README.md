# NutriSync Backend

Backend API for NutriSync (web + mobile) built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Quick start

1. Copy env vars:
   - `cp .env.example .env` (or create manually on Windows)
2. Install dependencies:
   - `npm install`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migrations:
   - `npm run prisma:migrate`
5. Seed nutritionist user:
   - `npm run prisma:seed`
6. Start dev server:
   - `npm run dev`

## Scripts

- `npm run dev`: run API in watch mode
- `npm run build`: compile TypeScript
- `npm run start`: run compiled output
- `npm run prisma:generate`: generate Prisma client
- `npm run prisma:migrate`: run dev migrations
- `npm run prisma:seed`: seed initial data

## Seed user

- Email: `nutritionist@nutrisync.com`
- Password: `NutriSync123!`

## Docs

- Swagger UI: `http://localhost:3001/docs`
- Health check: `http://localhost:3001/health`

## Current implemented routes (v1)

- `POST /v1/auth/login`
- `POST /v1/auth/refresh`
- `POST /v1/auth/logout`
- `GET /v1/patients`
- `POST /v1/patients`
- `GET /v1/patients/:id`
- `PATCH /v1/patients/:id`
- `DELETE /v1/patients/:id`
- `POST /v1/meal-plans/generate-suggested`
- `GET /v1/meal-plans/foods/search?query=...`
- `POST /v1/voice-notes` (multipart field: `file`)

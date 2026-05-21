# Software Company Platform

Monorepo scaffold for:

- Marketing website
- Client dashboard
- Admin dashboard
- Project management system

## Apps

- `frontend`: Next.js + Tailwind CSS
- `backend`: Node.js + Express + MongoDB

## Current Modules

- Authentication with JWT and bcrypt
- Admin and client dashboards
- Services catalog with admin CRUD
- Project request workflow
- Real-time messaging with Socket.io
- Notifications
- Billing foundation with Stripe checkout endpoints
- AI support chatbot with OpenAI fallback mode
- Security baseline with Helmet and rate limiting

## Quick start

1. Install dependencies in the workspace root:
   `npm install`
2. Copy env files:
   - `frontend/.env.example` to `frontend/.env.local`
   - `backend/.env.example` to `backend/.env`
3. Run each app:
   - `npm run dev:frontend`
   - `npm run dev:backend`

## Production Scripts

- `npm run build:frontend`
- `npm run start:frontend`
- `npm run start:backend`

## VS Code

You can run the project from VS Code terminals or Tasks:

- Frontend task: `Frontend: Dev Server`
- Backend task: `Backend: Dev Server`

## Notes

- The frontend and backend scripts are pinned to the local Windows Node executable so `npm run ...` works reliably from VS Code in this environment.
- Stripe checkout requires valid Stripe environment variables before live payments can complete.
- OpenAI chatbot responses use a local fallback mode until `OPENAI_API_KEY` is configured.
- Set `ALLOW_ADMIN_SELF_REGISTRATION=false` in production.

## Deployment

See [DEPLOYMENT.md](C:/Users/Copy/Documents/Codex/2026-04-25/you-are-a-senior-full-stack/DEPLOYMENT.md).

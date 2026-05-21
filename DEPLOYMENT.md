# Deployment Guide

## Environment

Backend required variables:

- `PORT`
- `NODE_ENV`
- `CLIENT_URL`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `BCRYPT_SALT_ROUNDS`
- `ALLOW_ADMIN_SELF_REGISTRATION=false` for production

Optional integrations:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_GROWTH`
- `STRIPE_PRICE_SCALE`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

Frontend required variables:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`

## Build

1. Install dependencies at workspace root:
   `npm install`
2. Build frontend:
   `npm run build:frontend`

## Run

1. Start backend:
   `npm run start:backend`
2. Start frontend:
   `npm run start:frontend`

## Recommended Production Setup

- Host frontend and backend behind HTTPS.
- Use a managed MongoDB deployment.
- Set `CLIENT_URL` and `NEXT_PUBLIC_*` URLs to the deployed domains.
- Disable admin self-registration.
- Configure Stripe keys and price ids before enabling billing.
- Configure OpenAI API key before enabling live chatbot responses.
- Run backend behind a reverse proxy that supports WebSockets for Socket.io.

## Performance Notes

- The frontend uses the App Router and static rendering where possible.
- Service lists and dashboard pages are split into focused route modules.
- WebSocket traffic is isolated to messaging and live notification events.

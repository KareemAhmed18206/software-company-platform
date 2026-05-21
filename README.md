# Software Company Platform

Enterprise-grade private SaaS platform and company website built with a modern full-stack architecture, secure role-based access, real-time collaboration, payments integration, and AI-powered customer support.

## Overview

This project combines:

- A modern marketing website
- A secure client portal
- An admin dashboard
- A project request and management workflow
- Real-time messaging and notifications
- Billing and AI support foundations

It is designed as a scalable monorepo with clear separation between frontend, backend, domain modules, and shared infrastructure.

## Tech Stack

- Frontend: `Next.js`, `Tailwind CSS`
- Backend: `Node.js`, `Express`
- Database: `MongoDB`
- Authentication: `JWT`, `bcrypt`
- Real-time: `Socket.io`
- Payments: `Stripe`
- AI: `OpenAI API` with local fallback mode

## Core Features

- Secure authentication with JWT and password hashing
- Role-based access for `admin` and `client`
- Responsive marketing website and dashboard shell
- Services catalog with admin CRUD management
- Project request workflow with status tracking
- Real-time client-admin messaging
- In-app notifications
- Billing foundation with Stripe checkout endpoints
- AI-powered support assistant
- Security baseline with `helmet`, rate limiting, and request sanitization

## Project Structure

- `frontend`: Next.js application for the public website and dashboards
- `backend`: Express API with modular business domains

## Getting Started

1. Install dependencies from the workspace root:
   `npm install`
2. Create environment files:
   - Copy `frontend/.env.example` to `frontend/.env.local`
   - Copy `backend/.env.example` to `backend/.env`
3. Run the applications:
   - `npm run dev:frontend`
   - `npm run dev:backend`

## Available Scripts

- `npm run dev:frontend`
- `npm run dev:backend`
- `npm run build:frontend`
- `npm run start:frontend`
- `npm run start:backend`

## Environment Notes

- Configure MongoDB in `backend/.env`
- Add Stripe keys before enabling live billing flows
- Add `OPENAI_API_KEY` for live AI responses
- Set `ALLOW_ADMIN_SELF_REGISTRATION=false` in production

## VS Code

Run the project from integrated terminals or VS Code tasks:

- `Frontend: Dev Server`
- `Backend: Dev Server`

## Deployment

Deployment notes and environment guidance are available in [DEPLOYMENT.md](C:/Users/Copy/Documents/Codex/2026-04-25/you-are-a-senior-full-stack/DEPLOYMENT.md).

## Proprietary Notice

This repository is private and proprietary. No part of this software may be copied, modified, distributed, sublicensed, or used without prior written permission from the owner.

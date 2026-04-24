# UrFriends Web App (`public`)

This Next.js 15 app powers both the UrFriends marketing site and the authenticated dashboard.

## Purpose
- Provide the logged-in experience for web users (contacts, tiers, reminders)
- Host the marketing/landing pages, pricing, and onboarding funnel

## Used By
- End users via web browser
- Internal QA agents verifying flows before mobile parity

## Depends On
- Firebase Auth + Firestore (`urfriends-beta`) configured via `.env.local` / `secrets.ts`
- UrFriends backend APIs (`urhumans-api`, `create-user-acct-service`)
- Stripe Checkout + Billing Portal endpoints

## System Context
- Users sign in with Google → Firebase Auth session
- App fetches Firestore data directly (TanStack Query) and calls UrFriends APIs for writes
- Stripe buttons hit `/api/stripe/*` routes that proxy to Stripe + `urfriends-stripe-webhooks`

> TODO: add diagram snippet once the org-level draw.io exists.

## Contracts
- `/api/stripe/checkout` proxy expects `{ email, priceId }`
- `/api/stripe/webhook` handled via cloud functions (see repo)
- Frontend expects Firestore collections: `user_info/{uid}`, `phonebook`, `lastConvo`

> TODO: document typed schemas for phonebook entries + conversations.

## Structure
- `src/app/page.tsx` – landing + dashboard entry point
- `src/context/auth-context.tsx` – Firebase Auth provider
- `src/components/**` – shadcn + custom UI (Phonebook, Tier, Modal, etc.)
- `src/app/api/stripe/*` – Next API routes for Stripe
- `src/services/**` – Firestore + Stripe helper functions

## Quick Start
```bash
npm install
npm run dev   # runs on http://localhost:9002
npm run build && npm start
```
Requires `.env.local` + `secrets.ts` (ignored) with Firebase + Stripe keys.

## Repo Map
> TODO: add `REPO_MAP.md` detailing component groups (marketing, dashboard, features) for agents.

## Inspiration
The product concept is rooted in historical relationship-building systems (Benjamin Franklin’s routines, Marcus Aurelius’s journal, etc.) and aims to bring intentionality back to modern networks.

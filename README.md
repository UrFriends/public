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
### Top-Level Execution Flow
- Next.js App Router entry: `src/app/page.tsx` -> renders landing OR dashboard depending on auth state.
- Auth provider (`src/context/auth-context.tsx`) wraps everything; once Firebase Auth resolves, we either render `<LandingPage/>` or `<DashboardView/>`.
- Dashboard flow: Authenticated user -> Redux store populated via TanStack Query -> renders components (Phonebook, tiers, modals).
- API interactions: Firestore reads via `@firebase/firestore` and writes via service helpers (or `urhumans-api` / Stripe routes).

### Domain Modules
- **Landing (marketing)**: Hero + pricing in `src/app/page.tsx` (when user unauthenticated). Reads static copy, triggers login route. Side effects: none except navigation. Triggers: direct visits or `logout`.
- **Dashboard**: `DashboardView` inside `src/app/page.tsx`. Reads Firestore via query hook, dispatches to Redux. Writes: converses with Firestore/Stripe via service functions. Triggers: Auth success. Side effects: notifications, modals, CTA to subscribe. Data touched: `user_info`, `phonebook`, `lastConvo`.
- **Phonebook + Tiers**: `src/components/Phonebook.tsx`, `Tier.tsx`, `ContactCard.tsx`. Responsibility: render grouped contacts + actions. Triggered when Redux store updates. Writes done via service functions invoked from modals. Side effects: modal open, `add_Conversation`, `changeProperty_*`.
- **Settings / Shortcuts**: components like `RandomButtonBar`, `Modal`, `Notification`. Manage UI state + call Firestore services. Data touched: user settings, tiers. Side effects: tasks kicked to Firebase via service functions.

### Shared Services
- `src/context/auth-context.tsx`: wraps Firebase Auth; exposes `loginWithGoogle`, `logout`.
- `src/components/features/*`: Redux slices for `modal`, `notification`, `data`. Provide state + actions to the rest of the app. External touches: local storage (future), Firestore updates triggered via service functions. Used by dashboard components.
- `services/fireBaseServices.ts`: (imported via aliases) houses Firestore CRUD + Stripe helper functions. External systems: Firestore, Stripe, notifications. Called by UI + modals.
- `src/app/api/stripe/*`: Next API routes bridging to Stripe + `urfriends-stripe-webhooks`. Provide local development wire-up for checkout/billing. Used by pricing CTA + dashboard subscribe button.

### Relationships & Data Flow
- Landing -> Login -> AuthContext -> Dashboard. Dashboard fetches Firestore, populates Redux, components render. Components call service functions (FireStore/Stripe) which may update backend repos. Redux listens for success/error to show notifications.
- Stripe CTA -> `/api/stripe/checkout` -> Stripe session -> `urfriends-stripe-webhooks` -> updates subscription docs -> Dashboard re-fetches and updates UI.
- Conversations/Tiers -> service functions -> Firestore -> `cloud-functions` (if listening) -> downstream automations.

### Data & Side Effects
- Reads: Firestore (`user_info`, `phonebook`, `lastConvo`, `settings`), Redux store, environment config. Writes: Firestore via services, Stripe checkout, notifications state, modals state.
- Side effects include: notifications, modals, external API requests (Stripe, Firebase cloud functions).

### TODO / Repo Map
- [ ] Create `REPO_MAP.md` breaking down marketing vs dashboard code, detailing `services/fireBaseServices` helpers, listing each Redux slice and its consumers.
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

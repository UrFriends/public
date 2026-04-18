# Instructions for the Next AI Pass

The UrFriends repo is a Next.js 15 (App Router) SaaS project that's designed for building relationships, has an authenticated dashboard, Firebase backend, and Stripe billing hooks. There are other repositories for microservices that support the hosted beta. The staging branch is where the hosted beta is published from. This is the first time we’ve exposed it to an AI agent, so treat the stack with care—no unapproved mutations against production data.

## Branch Policy
- Default branch is `main`; but there’s also a `staging` branch--which is where the main app is published to--but no entrenched long-lived branches. Coordinate with Jay before creating new ones.
- Deployments come from the Next.js build pipeline (`next build` → self-host). There’s no GitHub Pages mirror here.
- **Secrets are not in git.** `src/lib/firebase.ts` imports `DEV_API_KEY` and `SECRET_KEY` from `../../secrets`, and `/app/api/stripe` expects `process.env.SECRET_KEY`. Keep keys in a local `secrets.ts` or `.env.local`, never in the repo.

## Quick Orientation
- **App entry:** `src/app/page.tsx` serves both the marketing landing page and the logged-in dashboard. When a user is authenticated it renders the dashboard inside `AuthProvider`, Redux `Provider`, and a global `QueryClientProvider`.
- **Routing:** App Router structure under `src/app`. Auth flows (`/login`, `/subscribe`) are client components. API routes live under `src/app/api/*` (e.g., `api/stripe/checkout`, `api/stripe/webhook`).
- **State layer:**
  - Firebase Auth context (`src/context/auth-context.tsx`) exposes `loginWithGoogle`, `logout`, and guards children while auth resolves.
  - Redux Toolkit store (`src/app/store.ts`) combines `modal`, `notification`, and `accountData` slices found in `src/components/features/*`.
  - TanStack React Query fetcher inside `DashboardView` loads Firestore data and hydrates the Redux slice.
- **Backend integrations:**
  - Firebase client SDK configured in `src/lib/firebase.ts`. Firestore/Storage rules live at repo root (`database.rules.json`, `storage.rules`).
  - Stripe helpers are in `services/stripe.ts`; server-side Stripe calls happen in `src/app/api/stripe/*` with the Node SDK.
  - Firestore CRUD helpers for contacts, conversations, tiers live in `services/fireBaseServices.ts`.
- **UI system:** Tailwind + shadcn/ui. `components.json` configures the shadcn generator. Custom components (Phonebook, Modal, RandomButtonBar, etc.) are under `src/components/`.
- **Genkit / AI hooks:** (This is provided directly by Jay, the rest is AI generated: I added this because in the future I want to add AI tools, but that's probably a long way away) `src/ai/genkit.ts` registers `@genkit-ai/googleai` with `googleai/gemini-2.0-flash`. `src/ai/dev.ts` is a placeholder for running Genkit flows with `npm run genkit:dev`.
- **Types:** Centralized in `types/Types.ts` for contacts, conversations, tiers, component props.
- **Hosting config:** `firebase.json`, `apphosting.yaml`, etc., are present for future Firebase Hosting/App Hosting setups—coordinate before editing.

## Commands
| Purpose | Command | Notes |
| --- | --- | --- |
| Dev server (Turbopack) | `npm run dev` | Serves on port **9002**. Requires local secrets for Firebase + Stripe. |
| Build | `npm run build` | Production Next build. |
| Start | `npm run start` | Runs the compiled app. |
| Lint | `npm run lint` | Uses Next.js ESLint config. |
| Typecheck | `npm run typecheck` | `tsc --noEmit`. |
| Genkit dev loop | `npm run genkit:dev` / `npm run genkit:watch` | Needs `genkit` CLI installed locally. |

## Data / Auth Flow Snapshot
1. **Google OAuth login** via `signInWithPopup` inside the auth context. `AuthProvider` waits on `onAuthStateChanged` before rendering children.
2. **User bootstrap:** `createUserAccount` seeds `user_info/{uid}` doc with tier defaults + a stub `phonebook` doc if the user is new (`check_if_user_has_DB`).
3. **Dashboard fetch:** React Query (`@tanstack/react-query`) loads `user_info/{uid}` plus nested `phonebook/{contact}/lastConvo` subcollections, organizes data by tier, then dispatches `populateData` to Redux.
4. **Phonebook UI:** `Phonebook` → `Tier` → `ContactCard` render tiers and contacts; `RecentConversations`, `Modal`, `Notification`, and `RandomButtonBar` provide UI affordances.
5. **Mutations:** CRUD helpers in `services/fireBaseServices.ts` update Firestore and surface toast notifications.
6. **Stripe billing:** Client-side `handleSubscribe` hits `/api/stripe/checkout`. Server-side utilities in `services/stripe.ts` create customers, checkout sessions, and handle webhook updates (via `handleSubscriptionUpdated`).
7. **AI hooks:** Genkit is wired but no flows defined yet.

## Environment Checklist
- `secrets.ts` (ignored) must export `DEV_API_KEY` + `SECRET_KEY` for Firebase/Stripe server helpers.
- `.env.local` (ignored) should provide `SECRET_KEY`, publishable Stripe keys, and any `NEXT_PUBLIC_*` Firebase config you surface to the client.
- Firebase CLI uses `firebase.json`, `database.rules.json`, `storage.rules`. Keep these sync’d with console-side rules before deploying.

## Known Follow-ups / TODOs
- Update marketing copy + `docs/blueprint.md` with finalized content.
- Clean up `services/fireBaseServices.ts` (`location.reload()` calls → state-based refresh).
- Harden Stripe checkout: `/api/stripe/checkout/routes.ts` still points at a fake `price_12345` and placeholder success/cancel URLs.
- Build or remove the Genkit flows depending on roadmap.
- Review client/server component boundaries—many feature components import browser-only APIs, so keep them as client components.
- Add analytics/observability once the product is public.

## Working Agreement
For now this repo is in **read/document** mode. Don’t push code changes unless Jay explicitly asks for them. When future dev work starts, run `npm install`, create `secrets.ts` / `.env.local`, then `npm run dev` (port 9002) and verify Firebase + Stripe creds are valid before touching auth or billing logic.

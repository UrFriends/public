# Legacy public Repository Guidance

## Repository status

Legacy/archive source. This repository is not the active urhumans frontend, is
not deployed, and is not authoritative for current behavior or configuration.

## Rules

- Use `urhumans_frontend` for active client implementation.
- Use `urhumans_backend` for current APIs and privileged services.
- Treat this repository only as historical evidence or a source of explicitly
  selected product ideas.
- Do not run it with current staging or production credentials.
- Do not deploy it, restore its Firebase project assumptions, or copy its direct
  Firestore access patterns into active code.
- References to `urfriends-beta`, removed standalone services, Firebase App
  Hosting, and old Stripe behavior are historical.
- Prefer documentation-only changes. Ask before modifying legacy application
  source or reviving a deferred feature.

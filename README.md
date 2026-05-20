# Visitor Location Web

Next.js app for consent-based visitor location capture.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Admin history

Visit `http://localhost:3000/history` and enter the admin key from `.env.local`.

The default local key is:

```text
change-me-local
```

Change `ADMIN_KEY` before deploying.

## Privacy note

Exact location is saved only after the visitor clicks the location button and allows the browser permission prompt. Saved records are stored in `data/visits.json`.

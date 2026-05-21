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

## MongoDB storage

Visitor locations are saved in MongoDB. Add these values to `.env` or `.env.local`:

```text
MONGODB_URI=mongodb+srv://user:password@cluster.example.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=visitor-location-web
MONGODB_VISITS_COLLECTION=visits
```

`MONGODB_DB` and `MONGODB_VISITS_COLLECTION` are optional. The app defaults to
`visitor-location-web` and `visits`.

## Privacy note

Exact location is saved only after the visitor clicks the location button and allows the browser permission prompt. Saved records are stored in the configured MongoDB `visits` collection.

# BlinkBuy Emergency — Standalone App

A fully standalone extraction of the Emergency module from BlinkBuy Malawi.  
Connects to the **existing BlinkBuy Supabase backend** without any backend changes.

---

## What's included

| Feature | Description |
|---|---|
| Emergency category picker | 8 emergency types (Plumbing, Electrical, Medical Transport, etc.) |
| Send emergency alert | Inserts into `emergency_requests` table via Supabase RLS |
| Live worker list | Fetches available workers from `profiles` table |
| Direct contact | One-tap call and WhatsApp buttons |
| Auth integration | Shared session with main BlinkBuy app (same `localStorage` key) |
| Login / Register | Full email+password and Google OAuth |
| Dark mode | Synced with user preference |
| PWA | Installable, service worker, manifest |

---

## Requirements

- Node.js **18+**
- npm **9+** (or pnpm / yarn)
- A running BlinkBuy Supabase project (backend unchanged)

---

## Setup

### 1. Clone / copy this folder

```bash
# If coming from the ZIP:
unzip blinkbuy-emergency.zip
cd emergency-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these values from:  
**Supabase Dashboard → Your Project → Settings → API**

> ⚠️ These are the **same credentials** used by the main BlinkBuy app.  
> The Emergency app shares the same Supabase project and auth session.

---

## Run (development)

```bash
npm run dev
```

Opens at `http://localhost:5173`

---

## Build (production)

```bash
npm run build
```

Output goes to `dist/`. Deploy to Vercel, Netlify, or any static host.

### Vercel one-click deploy

```bash
npm i -g vercel
vercel --prod
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the Vercel dashboard.

---

## Backend connection

The app connects directly to **Supabase** (no intermediate API server).

### Tables used

| Table | Operation | Description |
|---|---|---|
| `profiles` | SELECT | Fetch available workers |
| `emergency_requests` | INSERT | Store alert submissions |

### Auth

- Uses `supabase.auth` with the same `storageKey: 'blinkbuy_auth_token'` as the main app.  
- If a user is already logged in to BlinkBuy in the same browser, they will be automatically authenticated here.

### RLS (Row Level Security)

The existing RLS policies on `emergency_requests` require the user to be authenticated.  
The app gates the alert form behind a login check and passes `user_id` explicitly to satisfy `WITH CHECK` policies.

---

## Routes

| Path | Page |
|---|---|
| `/` | Emergency dashboard (main page) |
| `/emergency` | Same as `/` |
| `/login` | Login page |
| `/register` | Registration page |

---

## Project structure

```
emergency-app/
├── public/
│   ├── favicon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── components/
│   │   ├── ui/          # Shared UI primitives (button, badge, etc.)
│   │   ├── ErrorBoundary.tsx
│   │   └── Layout.tsx   # Header + footer shell
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePWA.ts
│   │   ├── useScrollToTop.ts
│   │   └── useTheme.ts
│   ├── lib/
│   │   ├── api.ts       # Emergency-scoped API client
│   │   ├── auth.ts      # Auth helpers (theme, language, Google OAuth)
│   │   ├── cache.ts     # TTL cache utility
│   │   ├── supabase.ts  # Supabase client
│   │   └── utils.ts     # cn() helper
│   ├── pages/
│   │   ├── emergency.tsx  ← main feature
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── not-found.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Emergency contact numbers (Malawi)

- **National Emergency:** 998  
- **BlinkBuy Emergency Line:** +265 999 626 944

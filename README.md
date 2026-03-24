# Ashor's Fade — Barbershop Website

A modern barbershop booking website built with React, TypeScript, Vite, Tailwind CSS, and Firebase.

## Features

- Online appointment booking
- Google Sign-In (admin only — `madilamin098@gmail.com`)
- Firebase Storage for protected images
- Admin dashboard to manage bookings
- Fully responsive design

---

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values from Firebase Console → Project Settings → Your Apps → SDK setup.

> ⚠️ Never commit your `.env` file — it is already in `.gitignore`.

### 4. Run the dev server

```bash
npm run dev
```

App runs at `http://localhost:3000`.

---

## Firebase Setup (one-time)

1. **Authentication** → Enable Google sign-in
2. **Authentication → Authorized domains** → Add your live domain
3. **Storage** → Upload images at the paths in `STORAGE_IMAGE_PATHS` inside `src/App.tsx`
4. **Storage Rules** → Restrict to admin email only:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null
        && request.auth.token.email == 'madilamin098@gmail.com';
      allow write: if false;
    }
  }
}
```

---

## Deploy via GitHub Actions (auto-deploy on push to main)

### Step 1 — Add GitHub Repository Secrets

Go to: **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret | Where to find it |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Console → Project Settings → SDK config |
| `VITE_FIREBASE_AUTH_DOMAIN` | same |
| `VITE_FIREBASE_PROJECT_ID` | same |
| `VITE_FIREBASE_STORAGE_BUCKET` | same |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | same |
| `VITE_FIREBASE_APP_ID` | same |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Console → Project Settings → Service accounts → Generate new private key (paste the full JSON) |

### Step 2 — Initialize Firebase Hosting locally (one-time)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Public directory: dist
# Single-page app: Yes
# Overwrite dist/index.html: No
```

### Step 3 — Push to main

```bash
git add .
git commit -m "initial deploy"
git push origin main
```

Every push to `main` will automatically build and deploy. Your live URL: `https://YOUR_PROJECT_ID.web.app`

---

## Project Structure

```
├── src/
│   └── App.tsx               # All components + Firebase logic
├── .env.example              # Safe-to-commit env template (no real secrets)
├── .gitignore                # Ignores .env, node_modules, dist
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD pipeline
├── firebase.json             # Firebase Hosting config (SPA rewrites)
└── vite.config.ts            # Vite build config with env var support
```

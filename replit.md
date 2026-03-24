# Ashor's Fade — Barbershop Website

A modern barbershop booking website built with React and Firebase.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (Framer Motion)
- **Backend/Auth**: Firebase (Authentication, Storage, Hosting)
- **AI**: Google Generative AI (Gemini)

## Project Structure

```
.
├── src/
│   ├── App.tsx       # Main component with Firebase integration
│   ├── main.tsx      # React entry point
│   └── index.css     # Global styles (Tailwind)
├── index.html        # HTML entry point
├── vite.config.ts    # Vite configuration
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── firebase.json     # Firebase Hosting configuration
```

## Environment Variables

The following environment variables are required for Firebase and AI features:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `GEMINI_API_KEY`

## Development

- **Start**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`

## Deployment

Configured as a static site deployment:
- Build command: `npm run build`
- Public directory: `dist`

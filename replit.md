# Ashor's Fade — Barbershop Website

A modern barbershop booking website built with React and Firebase.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (Framer Motion)
- **Storage**: Firebase Storage (images only — no auth)
- **Bookings**: Google Sheets via Google Apps Script webhook

## Project Structure

```
.
├── src/
│   ├── App.tsx       # Main component — all UI, booking logic, Sheets integration
│   ├── main.tsx      # React entry point
│   └── index.css     # Global styles (Tailwind)
├── index.html        # HTML entry point
├── vite.config.ts    # Vite configuration (port 5000, allowedHosts: true, ignores .local/**)
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── firebase.json     # Firebase Hosting configuration
```

## Booking Flow

1. Customer fills out booking form (service, barber, date, time, name, email, phone)
2. On submit, booking is saved to `localStorage` (for taken-slot tracking)
3. Booking data is POSTed to a Google Apps Script web app URL
4. The Apps Script appends a row to the Google Sheet (Date, Time, Service, Name, Email, Phone, Barber, Booked At)

## Environment Variables / Secrets

- `VITE_FIREBASE_API_KEY` — Firebase project API key (for Storage)
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_GOOGLE_SCRIPT_URL` — Google Apps Script web app URL (receives POST, writes to sheet)

## Key Implementation Notes

- Firebase auth has been fully removed — no sign-in, no admin panel
- Firebase Storage init is conditional (`firebaseConfigured` guard + try/catch)
- Google Sheets POST uses `mode: 'no-cors'` (fire-and-forget; Apps Script must be deployed as "Anyone" access)
- Vite watcher ignores `.local/**` to prevent constant reload from Replit internal files

## Development

- **Start**: `node_modules/.bin/vite --host 0.0.0.0 --port 5000`
- **Build**: `npm run build`

## Deployment

Configured as a static site deployment:
- Build command: `npm run build`
- Public directory: `dist`

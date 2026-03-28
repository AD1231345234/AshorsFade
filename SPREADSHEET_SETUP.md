# Daily Spreadsheet Feature - Setup Guide

Your Ashor's Fade site now has a professional daily spreadsheet system with automatic email reminders!

## ✅ What Was Implemented

1. **Frontend Components**
   - `src/components/DailySpreadsheet.tsx` - Clean, professional spreadsheet UI
   - `src/components/DailySpreadsheet.css` - Dark theme styling matching your site
   - Integrated into `App.tsx` with navigation button

2. **Backend Service**
   - `/backend/server.ts` - Express server on port 3001
   - `/backend/services/spreadsheetService.ts` - Spreadsheet logic and email handling
   - `/backend/routes/spreadsheet.ts` - API endpoints

3. **Navigation**
   - "Schedule" button added to desktop navigation
   - "Daily Schedule" option in mobile menu
   - Clean transitions between Home, Booking, and Schedule views

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
npm install express nodemailer node-cron cors ts-node typescript @types/node @types/express
```

### Step 2: Set Up Email

1. Copy `.env.example` to `.env`
2. Generate Gmail app password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
3. Update `.env` with your email config:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_RECIPIENTS=admin@ashorsbarber.com,staff@ashorsbarber.com
PORT=3001
```

### Step 3: Run the Backend

In a new terminal:

```bash
npx ts-node backend/server.ts
```

You should see:
```
Server running on port 3001
Email reminder scheduled for 8 AM daily
```

### Step 4: Start the Frontend

In your existing terminal:

```bash
npm run dev
```

### Step 5: Access the Spreadsheet

Navigate to `http://localhost:5173` and click the "Schedule" button in the navigation.

## 📋 Features

### Daily Spreadsheet
- **Add Appointments**: Fill in time, client name, service, barber, and notes
- **Track Status**: Mark appointments as Pending, Completed, or Cancelled
- **Auto-organized**: New tab created every day automatically
- **Clean Layout**: Professional formatting with proper spacing and labels

### Email Reminders
- **Automatic**: Sent daily at 8 AM with formatted HTML table
- **Professional**: Shows all appointments for the day with status
- **Color-coded**: Status indicators (Yellow: Pending, Green: Completed, Red: Cancelled)
- **Manual Option**: Call `/api/spreadsheet/send-reminder` to send anytime

## 📧 Email Template

The daily reminder email includes:
- Shop name and date
- Professional table with columns: Time, Client, Service, Barber, Notes, Status
- Color-coded status indicators
- Automatic formatting for readability

## 🔧 API Endpoints

All endpoints run on `http://localhost:3001`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/spreadsheet/today` | Get today's schedule |
| POST | `/api/spreadsheet/add` | Add new appointment |
| PUT | `/api/spreadsheet/row/:index/status` | Update appointment status |
| POST | `/api/spreadsheet/send-reminder` | Send email reminder manually |

## 🎨 UI Integration

The spreadsheet matches your site's dark theme:
- Black backgrounds (#111, #1a1a1a)
- White text with proper contrast
- Blue action buttons (#3498db)
- Consistent typography and spacing
- Responsive grid layout

## 💾 Storage

Currently uses **in-memory storage** (resets on server restart). For production:
- Connect to MongoDB, PostgreSQL, or Firebase
- Data persists across server restarts
- Can archive historical data

## ⚠️ Important Notes

- **Local Development**: Backend connects to localhost:3001
- **Production**: Update frontend API URL in `DailySpreadsheet.tsx`
- **Email**: Gmail requires app-specific password (not your regular password)
- **Data**: Currently clears daily - add database for persistence

## 🐛 Troubleshooting

### Email not sending?
- Check EMAIL_USER and EMAIL_PASSWORD in `.env`
- Verify Gmail app password is correct
- Ensure EMAIL_RECIPIENTS is comma-separated

### CORS error?
- Backend CORS is already configured
- Ensure backend is running on 3001

### Spreadsheet not loading?
- Check if backend server is running
- Open browser DevTools Console
- Look for error messages in backend terminal

## 📱 Mobile Support

The spreadsheet is fully responsive:
- Works on mobile, tablet, and desktop
- Touch-friendly buttons and dropdowns
- Horizontal scroll for large tables

## 🎯 Next Steps

1. ✅ Run backend: `npx ts-node backend/server.ts`
2. ✅ Run frontend: `npm run dev`
3. ✅ Test the "Schedule" button
4. ✅ Add sample appointments
5. ✅ Test email sending (click "send-reminder" or wait until 8 AM)

## 🚀 Deployment

When ready to deploy:
1. Deploy backend (Heroku, Railway, Render.com)
2. Update API URL in `DailySpreadsheet.tsx`
3. Add environment variables to hosting platform
4. Deploy frontend to GitHub Pages

---

**Questions?** Check backend/README.md for more details!

# Ashor's Fade - Backend Setup

This backend provides the daily spreadsheet API for managing barbershop appointments and scheduling email reminders.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install express nodemailer node-cron cors ts-node typescript @types/node @types/express
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_RECIPIENTS=admin@ashorsbarber.com,staff@ashorsbarber.com
PORT=3001
```

**Important:** To generate an email password for Gmail:
1. Enable 2-Step Verification on your Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Generate an app password (16 characters)
5. Use this password in `EMAIL_PASSWORD`

### 3. Run the Backend Server

```bash
npx ts-node backend/server.ts
```

The server will start on `http://localhost:3001`

### 4. Backend Features

- **Daily Schedule Management**: Create, read, and update appointment records
- **Automatic Email Reminders**: Sends formatted email at 8 AM daily with the day's schedule
- **Status Tracking**: Mark appointments as pending, completed, or cancelled
- **Clean Data Format**: Professional HTML email templates

### 5. API Endpoints

#### Get Today's Schedule
```
GET /api/spreadsheet/today
```

#### Add New Appointment
```
POST /api/spreadsheet/add
Body: {
  "time": "10:00",
  "client_name": "John Doe",
  "service": "Haircut & Beard",
  "barber": "Ashor",
  "notes": "First time customer"
}
```

#### Update Appointment Status
```
PUT /api/spreadsheet/row/:index/status
Body: {
  "status": "completed" | "pending" | "cancelled"
}
```

#### Send Email Reminder Manually
```
POST /api/spreadsheet/send-reminder
```

### 6. Production Deployment

For production, replace the in-memory storage with a database:

- **MongoDB**: Add mongoose for data persistence
- **PostgreSQL**: Use typeorm or sequelize
- **Firebase**: Use Firestore for cloud storage

Current in-memory storage is suitable for single-day usage and resets when the server restarts.

## Troubleshooting

### Email Not Sending
- Verify Gmail app password is correct
- Check that 2-Step Verification is enabled on Google Account
- Ensure recipients email is in `EMAIL_RECIPIENTS` environment variable
- Check server logs for error messages

### CORS Errors
- Ensure frontend is running on `http://localhost:3000`
- Backend has CORS enabled for all origins by default (frontend at localhost:3000)

### Port Already in Use
- Change `PORT` in `.env` to an available port (e.g., 3002)
- Or kill the existing process using port 3001

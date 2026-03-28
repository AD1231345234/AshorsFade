import express from 'express';
import cors from 'cors';
import spreadsheetRoutes from './routes/spreadsheet';
import { scheduleEmailReminder } from './services/spreadsheetService';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/spreadsheet', spreadsheetRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Email reminder scheduled for 8 AM daily');
  
  // Initialize daily sheet on server start
  scheduleEmailReminder();
});

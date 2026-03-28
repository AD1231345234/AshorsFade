import express from 'express';
import { spreadsheetService } from '../services/spreadsheetService';

const router = express.Router();

// Get today's schedule
router.get('/today', (req, res) => {
  const sheet = spreadsheetService.getTodaySheet();
  res.json(sheet);
});

// Add new appointment
router.post('/add', (req, res) => {
  const row = spreadsheetService.addRow(req.body);
  res.json(row);
});

// Update appointment status
router.put('/row/:index/status', (req, res) => {
  const { index } = req.params;
  const { status } = req.body;
  spreadsheetService.updateRowStatus(parseInt(index), status);
  res.json({ success: true });
});

// Send reminder manually
router.post('/send-reminder', async (req, res) => {
  await spreadsheetService.sendDailyReminder();
  res.json({ success: true, message: 'Reminder sent' });
});

export default router;

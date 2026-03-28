import nodemailer from 'nodemailer';
import cron from 'node-cron';

interface SpreadsheetRow {
  time: string;
  client_name: string;
  service: string;
  barber: string;
  notes: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface DailySheet {
  id: string;
  date: string;
  created_at: Date;
  rows: SpreadsheetRow[];
}

// In-memory storage (replace with database for production)
const sheets: Map<string, DailySheet> = new Map();

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const spreadsheetService = {
  // Create new sheet for today
  createDailySheet: (): DailySheet => {
    const today = new Date().toISOString().split('T')[0];
    const sheetId = `sheet_${today}`;
    
    if (sheets.has(sheetId)) {
      return sheets.get(sheetId)!;
    }

    const newSheet: DailySheet = {
      id: sheetId,
      date: today,
      created_at: new Date(),
      rows: [],
    };

    sheets.set(sheetId, newSheet);
    return newSheet;
  },

  // Get today's sheet
  getTodaySheet: (): DailySheet => {
    const today = new Date().toISOString().split('T')[0];
    const sheetId = `sheet_${today}`;
    
    if (!sheets.has(sheetId)) {
      return spreadsheetService.createDailySheet();
    }

    return sheets.get(sheetId)!;
  },

  // Add row to today's sheet
  addRow: (row: SpreadsheetRow): SpreadsheetRow => {
    const sheet = spreadsheetService.getTodaySheet();
    sheet.rows.push(row);
    return row;
  },

  // Get all rows for today
  getTodayRows: (): SpreadsheetRow[] => {
    return spreadsheetService.getTodaySheet().rows;
  },

  // Update row status
  updateRowStatus: (index: number, status: string) => {
    const sheet = spreadsheetService.getTodaySheet();
    if (sheet.rows[index]) {
      sheet.rows[index].status = status as any;
    }
  },

  // Send daily reminder email
  sendDailyReminder: async () => {
    const sheet = spreadsheetService.getTodaySheet();
    const recipients = process.env.EMAIL_RECIPIENTS?.split(',') || [];

    const htmlContent = generateEmailHTML(sheet);

    try {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipients.join(','),
        subject: `Ashor's Fade - Daily Schedule ${sheet.date}`,
        html: htmlContent,
      });

      console.log('Daily reminder sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  },
};

// Email template
function generateEmailHTML(sheet: DailySheet): string {
  const rows = sheet.rows
    .map(
      (row) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${row.time}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${row.client_name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${row.service}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${row.barber}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${row.notes || '-'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: ${getStatusColor(row.status)}">${row.status}</td>
    </tr>
  `
    )
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Ashor's Fade - Daily Schedule</h1>
      <p style="text-align: center; color: #666; font-size: 18px;">${sheet.date}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; background: #fff;">
        <thead>
          <tr style="background-color: #2c3e50; color: white;">
            <th style="padding: 15px; text-align: left; font-weight: bold;">Time</th>
            <th style="padding: 15px; text-align: left; font-weight: bold;">Client Name</th>
            <th style="padding: 15px; text-align: left; font-weight: bold;">Service</th>
            <th style="padding: 15px; text-align: left; font-weight: bold;">Barber</th>
            <th style="padding: 15px; text-align: left; font-weight: bold;">Notes</th>
            <th style="padding: 15px; text-align: left; font-weight: bold;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
        This is an automated reminder. Please do not reply to this email.
      </p>
    </div>
  `;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return '#27ae60';
    case 'cancelled':
      return '#e74c3c';
    case 'pending':
      return '#f39c12';
    default:
      return '#3498db';
  }
}

// Schedule daily email at 8 AM
export const scheduleEmailReminder = () => {
  cron.schedule('0 8 * * *', () => {
    spreadsheetService.sendDailyReminder();
  });
};

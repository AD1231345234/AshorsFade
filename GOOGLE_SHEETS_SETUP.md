# Google Sheets Booking Integration Setup

Your Ashor's Fade booking form is ready to automatically send data to Google Sheets! Follow these steps:

## What You'll Get

The Google Sheet will automatically format with:
- ✅ **Bold, professional headers** with dark blue background
- ✅ **White text** on dark headers for contrast
- ✅ **Optimal column widths** for easy reading
- ✅ **Frozen header row** (stays visible when scrolling)
- ✅ **Alternating row colors** (light grey) for better readability
- ✅ **Centered headers** for clean appearance

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet called "Ashor's Fade Bookings"
3. Keep it for now (you'll add the script in the next step)

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Tools → Apps Script**
2. Delete any existing code
3. Paste this code (it auto-formats the sheet professionally):

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Get parameters from the booking form
    const booking = {
      timestamp: new Date(),
      name: e.parameter.name,
      email: e.parameter.email,
      phone: e.parameter.phone,
      service: e.parameter.service,
      barber: e.parameter.barber,
      bookingDate: e.parameter.date,
      bookingTime: e.parameter.time,
      bookedAt: e.parameter.bookedAt
    };
    
    // Create headers if sheet is empty
    const headers = ['Timestamp', 'Name', 'Email', 'Phone', 'Service', 'Barber', 'Booking Date', 'Booking Time', 'Submitted At'];
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      formatSheet(sheet, headers);
    }
    
    // Add the booking data to the sheet
    sheet.appendRow([
      booking.timestamp,
      booking.name,
      booking.email,
      booking.phone,
      booking.service,
      booking.barber,
      booking.bookingDate,
      booking.bookingTime,
      booking.bookedAt
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Format the sheet with professional styling
function formatSheet(sheet, headers) {
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  
  // Bold headers
  headerRange.setFontWeight('bold');
  
  // Header background color (dark blue/black)
  headerRange.setBackground('#2c3e50');
  
  // Header text color (white)
  headerRange.setFontColor('#ffffff');
  
  // Center align headers
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  
  // Set header height
  sheet.setRowHeight(1, 30);
  
  // Set column widths for better readability
  const columnWidths = [150, 120, 180, 120, 180, 100, 120, 100, 150];
  for (let i = 0; i < columnWidths.length; i++) {
    sheet.setColumnWidth(i + 1, columnWidths[i]);
  }
  
  // Alternate row colors for better readability
  const range = sheet.getRange(2, 1, sheet.getMaxRows(), headers.length);
  range.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
  
  // Freeze the header row
  sheet.setFrozenRows(1);
}
```

4. Click the **Save** button (Ctrl+S)
5. Name it: `ashorsFadeBookings`
6. Click **Save**

## Step 3: Deploy the Script

1. Click **Deploy → New deployment**
2. Click the **Select type** dropdown (gear icon) → Choose **Web app**
3. Fill in:
   - **Execute as:** Your Google email address
   - **Who has access:** Anyone
4. Click **Deploy**
5. **Copy the deployment URL** that appears (looks like: `https://script.google.com/macros/s/ABC123.../usep`)

## Step 4: Add URL to Your Environment

1. Open `.env` file in your project root
2. Add this line (paste your URL from Step 3):

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usep
```

**Example:**
```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbw1a2b3c4d5e6f7g8h9i0j/usep
```

## Step 5: Test It!

1. Save and close `.env`
2. Restart your development server: `npm run dev`
3. Go to your site and make a test booking
4. Check your Google Sheet - the booking should appear automatically! ✅

## What Gets Sent to Google Sheets?

When someone books an appointment, these details are automatically sent:
- **Name** - Client's full name
- **Email** - Client's email
- **Phone** - Client's phone number
- **Service** - Selected service (Haircut, Beard, etc.)
- **Barber** - Selected barber (Ashor, Sargon, etc.)
- **Booking Date** - Appointment date
- **Booking Time** - Appointment time
- **Submitted At** - When the booking was made
- **Timestamp** - Server timestamp

## Troubleshooting

### Bookings not appearing in Google Sheet?
1. Check that `VITE_GOOGLE_SCRIPT_URL` is in your `.env` file
2. Make sure the URL is complete (ends with `/usep`)
3. Restart your dev server after adding `.env` changes
4. Open DevTools Console (F12) and check for error messages
5. Make sure the Google Apps Script deployment has "Anyone" access

### "Server Error" when deploying the script?
1. Make sure the Google Sheet is open in another tab
2. Check that you've saved the script (Ctrl+S)
3. Try deploying again

### Need to update the script later?
1. Go back to **Apps Script** in your Google Sheet
2. Click the **Deploy** button → Select the existing deployment
3. Click **Update** to replace it with changes

---

That's it! Your bookings will now automatically sync to Google Sheets whenever someone books on your site. 🎉

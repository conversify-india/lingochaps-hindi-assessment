/**
 * LINGOCHAPS — Hindi Audio Assessment Google Apps Script
 * ─────────────────────────────────────────────────────
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com → New Project
 * 2. Paste this entire file → Save (Ctrl+S)
 * 3. Click "Deploy" → "New Deployment" → Type: Web App
 * 4. Execute as: Me | Who has access: Anyone
 * 5. Copy the Web App URL
 * 6. In index.html, replace YOUR_SCRIPT_ID_HERE with your deployment URL
 * ─────────────────────────────────────────────────────
 */

const SPREADSHEET_ID = ''; // Leave blank → auto-creates a new sheet
                            // OR paste your Google Sheet ID here

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    writeToSheet(data);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('LingoChaps Assessment Logger is running.');
}

function writeToSheet(data) {
  let ss;
  if (SPREADSHEET_ID) {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } else {
    // Try to find existing sheet by name
    const files = DriveApp.getFilesByName('LingoChaps_Hindi_Assessment_Results');
    if (files.hasNext()) {
      ss = SpreadsheetApp.open(files.next());
    } else {
      ss = SpreadsheetApp.create('LingoChaps_Hindi_Assessment_Results');
      Logger.log('Created new sheet: ' + ss.getUrl());
    }
  }

  // ── SUMMARY SHEET ──
  let summary = ss.getSheetByName('Summary');
  if (!summary) {
    summary = ss.insertSheet('Summary');
    summary.appendRow([
      'Name', 'Submitted At', 'Time Taken', 'Total Score', 'Max Score',
      'Percentage', 'Grade', 'Video', 'Language'
    ]);
    summary.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#4a86e8').setFontColor('#ffffff');
  }
  summary.appendRow([
    data.name,
    data.submittedAt,
    data.timeTaken,
    data.totalScore,
    data.maxScore,
    data.percentage + '%',
    data.grade,
    'https://www.youtube.com/watch?v=VQ81mP7p0W4',
    'Hindi'
  ]);

  // ── DETAIL SHEET ──
  let detail = ss.getSheetByName('Row Details');
  if (!detail) {
    detail = ss.insertSheet('Row Details');
    detail.appendRow([
      'Candidate Name', 'Submitted At', 'Timestamp (Segment)',
      'Candidate Comment', 'Score', 'Max Score', 'Percentage'
    ]);
    detail.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#6aa84f').setFontColor('#ffffff');
  }
  if (data.rows && Array.isArray(data.rows)) {
    data.rows.forEach(row => {
      detail.appendRow([
        data.name,
        data.submittedAt,
        row.timestamp,
        row.comment || '(no comment)',
        row.score,
        row.max,
        Math.round((row.score / row.max) * 100) + '%'
      ]);
    });
  }

  Logger.log('Written successfully for: ' + data.name);
}

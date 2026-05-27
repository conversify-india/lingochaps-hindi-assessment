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
      'Candidate WfW', 'Candidate OST', 'Candidate Notes', 'Candidate Comment',
      'OST Image URLs', 'Score', 'Max Score', 'Percentage'
    ]);
    detail.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#6aa84f').setFontColor('#ffffff');
  }

  // Set up Drive Folder for images if any images exist
  let folder = null;
  const hasAnyImages = data.rows && data.rows.some(row => row.ostImages && row.ostImages.length > 0);
  if (hasAnyImages) {
    try {
      const folders = DriveApp.getFoldersByName('LingoChaps_Hindi_Assessment_Images');
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder('LingoChaps_Hindi_Assessment_Images');
      }
    } catch (fErr) {
      Logger.log('Drive folder access failed: ' + fErr.message);
    }
  }

  if (data.rows && Array.isArray(data.rows)) {
    data.rows.forEach((row, rIdx) => {
      // Save images to Google Drive and compile URLs
      let imageUrls = [];
      if (row.ostImages && Array.isArray(row.ostImages) && folder) {
        row.ostImages.forEach((img, iIdx) => {
          try {
            const dataUrl = img.dataUrl;
            if (dataUrl && dataUrl.indexOf(',') !== -1) {
              const contentType = dataUrl.substring(5, dataUrl.indexOf(';'));
              const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
              const decoded = Utilities.base64Decode(base64Data);
              const fileName = `${data.name}_row_${rIdx + 1}_img_${iIdx + 1}_${img.name || 'screenshot.jpg'}`;
              const blob = Utilities.newBlob(decoded, contentType, fileName);
              const file = folder.createFile(blob);
              file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
              imageUrls.push(file.getUrl());
            }
          } catch (imgErr) {
            Logger.log('Error saving image: ' + imgErr.message);
            imageUrls.push(`(Error: ${imgErr.message})`);
          }
        });
      }

      detail.appendRow([
        data.name,
        data.submittedAt,
        row.timestamp,
        row.wfwText || '',
        row.ostText || '',
        row.notesText || '',
        row.comment || '(no comment)',
        imageUrls.join(', '),
        row.score,
        row.max,
        Math.round((row.score / row.max) * 100) + '%'
      ]);
    });
  }

  Logger.log('Written successfully for: ' + data.name);
}

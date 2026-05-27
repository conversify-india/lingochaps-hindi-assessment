# 🎧 Hindi Audio Assessment — LingoChaps

A timed web-based assessment tool for evaluating freshers on Hindi audio transcription quality.

**Video:** [Durga Puja Muslim 2025 — Bright Gyan](https://www.youtube.com/watch?v=VQ81mP7p0W4)  
**Language:** Hindi | **Segment:** 00:00:00 – 00:15:00 | **Duration:** 2 hours 30 minutes

---

## 📋 What the Test Does

1. Candidate enters their **name** before the test starts
2. A **2:30 hour countdown timer** begins immediately
3. The **YouTube video is embedded** inside the test
4. Candidate reviews **15 pre-filled 1-minute segments** (Timestamp, WfW, OST, Notes)
5. They write **comments** in the Comments column if they find errors
6. On submit, **score is auto-calculated** vs. the answer key
7. Results are sent to **Google Sheets** automatically

---

## 🗂️ Files

| File | Purpose |
|------|---------|
| `index.html` | Main assessment tool (single file, no dependencies) |
| `google_apps_script.js` | Paste this into Google Apps Script for Sheets logging |
| `README.md` | This file |

---

## 🚀 Deploy to GitHub Pages

```bash
# 1. Create a new GitHub repo (e.g. lingochaps-hindi-assessment)
git init
git add .
git commit -m "Initial assessment tool"
git remote add origin https://github.com/YOUR_USERNAME/lingochaps-hindi-assessment.git
git push -u origin main

# 2. Go to repo → Settings → Pages → Source: main branch → /root
# 3. Your assessment will be live at:
#    https://YOUR_USERNAME.github.io/lingochaps-hindi-assessment/
```

---

## 📊 Google Sheets Setup

1. Go to [script.google.com](https://script.google.com) → **New Project**
2. Delete any existing code, paste entire content of `google_apps_script.js`
3. Save (`Ctrl+S`)
4. Click **Deploy** → **New Deployment**
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** → Copy the **Web App URL**
6. Open `index.html`, find this line near the bottom:
   ```js
   const SHEET_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';
   ```
   Replace `YOUR_SCRIPT_ID_HERE` with your actual Web App URL

---

## 🎯 Scoring Logic

Each of the 15 rows is worth **6 points** (total = 90 pts):
- **WfW check** → 2 pts (did the trainee flag WfW errors correctly?)
- **OST check** → 2 pts (did they identify missing on-screen text?)
- **Notes check** → 2 pts (did they flag missing notes/references?)

| Grade | Score |
|-------|-------|
| A+ | ≥ 90% |
| A  | ≥ 80% |
| B  | ≥ 70% |
| C  | ≥ 60% |
| D  | ≥ 50% |
| F  | < 50% |

---

## 🔗 Share With Freshers

Once GitHub Pages is enabled, share the URL:
```
https://YOUR_USERNAME.github.io/lingochaps-hindi-assessment/
```

Each candidate:
1. Opens the link
2. Enters their name
3. Takes the test
4. Results auto-submit to your Google Sheet

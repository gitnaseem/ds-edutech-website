# ⚡ Firebase Setup - Quick Reference

## 3-Minute Setup Summary

### 1️⃣ Create Firebase Project
- Go to firebase.google.com
- Create new project named "DS_EDUTECH"
- ⏱️ Wait 1-2 minutes

### 2️⃣ Create Realtime Database
- In Firebase Console → Realtime Database
- Create database in Test Mode
- Copy database URL: `https://your-project-xxxx.firebaseio.com`

### 3️⃣ Get Config
- Settings ⚙️ → Project Settings
- Copy Web app config (7 values: apiKey, authDomain, databaseURL, etc.)

### 4️⃣ Update firebase-config.js
- Open: `js/firebase-config.js`
- Replace the FIREBASE_CONFIG object with your credentials
- Save file

### 5️⃣ Deploy
- Push to GitHub
- Netlify auto-deploys ✅

### 6️⃣ Test
- Admin edits on Device 1
- Check F12 console for "✅ Synced to Firebase"
- Device 2 sees changes instantly ✅

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Firebase SDK not loaded" | Reload page, check internet |
| Changes not syncing | Check console for errors, verify config |
| Cannot create database | Make sure Firebase is enabled for project |
| Slow sync | Check internet, try different Firebase region |

---

## What Gets Synced?
- ✅ Contact Info
- ✅ Testimonials
- ✅ Courses
- ✅ Hero Section
- ✅ Colors & Styles
- ✅ All admin changes

---

## File Changes Made
- ✅ `js/firebase-config.js` (NEW - contains Firebase integration)
- ✅ `admin-dashboard.html` (added Firebase SDKs)
- ✅ `FIREBASE_SETUP_GUIDE.md` (NEW - full setup instructions)

---

**Total Setup Time: 15-20 minutes**
**Result: Global real-time sync! 🎉**

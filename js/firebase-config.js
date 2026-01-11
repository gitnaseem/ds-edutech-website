// ========================================
// FIREBASE CONFIGURATION & SYNC
// ========================================
// Replace these with your Firebase credentials from Firebase Console

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDLYPxwDEuw1Bj7bWPfsmE-rMxyjzmMnF0",
  authDomain: "ds-edutech.firebaseapp.com",
  databaseURL: "https://ds-edutech-default-rtdb.firebaseio.com",
  projectId: "ds-edutech",
  storageBucket: "ds-edutech.firebasestorage.app",
  messagingSenderId: "307546735156",
  appId: "1:307546735156:web:1ab1dce3bb5c15ffc9c061"
};

// Initialize Firebase
let db = null;
let isFirebaseEnabled = false;

function initializeFirebase() {
  // Check if Firebase is available
  if (typeof firebase === 'undefined') {
    console.log('Firebase SDK not loaded - using localStorage fallback');
    return false;
  }

  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.database();
    isFirebaseEnabled = true;
    console.log('✅ Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    isFirebaseEnabled = false;
    return false;
  }
}

// ========================================
// HYBRID STORAGE SYSTEM
// Uses Firebase for cloud sync + localStorage for offline
// ========================================

// Save data to both localStorage and Firebase
async function saveData(key, data) {
  try {
    // Always save to localStorage first (fast)
    localStorage.setItem(key, JSON.stringify(data));

    // Also save to Firebase if available (cloud backup)
    if (isFirebaseEnabled && db) {
      const ref = firebase.database().ref('data/' + key);
      await ref.set({
        value: data,
        timestamp: new Date().toISOString(),
        lastModified: Date.now()
      });
      console.log(`✅ Synced to Firebase: ${key}`);
    }
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
}

// Load data - checks Firebase first, falls back to localStorage
async function loadData(key, defaultValue = null) {
  try {
    // Try Firebase first if available
    if (isFirebaseEnabled && db) {
      const ref = firebase.database().ref('data/' + key);
      const snapshot = await ref.once('value');
      
      if (snapshot.exists()) {
        const firebaseData = snapshot.val();
        // Update localStorage with Firebase data (keep in sync)
        localStorage.setItem(key, JSON.stringify(firebaseData.value));
        console.log(`📥 Loaded from Firebase: ${key}`);
        return firebaseData.value;
      }
    }

    // Fallback to localStorage
    const localData = localStorage.getItem(key);
    if (localData) {
      console.log(`📚 Loaded from localStorage: ${key}`);
      return JSON.parse(localData);
    }

    return defaultValue;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    // Last resort: try localStorage
    const localData = localStorage.getItem(key);
    return localData ? JSON.parse(localData) : defaultValue;
  }
}

// Real-time listener for Firebase changes
function listenForChanges(key, callback) {
  if (!isFirebaseEnabled || !db) {
    console.log('Firebase not available - using polling fallback');
    return;
  }

  try {
    const ref = firebase.database().ref('data/' + key);
    ref.on('value', (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val().value;
        // Update localStorage when Firebase data changes
        localStorage.setItem(key, JSON.stringify(data));
        // Call the callback with new data
        if (callback) callback(data);
        console.log(`🔄 Real-time update received: ${key}`);
      }
    });
  } catch (error) {
    console.error(`Error setting up listener for ${key}:`, error);
  }
}

// Override localStorage methods to use Firebase sync
const originalSetItem = Storage.prototype.setItem;
Storage.prototype.setItem = function(key, value) {
  // Always save to localStorage
  originalSetItem.call(this, key, value);

  // Also sync to Firebase for admin-related keys
  if (key.startsWith('admin') || key.startsWith('site') || key === 'adminCourses' || key === 'adminTestimonials' || key === 'adminContact' || key === 'adminContent' || key === 'adminHero' || key === 'adminStatistics' || key === 'editedWebsiteCourses') {
    if (isFirebaseEnabled && db) {
      try {
        const ref = firebase.database().ref('data/' + key);
        ref.set({
          value: JSON.parse(value),
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Firebase sync error for ${key}:`, error);
      }
    }
  }
};

// Initialize Firebase when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
  initializeFirebase();
}

console.log('Firebase config loaded');

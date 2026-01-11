// ========================================
// FIREBASE CONFIGURATION & SYNC (REST API)
// ========================================
// Using Firebase REST API instead of SDK for better compatibility
// No SDK imports needed - just HTTP requests

const FIREBASE_CONFIG = {
  databaseURL: "https://ds-edutech-default-rtdb.firebaseio.com"
};

let isFirebaseEnabled = true;

function initializeFirebase() {
  // Check if we have internet
  if (navigator.onLine) {
    console.log('✅ Firebase REST API initialized');
    isFirebaseEnabled = true;
    return true;
  } else {
    console.log('📡 Offline mode - using localStorage only');
    isFirebaseEnabled = false;
    return false;
  }
}

// ========================================
// HYBRID STORAGE SYSTEM (REST API)
// Uses Firebase REST API for cloud sync + localStorage for offline
// ========================================

// Save data to both localStorage and Firebase
async function saveData(key, data) {
  try {
    // Always save to localStorage first (fast, offline works)
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`✅ Saved locally: ${key}`, data);

    // Also save to Firebase if online (cloud backup & sync)
    if (isFirebaseEnabled && navigator.onLine) {
      const firebaseUrl = `${FIREBASE_CONFIG.databaseURL}/data/${key}.json`;
      console.log(`📤 Syncing to Firebase: ${firebaseUrl}`);
      
      const response = await fetch(firebaseUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: data,
          timestamp: new Date().toISOString(),
          lastModified: Date.now()
        })
      });

      console.log(`📊 Firebase sync response: ${response.status}`);
      
      if (response.ok) {
        console.log(`✅ Synced to Firebase: ${key}`);
      } else {
        console.log(`⚠️ Firebase sync failed: ${response.status} ${response.statusText}`);
      }
    }
  } catch (error) {
    console.log(`💾 Saved locally (will sync when online): ${key}`, error);
    // Data still saved to localStorage, so no data loss
  }
}

// Load data - checks Firebase first, falls back to localStorage
async function loadData(key, defaultValue = null) {
  try {
    // Try Firebase first if available
    if (isFirebaseEnabled && navigator.onLine) {
      const firebaseUrl = `${FIREBASE_CONFIG.databaseURL}/data/${key}.json`;
      console.log(`🔍 Fetching from Firebase: ${firebaseUrl}`);
      
      const response = await fetch(firebaseUrl);
      console.log(`📊 Firebase response status: ${response.status}`);
      
      if (response.ok) {
        const firebaseData = await response.json();
        console.log(`📥 Firebase data received for ${key}:`, firebaseData);
        
        if (firebaseData && firebaseData.value !== undefined) {
          // Update localStorage with Firebase data (keep in sync)
          localStorage.setItem(key, JSON.stringify(firebaseData.value));
          console.log(`✅ Loaded from Firebase: ${key}`);
          return firebaseData.value;
        }
      } else {
        console.log(`⚠️ Firebase response not ok: ${response.status} ${response.statusText}`);
      }
    }

    // Fallback to localStorage
    const localData = localStorage.getItem(key);
    if (localData) {
      console.log(`📚 Loaded from localStorage: ${key}`);
      return JSON.parse(localData);
    }

    console.log(`⚠️ No data found for key: ${key}`);
    return defaultValue;
  } catch (error) {
    console.log(`❌ Error loading ${key}:`, error);
    // Last resort: try localStorage
    const localData = localStorage.getItem(key);
    return localData ? JSON.parse(localData) : defaultValue;
  }
}

// Check Firebase for updates every 5 seconds (polling)
function listenForChanges(key, callback) {
  let lastValue = null;

  // Initial load
  loadData(key).then(data => {
    lastValue = JSON.stringify(data);
    if (callback) callback(data);
  });

  // Poll for changes every 5 seconds
  setInterval(async () => {
    if (navigator.onLine) {
      try {
        const newData = await loadData(key);
        const newValue = JSON.stringify(newData);
        
        if (newValue !== lastValue) {
          lastValue = newValue;
          if (callback) callback(newData);
          console.log(`🔄 Update detected: ${key}`);
        }
      } catch (error) {
        // Silent fail - continue polling
      }
    }
  }, 5000); // Check every 5 seconds
}

// Override localStorage.setItem to auto-sync to Firebase
const originalSetItem = Storage.prototype.setItem;
Storage.prototype.setItem = function(key, value) {
  // Always save to localStorage
  originalSetItem.call(this, key, value);

  // Auto-sync admin data to Firebase
  if (key.startsWith('admin') || key.startsWith('site') || 
      key === 'editedWebsiteCourses' || 
      key === 'adminContact' || 
      key === 'adminHero' ||
      key === 'adminStatistics' ||
      key === 'adminContent') {
    
    // Don't wait for Firebase - save locally first, sync async
    if (isFirebaseEnabled && navigator.onLine) {
      try {
        const firebaseUrl = `${FIREBASE_CONFIG.databaseURL}/data/${key}.json`;
        fetch(firebaseUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            value: JSON.parse(value),
            timestamp: new Date().toISOString()
          })
        }).catch(error => {
          console.log(`Cloud sync pending: ${key}`);
        });
      } catch (error) {
        // Silent fail - data already in localStorage
      }
    }
  }
};

// Listen for online/offline changes
window.addEventListener('online', () => {
  console.log('🌐 Back online - Firebase syncing enabled');
  isFirebaseEnabled = true;
  // Sync any pending changes
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('admin')) {
      const value = localStorage.getItem(key);
      saveData(key, JSON.parse(value));
    }
  });
});

window.addEventListener('offline', () => {
  console.log('📡 Offline - using localStorage only');
  isFirebaseEnabled = false;
});

// Initialize Firebase when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
  initializeFirebase();
}

console.log('✅ Firebase config loaded (REST API mode)');

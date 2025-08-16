# 🔥 Firebase Setup Guide for PolyDoc AI

## Prerequisites
- Google Account
- Firebase Project

## Step 1: Create Firebase Project

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Click "Create a project"**
3. **Enter project name**: `polydoc-ai` (or any name you prefer)
4. **Enable Google Analytics** (optional but recommended)
5. **Click "Create project"**

## Step 2: Enable Authentication

1. **In Firebase Console, go to "Authentication"**
2. **Click "Get started"**
3. **Go to "Sign-in method" tab**
4. **Enable "Google" provider**:
   - Toggle "Google" to enabled
   - Add your support email
   - Click "Save"

## Step 3: Setup Firestore Database

1. **In Firebase Console, go to "Firestore Database"**
2. **Click "Create database"**
3. **Choose "Start in test mode"** (for development)
4. **Select location** (choose closest to your region)
5. **Click "Done"**

## Step 4: Add Web App

1. **In Firebase Console, go to "Project Overview"**
2. **Click the web icon (`</>`) to add a web app**
3. **App nickname**: `polydoc-web`
4. **Check "Also set up Firebase Hosting"** (optional)
5. **Click "Register app"**

## Step 5: Get Configuration

After registering, you'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

## Step 6: Update Local Configuration

**Copy the configuration values and replace in:** `src/config/firebase.js`

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID", 
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 7: Setup Firestore Security Rules (Optional)

In Firestore, go to "Rules" tab and use these rules for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own documents
    match /documents/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 8: Test Authentication

After updating the config:
1. **Run**: `run-fullstack.bat`
2. **Visit**: `http://localhost:3003`
3. **Click "Sign In"** - should show real Google OAuth popup
4. **Sign in with your Google account**

## Database Structure

The app will create these Firestore collections:

### `/users/{userId}`
```json
{
  "uid": "user_firebase_uid",
  "email": "user@example.com", 
  "displayName": "User Name",
  "photoURL": "https://...",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### `/documents/{userId}/files/{docId}`
```json
{
  "id": "document_id",
  "name": "document.pdf",
  "size": 1024000,
  "type": "application/pdf",
  "uploadedAt": "2024-01-01T00:00:00Z",
  "processed": false,
  "content": "extracted_text_content",
  "metadata": {
    "pages": 10,
    "language": "en"
  }
}
```

### `/chats/{userId}/conversations/{chatId}`
```json
{
  "id": "chat_id",
  "documentId": "document_id",
  "messages": [
    {
      "role": "user",
      "content": "What is this document about?",
      "timestamp": "2024-01-01T00:00:00Z"
    },
    {
      "role": "assistant", 
      "content": "This document is about...",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Environment Variables (Alternative)

Instead of hardcoding in `firebase.js`, you can use environment variables:

Create `.env` file in project root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com  
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Then update `firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check your API key is correct
   - Make sure there are no extra spaces

2. **"Firebase: Error (auth/project-not-found)"**
   - Verify project ID is correct
   - Check if project exists in Firebase Console

3. **"Firebase: Error (auth/operation-not-allowed)"**
   - Enable Google sign-in in Firebase Console
   - Go to Authentication > Sign-in method > Google

4. **Firestore permission errors**
   - Update Firestore security rules
   - Make sure authentication is working first

## Production Deployment

For production:
1. **Update Firestore rules** to be more restrictive
2. **Set up proper domain** in Firebase Auth settings
3. **Use environment variables** for configuration
4. **Enable Firebase hosting** for deployment

---

Once Firebase is properly configured, the authentication will work with real Google OAuth instead of the demo mode!

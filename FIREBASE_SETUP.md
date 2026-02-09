
# How to Enable Firebase Authentication

The app comes with built-in support for Firebase Authentication (Email/Password and Google Sign-In). 
By default, the app runs in "Mock/Offline" mode if no configuration is found.

## 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Enable **Authentication** in the Build menu.
4. Enable **Email/Password** provider.
5. Enable **Google** provider.

## 2. Get Configuration
1. Go to Project Settings -> General.
2. Under "Your apps", create a Web App.
3. Copy the configuration JS object shown.

## 3. Create Environment File
You need to create a file named `.env.local` in the project root.

**Easy Method (Converter Tool):**
1. Run the app (`npm run dev`).
2. Navigate to `http://localhost:5173/#/dev?dev=1`.
3. Locate the **Firebase Config Converter** section.
4. Paste the raw JS object from Firebase console (e.g. `apiKey: "...", ...`).
5. Click **Generate .env.local**.
6. Copy the output and save it as `.env.local` in the project root.

**Manual Method:**
Populate `.env.local` with your keys:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 4. Restart Application
Restart the development server:
```bash
npm run dev
```

The "Auth service not configured" message will disappear from the Auth page, and real authentication will work.

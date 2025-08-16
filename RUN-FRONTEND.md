# Running PolyDoc AI Frontend

## Quick Start Options

### 🔥 Option 1: Full Stack (Recommended - Complete Application)
```cmd
double-click: run-fullstack.bat
```
**Runs both Python backend and React frontend with real Firebase authentication**

### ⚡ Option 2: Frontend Only
```cmd
double-click: run-dev.bat
```
**Frontend development server - requires Firebase configuration**

### 🔧 Option 4: Command Prompt
```cmd
cd Z:\polydoc-ai
node_modules\.bin\vite --port 3003
```

### 🛠️ Option 5: PowerShell with Execution Policy Bypass
```powershell
powershell -ExecutionPolicy Bypass -File "Z:\polydoc-ai\run-dev.ps1"
```

## Application Features

### 🌟 Landing Page
- **Beautiful hero section** with animated elements
- **Google Sign-In integration** with professional modal
- **Dark/Light mode toggle** in header
- **Interactive demo section** that encourages sign-in
- **Responsive design** for all screen sizes

### 🔐 Authentication Flow
- **Google OAuth integration** via Firebase
- **Protected dashboard** route
- **Automatic redirects** for authenticated/unauthenticated users
- **User profile dropdown** with sign-out functionality

### 📄 Dashboard Features
- **Document upload** with drag & drop support
- **AI chat interface** for document Q&A
- **File management sidebar** 
- **Real-time chat** with typing indicators
- **Document preview** and management

### 🎨 UI/UX Features  
- **Framer Motion animations** throughout
- **Tailwind CSS** with custom dark mode
- **Responsive mobile-first design**
- **Smooth transitions** and hover effects
- **Professional Google Sign-In flow**

## Access URLs

- **Frontend**: http://localhost:3003
- **Landing Page**: http://localhost:3003/ (public)
- **Dashboard**: http://localhost:3003/dashboard (requires authentication)

## Navigation Flow

1. **Landing Page**: Public access, showcases features
2. **Sign In**: Click any "Sign In" or "Get Started" button
3. **Google OAuth**: Complete sign-in process  
4. **Dashboard**: Automatic redirect after successful authentication
5. **Protected Routes**: All `/dashboard/*` routes require authentication

## Theme Support

- **Light Mode**: Default professional appearance
- **Dark Mode**: Toggle in top-right corner of any page
- **System Preference**: Automatically detects system theme preference
- **Persistent**: Theme choice saved across sessions

## Development Notes

- The application uses **React Router** for navigation
- **Firebase Auth** provides Google Sign-In
- **Context API** manages theme and authentication state
- **Vite** provides fast development server and hot reload
- **Tailwind CSS** with custom dark mode configuration

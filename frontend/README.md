# Frontend - React Vite Application

A modern, production-ready React application built with Vite, featuring role-based access control, Redux state management, and Material-UI for a professional user experience.

## Overview

This is the frontend application for the Info Portal project. It provides a responsive and interactive user interface with secure authentication, protected routes, and comprehensive user/admin dashboards.

## Key Features

- **⚡ Vite-Powered**: Fast development experience with instant HMR (Hot Module Replacement)
- **🔐 Authentication**: JWT-based secure login with token persistence using Redux Persist
- **👥 Role-Based Access Control (RBAC)**: Different views and features for Admin, Analyst, and User roles
- **📦 Redux Toolkit State Management**: Centralized state for auth, user data, loading, and errors
- **🎨 Material-UI Components**: Professional, responsive UI with MUI design system
- **🛡️ Protected Routes**: Route guards based on authentication and user roles
- **⚙️ Axios Interceptors**: Automatic token injection and error handling for API requests
- **💾 Redux Persist**: Maintains auth state across browser sessions

## Tech Stack

| Category | Tools |
| :--- | :--- |
| **Framework** | React 19, Vite 7 |
| **UI Library** | Material-UI (MUI) v7 |
| **State Management** | Redux Toolkit, Redux Persist |
| **Routing** | React Router v7 |
| **HTTP Client** | Axios |
| **Authentication** | JWT (JSON Web Tokens) |
| **Styling** | Emotion (CSS-in-JS) |
## Folder Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images and media files
│   ├── components/           # Reusable UI components
│   │   ├── AuthRedirector.jsx
│   │   ├── NavBar.jsx
│   │   ├── PrimaryButton.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/               # Page components
│   │   ├── Admin/           # Admin-only pages
│   │   ├── Common/          # Public/shared pages
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   └── Login.jsx
│   │   └── User/            # User-specific pages
│   │       └── Dashboard.jsx
│   ├── redux/               # Redux store and slices
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   └── userSlice.js
│   │   └── store.js
│   ├── services/            # API integration
│   │   └── api.js           # Axios instance with interceptors
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   ├── App.css
│   └── index.css
├── .env                      # Environment variables
## Installation & Setup

### Prerequisites
- Node.js 16+ and npm installed
- Backend server running on `http://localhost:4000`

### Steps

**1. Navigate to the Frontend Directory**
```bash
cd frontend
```

**2. Install Dependencies**
```bash
npm install
```

**3. Configure Environment Variables**

Create a `.env` file in the frontend root directory:
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

**4. Start the Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).
## Pages & Routes

| Page | Path | Role | Description |
| :--- | :--- | :--- | :--- |
| **Login** | `/login` | Public | Authentication page. Unauthenticated users are redirected here. |
| **Home** | `/` | Authenticated | Main landing page for logged-in users. |
| **About** | `/about` | Public | Information about the project. |
| **Contact** | `/contact` | Public | Contact form and information. |
| **User Dashboard** | `/dashboard` | User | Personal dashboard for regular users. |
| **Admin Dashboard** | `/admin/dashboard` | Admin | Admin-only dashboard for management tasks. |
| **Analyst Dashboard** | `/analyst/dashboard` | Analyst | Analyst-specific dashboard. |

## Authentication Flow

1. **Login**: User enters credentials on the login page
2. **JWT Token**: Backend returns a JWT token on successful authentication
3. **Token Storage**: Token is saved in Redux store and persisted to localStorage via Redux Persist
4. **Protected Routes**: Routes are protected by the `ProtectedRoute` component based on user role
5. **API Requests**: Axios interceptors automatically attach the token to all API requests
6. **Token Refresh**: On session restoration, the app verifies the stored token

## Redux State Structure

### authSlice
```javascript
{
  isAuthenticated: boolean,
  user: {
    email: string,
    role: 'user' | 'admin' | 'analyst'
  },
  token: string,
  loading: boolean,
  error: string | null
}
```

### userSlice
```javascript
{
  users: [],
  loading: boolean,
  error: string | null
}
```

## API Integration

The `services/api.js` file contains:
- **Axios Instance**: Configured with base URL from environment variables
- **Request Interceptor**: Automatically adds JWT token to headers
- **Response Interceptor**: Handles errors and token expiration
- **API Methods**: Pre-configured endpoints for authentication and user operations

## Component Overview

- **ProtectedRoute.jsx**: Guards routes based on authentication and role
- **NavBar.jsx**: Navigation component with role-based menu items
- **PrimaryButton.jsx**: Reusable button component
- **AuthRedirector.jsx**: Redirects authenticated users away from login page

## Development Tips

- Use React Router's `useNavigate` hook for programmatic navigation
- Access Redux state with `useSelector` hook
- Dispatch actions with `useDispatch` hook
- Use `createAsyncThunk` in Redux for async API calls
- Leverage Material-UI's `sx` prop for styled components
- Check browser DevTools Redux extension for state debugging

## Troubleshooting

**Problem**: Port 5173 already in use
**Solution**: Vite will automatically use the next available port. Check terminal output for the actual port.

**Problem**: CORS errors when calling backend
**Solution**: Ensure backend has CORS enabled and `VITE_API_BASE_URL` is correctly set in `.env`

**Problem**: Token not persisting after refresh
**Solution**: Verify Redux Persist is configured in `redux/store.js` and Redux DevTools shows persisted state

## Build & Deployment

To create a production build:
```bash
npm run build
```

The optimized build will be generated in the `dist/` directory. Deploy this folder to your hosting provider.

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Navigation and Pages

| Page | Path | Role | Description |
| :--- | :--- | :--- | :--- |
| **Login** | `/login` | Public | Secure login page. Unauthenticated users are redirected here. |
| **Home** | `/` | Authenticated | Main landing page for logged-in users. Redirects to the dashboard. |
| **About** | `/about` | Public | A public page with information about the project. |
| **User Dashboard** | `/dashboard` | User | A personal dashboard for users after they log in. |
| **Admin Dashboard** | `/admin/dashboard` | Admin | A protected dashboard for administrators. |
| **Analyst Dashboard**| `/analyst/dashboard`| Analyst | A protected dashboard for analysts. |


# Assignment 10 - Advanced React Job Portal with Redux & Admin Features
This project extends the Job Portal from Assignment 9 by adding complete Role-Based Access Control, Redux Toolkit, Admin CRUD features, and secure API integrations with the backend from Assignment 8.

The result is a production-style Admin & Employee Portal with user management, job management, authentication, protected routes, and modern UI design using Material UI.

# Key Enhancements in Assignment 10
-- Redux Toolkit Integration
Replaces React Context from Assignment 9.
Redux now manages:
- Authentication (token + email + type)
- Jobs list (fetch & create)
- Users list (admin only)
- Loading & error states
- Global API handling with Axios interceptors

# Role-Based Access (Admin vs Employee)
Backend now enforces role via type field in /user/create API.

Frontend enforces role-based routing:
| Role                | Allowed Pages                                            |
| ------------------- | -------------------------------------------------------- |
| **Admin**           | Employees, Add Job, Add Company, Edit Company, Companies |
| **Employee**        | Jobs, Companies                                          |
| **Unauthenticated** | Login                                                    |

# Admin Portal Features
- Employees Page
- Fetches /users
- Displays all users
- Password field removed (handled in backend)
- Add Job Page
- Validation for all fields
- Salary input fully restricted
- Uses createAsyncThunk for API calls
- POSTs to /api/create/job
- Company Management (optional bonus)
- Add, update, delete company
- Upload logo via multipart/form-data
- Image preview + replacement

# Employee Portal Features
- Jobs Page
- Fetches /api/jobs
- Fully redesigned job cards
- Expandable job description
- Pagination at bottom
- Loader shown while fetching jobs


## Key Features
-   **Redux State Management**: Migrated from React Context to Redux Toolkit for a scalable and centralized state management solution for authentication, jobs, and companies.
-   **Role-Based Access Control (RBAC)**:
    -   **Admin Role**: Has exclusive access to create, edit, and view all jobs, companies, and employees. Admins can upload or remove company logos and manage all site content.
    -   **Employee Role**: Can view job listings and company profiles, with a user experience tailored for job seeking.
-   **Full CRUD Functionality**:
    -   **Companies**: Admins can add new companies, edit their details (name, description), and upload or remove logos.
    -   **Jobs**: Admins can create new job postings that are displayed to all users.
-   **Advanced UI/UX**:
    -   **Protected Routes**: Utilizes a `ProtectedRoute` component to restrict access to pages based on user roles (`admin`, `employee`).
    -   **Loading States**: Implements a full-screen `Backdrop` with a `CircularProgress` loader during API calls (e.g., login, form submissions) to provide clear user feedback.
    -   **Success Notifications**: Uses Material-UI `Snackbar` to display success messages after creating or updating content.
    -   **Enhanced Forms**: Includes real-time input validation, such as word count limits for descriptions.

## Tech Stack

| Category           | Tools                                    |
| ------------------ | ---------------------------------------- |
| **Frontend**       | React 18, Redux Toolkit, React Router v6 |
| **UI Library**     | Material UI                              |
| **Backend**        | Node.js + Express + MongoDB              |
| **HTTP Client**    | Axios                                    |
| **State**          | Redux Toolkit (Slices + Thunks)          |
| **Authentication** | JWT Token stored in LocalStorage         |

## Folder Structure
```
frontend/
├── public/
│   └── index.html
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── NavBar/
│   │   ├── PrimaryButton/
│   │   └── ProtectedRoutes/      # Component to protect routes based on role
│   │
│   ├── pages/
│   │   ├── Admin/                # Admin-only pages
│   │   │   ├── AddCompany.jsx
│   │   │   ├── AddJob.jsx
│   │   │   ├── EditCompany.jsx
│   │   │   └── Employees.jsx
│   │   ├── Common/               # Pages accessible to all logged-in users
│   │   │   ├── About.jsx
│   │   │   ├── CompanyShowcase.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   └── Login.jsx
│   │   └── Employees/            # Employee-specific pages
│   │       └── Jobs.jsx
│   │
│   ├── redux/
│   │   ├── slices/               # Redux Toolkit slices
│   │   │   ├── authSlice.js
│   │   │   └── jobSlice.js
│   │   └── store.js              # Redux store configuration
│   │
│   ├── services/
│   │   └── api.js                # Axios instance and interceptors
│   │
│   ├── App.js                    # Main app layout and route definitions
│   ├── index.js
│   └── theme.js                  # MUI theme customization
│
├── .env
├── package.json
└── README.md
```

## Setup & Installation

**1. Clone and Install**
```bash
git clone <repo-url>
cd assignment10/frontend
npm install
```

**2. Set Environment Variable**

Create a `.env` file in the `frontend` project root and add the backend API URL:
```
REACT_APP_API_BASE_URL=http://localhost:4000
```

**3. Run the Application**
```bash
npm start
```
Open http://localhost:3000 in your browser.
Frontend → http://localhost:3000
Backend → http://localhost:4000


## Navigation and Pages
----
| Page                 | Path                     | Role   | Description                                                   |
| :------------------- | :----------------------- | :----- | :------------------------------------------------------------ |
| **Login**            | `/login`                 | Public | Secure login page. Unauthenticated users are redirected here. |
| **Home**             | `/`                      | All    | Hero banner with quick info and navigation.                   |
| **About**            | `/about`                 | All    | Mission statement and company details.                        |
| **Contact**          | `/contact`               | All    | Contact form and information.                                 |
| **Company Showcase** | `/companies`             | All    | Displays all companies with logos fetched from the backend.   |
| **Job Listings**     | `/employee/jobs`         | All    | Displays all available jobs with a fixed pagination footer.   |
| **Employees**        | `/admin/employees`       | Admin  | (Placeholder) Page for viewing employees.                     |
| **Add Job**          | `/admin/add-job`         | Admin  | Form to create a new job posting.                             |
| **Add Company**      | `/admin/add-company`     | Admin  | Form to add a new company profile with a logo.                |
| **Edit Company**     | `/admin/edit-company/:id`| Admin  | Form to update company details and change or remove the logo. |


## Key Functionalities
-   **Authentication Flow**:
    -   If not logged in, all routes redirect to `/login`. The navigation bar is hidden.
    -   On successful login, a JWT is stored in `localStorage` and the user's auth state is managed by Redux.
    -   The JWT is automatically attached to all subsequent API requests via an Axios interceptor.
-   **Redux State**:
    -   `authSlice`: Manages user authentication status, user info (email, role), and the JWT.
    -   `jobSlice`: Handles asynchronous fetching and creation of job data using `createAsyncThunk`.
-   **Dynamic Content Management**:
    -   Admins can dynamically add, update, and manage company and job data, with changes immediately reflected in the UI.
    -   Image uploads are handled using `multipart/form-data` requests.
-   **Responsive & Consistent UI**:
    -   Built with Material-UI components like `Card`, `Fab`, `Backdrop`, and `Pagination`.
    -   Layouts are fully responsive, with fixed footers for pagination and consistent styling across all pages.


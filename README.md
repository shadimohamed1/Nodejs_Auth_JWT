# JWT Cookie Authentication (Node.js + React)

A simple, secure, full-stack authentication system built with **Express.js** and **React (Vite)** demonstrating JSON Web Token (JWT) authentication using **HttpOnly Cookies**.

---

## Features

- **User Registration**: Register users with password hashing via `bcryptjs`.
- **User Authentication**: Secure sign-in verifying hashed passwords.
- **Dual-Token Strategy**: Short-lived `accessToken` (15m) and long-lived `refreshToken` (7d) stored in secure, `httpOnly` cookies.
- **Refresh Token Rotation & Revocation**: Refresh tokens are tracked in `RefreshTokenRepository` and rotated on every refresh, with full revocation on logout.
- **Auto-Refresh Handling**: Middleware detects expired access tokens (`TOKEN_EXPIRED`), prompting automatic token refresh.
- **Protected Routes**: Middleware (`authenticateToken`) verifying incoming JWT cookies.
- **Role-based Authorization**: Example middleware (`requireAdminRole`) for restricted routes.
- **Session Logout**: Clears authentication cookies and invalidates refresh tokens on logout.
- **CORS Configured**: Configured for credentials handling between Vite (`http://localhost:5173`) and Express (`http://localhost:5000`).

---

## Project Structure

```text
Nodejs_Auth_JWT/
│
├── backend/
│   ├── .env.example          # Template for environment variables
│   ├── .gitignore            # Ignores .env and node_modules
│   ├── package.json
│   └── src/
│       ├── config/           # Centralized environment configuration
│       ├── controllers/      # Auth & User controllers with Constructor Injection
│       ├── middleware/       # JWT auth & error handling middlewares
│       ├── repositories/     # UserRepository & RefreshTokenRepository
│       ├── routes/           # Express router factories
│       ├── app.js            # Composition Root configuring Express
│       └── server.js         # HTTP server entrypoint
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx           # React authentication UI
│   │   ├── index.css         # Styling
│   │   └── main.jsx          # React DOM entrypoint
│   ├── .gitignore            # Ignores dist and node_modules
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore                # Root gitignore
└── README.md                 # Project documentation
```

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

---

### 2. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the example template:
   ```bash
   # On Windows (PowerShell)
   Copy-Item .env.example .env

   # On Linux/macOS
   cp .env.example .env
   ```

4. Configure your `.env` file:
   ```env
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

5. Start the backend server:
   ```bash
   npm start
   ```
   The backend server will run on `http://localhost:5000`.

---

### 3. Frontend Setup

1. Open a second terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/signup` | Register a new user | No |
| `POST` | `/api/signin` | Sign in & set `accessToken` and `refreshToken` cookies | No |
| `POST` | `/api/refresh`| Rotate `refreshToken` & issue new `accessToken` cookie | Refresh Cookie |
| `GET` | `/api/profile` | Get current user's profile | Yes (Access Cookie) |
| `POST` | `/api/logout` | Revoke `refreshToken` & clear all auth cookies | No |
| `DELETE` | `/api/delete/:id`| Delete user by ID | Yes (Admin Role) |

---

## License

ISC

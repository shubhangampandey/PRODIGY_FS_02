# EMS Backend

## Setup

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and set your MongoDB URI and JWT secret:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ems
   JWT_SECRET=your_secret_key_here
   ```
4. `npm run dev` (uses nodemon) or `npm start`

## Default Admin
On first login attempt, a default admin is auto-created:
- **Email:** admin@company.com
- **Password:** admin123

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | No | Admin login, returns JWT |
| GET | /api/employees | Yes | List all employees |
| GET | /api/employees/:id | Yes | Get single employee |
| POST | /api/employees | Yes | Create employee |
| PUT | /api/employees/:id | Yes | Update employee |
| DELETE | /api/employees/:id | Yes | Delete employee |

All protected routes require `Authorization: Bearer <token>` header.

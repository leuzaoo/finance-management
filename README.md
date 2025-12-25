# FinSafe - Personal Finance Management Web App

FinSafe is a full-stack web application for tracking personal finances. It lets you manage bank accounts, income and expenses, recurring subscriptions, reminders, and view dashboards with charts and summaries.

## Features

- Authentication with JWT stored in HttpOnly cookies
- Bank accounts (wallets) management
- Income and expense tracking
- Recurring subscriptions
- Reminders and alerts
- Category-based and date-range filtering
- Interactive charts (Recharts)
- Responsive UI

## Architecture

### Frontend

- Next.js (App Router) + React
- State management with Zustand
- UI with Tailwind CSS and MUI
- Data fetching via Axios
- Charts via Recharts

### Backend

- Node.js + Express (TypeScript)
- REST API under `/api/v1`
- JWT-based authentication
- CORS + cookies for session handling

### Database

- MongoDB

## Tech Stack

- **Language:** TypeScript
- **Frontend:** Next.js, React, Zustand, Tailwind CSS, MUI, Recharts
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Tooling:** ESLint, Prettier

## Project Structure (Summary)

```
/backend
  src/
    controllers/
    routes/
    services/
    middlewares/
    models/
    utils/
    app.ts

/frontend
  src/
    app/
    components/
    hooks/
    store/
    utils/
    middleware.ts
```

## Environment Variables

### Backend (`backend/.env`)

```
MONGO_URI=
JWT_SECRET=
PORT=5001
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)

```
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
NODE_ENV=development
```

## Getting Started

### Prerequisites

- Node.js 20+ (or 22+)
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/leuzaoo/finance-management.git
cd finance-management
```

### Run the Backend

```bash
cd backend
cp .env.example .env
# set MONGO_URI and JWT_SECRET
npm install
npm run dev
```

### Run the Frontend

```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5001`

## Scripts

### Backend

- `npm run dev` - start API in watch mode
- `npm run build` - compile TypeScript
- `npm start` - run production build

### Frontend

- `npm run dev` - start Next.js dev server
- `npm run build` - build for production
- `npm run start` - start production server
- `npm run lint` - run linting

## Deployment

- Frontend can be hosted on Vercel
- Backend can be hosted on Render

## Authentication

- JWT stored in HttpOnly cookies
- Protected routes on the backend via middleware
- Client session state managed with Zustand

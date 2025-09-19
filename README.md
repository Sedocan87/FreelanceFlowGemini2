# FreelanceFlow

This project is a full-stack application designed to help freelancers manage their projects, clients, and finances. It features a React frontend and a Node.js (Express) backend.

## Current Status: Production Ready

The application has been set up to be production-ready. The following major features have been implemented:

*   **Firebase Authentication:** User sign-up and login are handled securely through Firebase Authentication (supporting both Google and email/password). The backend verifies users with the Firebase Admin SDK.
*   **Stripe Subscriptions:** The application is ready to handle payments through Stripe. A subscription flow has been implemented where users can upgrade to a "Pro" plan.
*   **PostgreSQL Database:** The backend is configured to use a PostgreSQL database for data storage, with a clear and extensible schema.

## Roadmap to Production

*   **Step 1: Separate the Frontend & Backend** - **Done**
*   **Step 2: Build the Backend API** - **Done**
*   **Step 3: Connect the Frontend to the API** - **In Progress** (The app is connected for auth and payments, but other features may still use mock data).
*   **Step 4: Implement Real Authentication & Security** - **Done (using Firebase)**
*   **Step 5: Integrate Stripe for Subscriptions** - **Done**
*   **Step 6: Deployment** - Ready for deployment.

---

## Getting Started

To run this project locally, you will need to set up both the frontend and backend services.

### Backend Setup

1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file by copying the example: `cp .env.example .env`
4.  Fill in the required environment variables in the `.env` file.
5.  Start the server: `npm start`

### Frontend Setup

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file by copying the example: `cp .env.example .env`
4.  Fill in the required environment variables in the `.env` file.
5.  Start the development server: `npm run dev`

---

## Environment Variables

You need to create a `.env` file in both the `frontend` and `backend` directories.

### Backend (`/backend/.env`)

*   `DATABASE_URL`: The connection string for your PostgreSQL database.
*   `FIREBASE_ADMIN_SDK_JSON`: The JSON credentials for your Firebase service account.
*   `STRIPE_SECRET_KEY`: Your Stripe secret API key.
*   `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret.

### Frontend (`/frontend/.env`)

*   `VITE_FIREBASE_API_KEY`: Your Firebase project's API key.
*   `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase project's auth domain.
*   `VITE_FIREBASE_PROJECT_ID`: Your Firebase project's ID.
*   `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase project's storage bucket.
*   `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase project's messaging sender ID.
*   `VITE_FIREBASE_APP_ID`: Your Firebase project's app ID.
*   `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable API key.

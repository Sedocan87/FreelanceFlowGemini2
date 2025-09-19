# FreelanceFlow

This project is a full-stack application designed to help freelancers manage their projects, clients, and finances. It features a React frontend and a Node.js (Express) backend.

## Current Status: Production Ready

The application has been reviewed and updated to be production-ready. The following improvements have been made:

*   **Enhanced Security:** The backend now includes `helmet` for security headers, `express-rate-limit` for rate limiting, and `cors` for handling cross-origin requests.
*   **Improved Configuration:** The application now uses `.env.example` files for both the frontend and backend, making it easier to configure for different environments.
*   **Production-Ready Code:** The frontend has been refactored to remove mock data and hardcoded tokens.
*   **Clearer Deployment Process:** The deployment process has been clarified, with database migrations separated from the server startup.

---

## Getting Started

To run this project locally, you will need to set up both the frontend and backend services.

### Backend Setup

1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file by copying the example: `cp .env.example .env`
4.  Fill in the required environment variables in the `.env` file.
5.  Run database migrations: `npm run db:migrate up`
6.  Start the server: `npm start`

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

*   `PORT`: The port the backend server will run on.
*   `FRONTEND_URL`: The URL of the frontend application for CORS.
*   `DATABASE_URL`: The connection string for your PostgreSQL database.
*   `FIREBASE_ADMIN_SDK_JSON`: The JSON credentials for your Firebase service account.
*   `STRIPE_SECRET_KEY`: Your Stripe secret API key.
*   `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret.

### Frontend (`/frontend/.env`)

*   `VITE_API_BASE_URL`: The base URL of the backend API.
*   `VITE_FIREBASE_API_KEY`: Your Firebase project's API key.
*   `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase project's auth domain.
*   `VITE_FIREBASE_PROJECT_ID`: Your Firebase project's ID.
*   `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase project's storage bucket.
*   `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase project's messaging sender ID.
*   `VITE_FIREBASE_APP_ID`: Your Firebase project's app ID.
*   `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable API key.

---

## Production Deployment

For a production deployment, you will need to:

1.  **Build the Frontend:**
    *   Navigate to the `frontend` directory.
    *   Run `npm install` to install dependencies.
    *   Run `npm run build` to create a production build of the frontend in the `dist` directory.
    *   You can then serve the contents of the `dist` directory with a static file server like Nginx or Vercel.

2.  **Deploy the Backend:**
    *   Navigate to the `backend` directory.
    *   Run `npm install --production` to install only the production dependencies.
    *   Set up your production environment variables using your hosting provider's secret management tools (e.g., Vercel Environment Variables, AWS Secrets Manager).
    *   Run database migrations: `npm run db:migrate up`. This should be done as part of your deployment process, before starting the new version of the application.
    *   Start the server: `npm start`.

**Important:** The `.env` files are intended for local development only and are included in `.gitignore` to prevent them from being committed to version control. **Do not use `.env` files in your production environment.**

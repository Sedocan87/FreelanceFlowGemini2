# Deployment Instructions for Your Firebase Application

Ahoy, Captain! Your ship is now rigged for Firebase. Follow these instructions to launch it into the cloud.

## 1. Prerequisites

You'll need the Firebase Command Line Interface (CLI) to deploy your application. If you don't have it, install it globally with this command:

```bash
npm install -g firebase-tools
```

After installing, log in to your Google account:

```bash
firebase login
```

## 2. Configuration

There are a few secrets you need to configure before you can set sail.

### A. Set Your Firebase Project ID

Open the `.firebaserc` file in the root of your project. You'll see this:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

Replace `"your-firebase-project-id"` with your actual Firebase project ID.

### B. Configure Backend Environment Variables

Your backend (now in the `functions` directory) needs a few environment variables to run correctly. You can set these directly in the Firebase console, or by using the Firebase CLI. Using the CLI is recommended.

Run these commands from the root of your project:

```bash
# For your database connection
firebase functions:config:set database.url="your_postgresql_connection_string"

# For your frontend URL (for CORS)
firebase functions:config:set app.frontend_url="your_firebase_hosting_url"

# For Stripe
firebase functions:config:set stripe.secret_key="your_stripe_secret_key"
firebase functions:config:set stripe.webhook_secret="your_stripe_webhook_secret"

# For the Firebase Admin SDK
# IMPORTANT: The value for this should be the full JSON content of your service account key file.
# It's a large single-line string. Be careful with quotes.
firebase functions:config:set firebase.admin_sdk_json='{"type": "service_account", ...}'
```

You can find your Firebase Hosting URL in the Firebase console after the first deployment. For the first time, you might need to deploy, then set the `app.frontend_url`, and then deploy again.

## 3. Deployment

Once everything is configured, you're ready to deploy.

### A. Install Backend Dependencies

Navigate to your `functions` directory and install the dependencies:

```bash
cd functions
npm install
cd ..
```

### B. Build the Frontend

Navigate to your `frontend` directory, install dependencies, and build the application:

```bash
cd frontend
npm install
npm run build
cd ..
```

### C. Deploy to Firebase!

From the root of your project, run the magic command:

```bash
firebase deploy
```

This command will deploy both your frontend to Firebase Hosting and your backend to Firebase Functions.

---

Once the deployment is complete, your application will be live on your Firebase Hosting URL. Well done, Captain! 🚀

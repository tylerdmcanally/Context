# Firebase Setup Guide for Context App

## Project ID: `context-5ed1f`

### Step 1: Enable Firebase Services

#### 1.1 Enable Firestore Database
1. Go to: https://console.firebase.google.com/project/context-5ed1f/firestore
2. Click "Create database"
3. Choose "Start in test mode" (we'll deploy security rules later)
4. Select location: `us-central1` (recommended)
5. Click "Enable"

#### 1.2 Enable Firebase Storage
1. Go to: https://console.firebase.google.com/project/context-5ed1f/storage
2. Click "Get started"
3. Start in test mode
4. Use the same location as Firestore (`us-central1`)
5. Click "Done"

#### 1.3 Enable Firebase Authentication
1. Go to: https://console.firebase.google.com/project/context-5ed1f/authentication
2. Click "Get started"
3. Enable "Email/Password" provider
4. Click "Save"

### Step 2: Get Firebase Web App Configuration

1. Go to: https://console.firebase.google.com/project/context-5ed1f/settings/general
2. Scroll down to "Your apps" section
3. If no web app exists, click the `</>` (Web) icon to add one
4. Register app name: "Context Web App"
5. Copy the Firebase configuration object - you'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "context-5ed1f.firebaseapp.com",
  projectId: "context-5ed1f",
  storageBucket: "context-5ed1f.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 3: Get Firebase Admin SDK Service Account

1. Go to: https://console.firebase.google.com/project/context-5ed1f/settings/serviceaccounts/adminsdk
2. Click "Generate new private key"
3. Click "Generate key" (this downloads a JSON file)
4. **IMPORTANT**: Save this file securely - you'll need:
   - `project_id`
   - `client_email`
   - `private_key`

### Step 4: Create .env.local File

Create a file named `.env.local` in the root directory with these values:

```bash
# Firebase Client (Public) - From Step 2
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=context-5ed1f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=context-5ed1f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=context-5ed1f.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side) - From Step 3
FIREBASE_PROJECT_ID=context-5ed1f
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@context-5ed1f.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# External APIs (Add these when you have them)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PREMIUM_PRICE_ID=
RESEND_API_KEY=

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
EDITOR_EMAIL=your-email@example.com
```

### Step 5: Deploy Firestore Security Rules

Once you've enabled Firestore, deploy the security rules:

```bash
firebase deploy --only firestore:rules
```

### Step 6: Deploy Storage Rules

Once you've enabled Storage, deploy the storage rules:

```bash
firebase deploy --only storage:rules
```

### Step 7: Set Up Cloud Functions Environment

Create `functions/.env` file:

```bash
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
EDITOR_EMAIL=your-email@example.com
```

**Note**: Cloud Functions environment variables are set differently - we'll configure them when deploying functions.

---

## Quick Checklist

- [ ] Firestore Database enabled
- [ ] Firebase Storage enabled  
- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Web app registered and config copied
- [ ] Service account key downloaded
- [ ] `.env.local` file created with all values
- [ ] Firestore rules deployed
- [ ] Storage rules deployed

---

## Next Steps After Firebase Setup

1. Add your API keys (Anthropic, OpenAI, Stripe)
2. Test the connection: `npm run dev`
3. Deploy Cloud Functions: `cd functions && npm run build && cd .. && firebase deploy --only functions`


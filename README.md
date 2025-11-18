# Context - Daily News Digest

A daily news digest web application that delivers one deeply researched, professor-style news story per day at 9am EST.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Storage, Authentication, Cloud Functions)
- **AI**: Anthropic Claude API (content generation), OpenAI API (text-to-speech)
- **Payments**: Stripe
- **Email**: Resend
- **Hosting**: Vercel (frontend), Firebase (backend)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

Required environment variables:
- Firebase configuration (from Firebase Console)
- Anthropic API key
- OpenAI API key
- Stripe keys (for Phase 7)
- Resend API key (optional initially)

### 3. Initialize Firebase

```bash
npm install -g firebase-tools
firebase login
firebase init
```

Select:
- Firestore
- Functions (TypeScript)
- Storage
- Do NOT select Hosting (using Vercel)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
context-app/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and helpers
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── config/           # Configuration files
├── functions/            # Firebase Cloud Functions
└── public/               # Static assets
```

## Development Phases

1. ✅ Project Setup & Configuration
2. ✅ Core Infrastructure
3. ✅ RSS News Aggregation
4. ✅ Story Selection Algorithm
5. ✅ AI Content Generation
6. ✅ Firebase Cloud Functions
7. ✅ API Routes
8. ✅ Frontend Components & Pages
9. ✅ Deployment & Testing

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Fill in all required API keys
   ```

3. **Initialize Firebase:**
   ```bash
   firebase login
   firebase init
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Test RSS aggregation:**
   Visit `http://localhost:3000/api/test-rss`

## Next Steps

- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
- Configure Stripe products and webhooks
- Set up Resend for email notifications
- Deploy to Firebase and Vercel

## Monthly Cost Target

- Target: $24/month (ultra-lean bootstrap)
- Break-even: 5 paying subscribers at $4.99/month

## License

Private project


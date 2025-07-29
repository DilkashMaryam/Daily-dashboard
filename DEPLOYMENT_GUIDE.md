# Deploying to Vercel

This guide will help you deploy your Daily Routine Dashboard to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. Your code in a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Push Your Code to Git

Make sure all your code is committed and pushed to your Git repository.

### 2. Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect it as a Node.js project

### 3. Configure Build Settings

Vercel should automatically use the configuration from `vercel.json`, but verify these settings:

- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### 4. Environment Variables (Optional)

If you want to use a real database instead of in-memory storage:

1. In your Vercel project dashboard, go to "Settings" → "Environment Variables"
2. Add `DATABASE_URL` with your PostgreSQL connection string
3. The app will automatically use this for persistent storage

### 5. Deploy

Click "Deploy" and Vercel will:
- Install dependencies
- Build your React frontend
- Set up serverless functions for your API
- Deploy everything to a global CDN

## What Happens During Deployment

- **Frontend**: Built with Vite and served as static files
- **Backend**: API routes become Vercel serverless functions
- **Storage**: Uses in-memory storage by default (resets on each function call)
- **Domain**: You get a free `.vercel.app` domain

## Post-Deployment

1. Your app will be available at `https://your-project-name.vercel.app`
2. Test all functionality (add, edit, delete items)
3. Note: With in-memory storage, data resets when functions go idle

## Upgrading to Persistent Storage

To keep your data between sessions:

1. Set up a PostgreSQL database (Neon, Supabase, or PlanetScale work well)
2. Add the `DATABASE_URL` environment variable in Vercel
3. The app will automatically switch to using the database

## Custom Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

- **Build fails**: Check the build logs in Vercel dashboard
- **API not working**: Verify the `/api` routes are accessible
- **CORS issues**: The app includes CORS headers for cross-origin requests

Your Daily Routine Dashboard is now live and accessible worldwide!
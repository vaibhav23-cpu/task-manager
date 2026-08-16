# Railway Deployment Guide

## Prerequisites
- GitHub account (push your code there)
- Railway account (sign up at railway.app - free tier is good for testing)

## Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/task-manager.git
git push -u origin main
```

## Step 2: Deploy Backend on Railway

1. Go to [railway.app](https://railway.app) and log in
2. Click "Create New Project" → "Deploy from GitHub repo"
3. Search for and select your repository
4. Railway will auto-detect it's a Flask app
5. Wait for the build to complete
6. Click on your service and go to "Settings"
7. Set these environment variables:
   ```
   JWT_SECRET_KEY=generate-a-random-secret-key-here
   FLASK_ENV=production
   ```
8. Railway will auto-provision PostgreSQL and set DATABASE_URL
9. Your backend URL will be something like `https://task-manager-production.railway.app`

## Step 3: Deploy Frontend on Railway

### Option A: Deploy on Railway (same project)
1. In Railway, click "New" → "Empty Service"
2. Use the Dockerfile in the frontend folder
3. Set environment variable:
   ```
   VITE_API_URL=https://task-manager-production.railway.app
   ```
4. Deploy!

### Option B: Deploy on Vercel (easier)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New..." → "Project"
3. Import your repository
4. Set these in project settings:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://task-manager-production.railway.app
   ```
6. Deploy!

## Step 4: Test Everything

1. Visit your frontend URL
2. Register a new user
3. Login
4. Go to Tasks → Add Task
5. Create a project via API:
   ```bash
   curl -X POST https://your-backend-url/projects \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"name": "My Project", "description": "Test"}'
   ```
6. Then create tasks

## Common Issues

**Database connection error**
- Railway PostgreSQL takes a minute to provision
- Check that DATABASE_URL is in environment variables
- Restart the service

**Frontend can't reach backend**
- Make sure VITE_API_URL points to your Railway backend URL
- The URL should NOT have a trailing slash
- Redeploy frontend after changing env vars

**502 Bad Gateway**
- Backend might be restarting. Wait a minute and refresh.
- Check Railway logs for errors

## Production Tips
- Change JWT_SECRET_KEY to a long random string
- Enable auto-redeploy in Railway (Settings → Deploy)
- Monitor logs regularly
- Consider adding email notifications for errors

## Cost
- Railway free tier: $5/month credits
- This project easily fits in free tier during development
- Once you go live, you'll pay for actual usage (usually $1-10/month)
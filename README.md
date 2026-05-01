# Team Task Manager

A simple team task management app built with React frontend and Flask backend.

## Features
- User authentication with JWT
- Role-based access (Admin/Member)
- Projects and tasks management
- Basic dashboard with stats

## Local Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Update .env with your values
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be at `http://localhost:5173`

## Railway Deployment

### Backend Deployment
1. Push code to GitHub
2. Go to [railway.app](https://railway.app) and create a new project
3. Connect your GitHub repo
4. Click "Add Service" → "Add from GitHub repo"
5. Select the repository
6. In "Settings" tab, set the build command: `pip install -r backend/requirements.txt`
7. Set the start command: `cd backend && gunicorn app:app`
8. Add a PostgreSQL plugin (Railway will auto-provision it)
9. The DATABASE_URL will be auto-set. Add these env variables:
   - `JWT_SECRET_KEY`: Generate a random secret key
   - `FLASK_ENV`: production
10. Deploy!

### Frontend Deployment
Option A: Deploy on Railway
1. Add another service to the same Railway project
2. Create a `Dockerfile` in the frontend folder:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```
3. Railway will build and deploy automatically

Option B: Deploy on Vercel (easier for static sites)
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import the repo
4. Set the root directory to `frontend`
5. Build command: `npm run build`
6. Output directory: `dist`
7. Update the API URL in the frontend code to point to Railway backend

### Environment Variables Needed
**Backend (.env or Railway dashboard):**
- `DATABASE_URL`: PostgreSQL connection string (auto-set by Railway)
- `JWT_SECRET_KEY`: Random secret string
- `FLASK_ENV`: production

**Frontend (if deployed separately):**
- Update API base URL in components to point to Railway backend

## Architecture Notes
- Backend: Flask with SQLAlchemy ORM, JWT auth
- Database: PostgreSQL (local dev can use SQLite)
- Frontend: React with Vite, Axios for API calls
- Auth: JWT tokens stored in localStorage

## Assumptions
- Simple UI, no fancy styling
- Basic error handling
- No email notifications or advanced features
- Projects are created via API (can add UI later)
- Single-tenant (no workspace isolation)
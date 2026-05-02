Team Task Manager (Full-Stack Project)

Hey! This is a full-stack project I built where users can create projects, assign tasks, and keep track of progress. The main idea was to understand how a real application works from frontend to backend, including authentication and database handling.

--------------------------------------

Live Links

Frontend:
https://task-manager-green-eight-78.vercel.app/

Backend:
https://task-manager-production-7d2e.up.railway.app

GitHub:
https://github.com/vaibhav23-cpu/task-manager

--------------------------------------

What the app does

- Users can sign up and log in
- There are two roles: Admin and Member
- Projects can be created and managed
- Tasks can be assigned to users
- Task status can be updated (like pending or completed)
- A simple dashboard shows overall progress and overdue tasks

--------------------------------------

Tech Used

Frontend:
React (with Vite)

Backend:
Flask (Python)
JWT for authentication

Database:
PostgreSQL (hosted on Railway)

Deployment:
Backend → Railway
Frontend → Vercel

--------------------------------------

How to run it locally

Backend:
- Go to the backend folder
- Install dependencies using: pip install -r requirements.txt
- Run: python app.py

Frontend:
- Go to the frontend folder
- Install dependencies: npm install
- Start the app: npm run dev

--------------------------------------

API (basic idea)

- /auth/register → create account
- /auth/login → login user
- /projects → manage projects
- /tasks → manage tasks
- /dashboard → view stats

--------------------------------------

Some notes

- The backend might take a few seconds to respond the first time (Railway free tier)
- This project is more focused on functionality than UI design
I built this project as part of an assignment for Ethara.ai during my placement process.

--------------------------------------


Thanks for checking this out 🙂
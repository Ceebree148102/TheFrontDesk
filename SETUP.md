# Setup Guide

1. Create a MongoDB Atlas cluster and copy connection string.
2. Create a `.env` file in repository root using `.env.example`.
3. Set `MONGO_URI` and `JWT_SECRET`.
4. Install dependencies: `npm install`.
5. Start server: `npm run dev`.
6. Open `http://localhost:5000/chat.html` to test chat.

To deploy, use Railway, Render, or Heroku and set environment variables on the platform.

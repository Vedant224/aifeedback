# AI Feedback Tracker

A web application for collecting, managing, and analyzing feedback with AI-powered insights.

## Features

- User Authentication
- Feedback Management
- AI Analysis
- Interactive AI Assistant
- Responsive Design
- Data Visualization

## Technology Stack

**Frontend:** Next.js 14, Tailwind CSS, NextAuth.js
**Backend:** Node.js, Express.js, TypeScript, MongoDB
**AI:** Google Generative AI (Gemini)
# Installation and Setup Guide for AI Feedback Tracker

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18.0.0 or later)
- **npm** (v8.0.0 or later)
- **Git** for version control
- **MongoDB Atlas account** for database hosting
- **Google AI API key** (for Gemini AI integration)

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/youruVedant224/aifeedback.git

# Navigate to project directory
cd aifeedback
```
## Step 2: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Install TypeScript type definitions
npm install --save-dev @types/node @types/express @types/cors @types/morgan @types/compression @types/jsonwebtoken @types/bcrypt

# Create environment file
touch .env
```
Configure Backend Environment Variables
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```
Setup MongoDB Database
Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
Create a new cluster (free tier is sufficient)
Set up database access with username and password
Configure network access to allow connections from your IP
Get your connection string and add it to the .env file

## Step 3: Frontend Setup
```bash
# Navigate to frontend directory from project root
cd ../frontend

# Install dependencies
npm install

# Create environment file
touch .env.local
```
Create a .env.local file in the frontend directory with:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key
```
## Step 4: Run the Application in Development Mode

```bash
# In the backend directory
npm run dev

# In the frontend directory
npm run dev
```

## API Endpoints

- Authentication: `/api/users/register`, `/api/users/login`
- Feedback: `/api/feedback`, `/api/feedback/:id`
- AI: `/api/ai/query`, `/api/ai/analyze`




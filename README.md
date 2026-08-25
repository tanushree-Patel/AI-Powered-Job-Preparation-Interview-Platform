# AI-Powered Job Preparation & Interview Platform

An intelligent, full-stack web application designed to help job seekers practice, prepare, and land their dream jobs. By analyzing a target job description alongside the candidate's resume (or self-description), the platform generates custom mock interview questions, identifies skill gaps, creates a personalized study roadmap, and compiles tailored resumes.

---

## ✨ Key Features

- **🔐 Easy Authentication**: Secure sign-up, email OTP verification, Google OAuth, and secure session management.
- **🧠 Custom Mock Interviews**: Automatically generates relevant **Technical** and **Behavioral** questions, including the interviewer's intention and model answers using Google's Gemini AI.
- **📈 Skill Gap Assessment**: Highlights missing requirements and rates their severity (`low`, `medium`, `high`) to help focus study time.
- **📅 Day-Wise Prep Roadmap**: Provides a customized, structured study plan to bridge gaps.
- **📄 One-Page Resume PDF**: Instantly creates and downloads an ATS-friendly, single-page resume custom-tailored to the target job requirements.

---

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Sass, Vite (Fast & responsive user interface)
- **Backend**: Node.js, Express (Robust and secure REST API)
- **Database**: MongoDB & Mongoose (Flexible storage for profiles and report histories)
- **AI & Automation**: Google Gemini AI (`gemini-2.5-flash`) & Puppeteer (For high-fidelity PDF compilation)

---

## 📁 Simple Folder Guide

- `backend/` - Node.js Express API code (routes, database configuration, mailer, and AI integration services).
- `frontend/` - React application (pages for login/register, dashboard, interactive interview preparation, and styles).

---

## ⚙️ How to Setup & Run

### 1. Setup the Backend
1. Go to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the packages:
   ```bash
   npm install
   ```
3. Create a file named `.env` and fill in the required keys:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret

   # AI Integration
   GOOGLE_GENAI_API_KEY=your_gemini_api_key

   # Email OTP Setup
   GOOGLE_USER=your_email@gmail.com
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REFRESH_TOKEN=your_oauth_refresh_token

   # Redirect Links
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 2. Setup the Frontend
1. Go to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install the packages:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
4. Open **`http://localhost:5173`** in your browser.

---

## 🔌 API Endpoints Cheat Sheet

### Auth Routes (`/api/auth`)
- `POST /register` — Register a new account
- `POST /login` — Sign in to an existing account
- `POST /verify-email` — Verify email using the OTP code
- `POST /resend-otp` — Request a new OTP code
- `GET /logout` — Clear session cookies
- `GET /google` — Authenticate using Google OAuth

### Interview Routes (`/api/interview`)
- `POST /` — Create a new custom interview report (upload resume & enter job description)
- `GET /` — List past interview reports
- `GET /report/:interviewId` — View a specific generated interview prep plan
- `POST /resume/pdf/:interviewReportId` — Generate and download the customized single-page resume PDF

---

## 💡 A Friendly Note to Job Seekers

> **Believe in yourself!** 🌟  
> Job hunting and preparation can feel overwhelming, but consistency is key. By breaking down target descriptions, practicing mock questions, and staying organized with your day-wise roadmap, you are already steps ahead of the competition. 
> 
> Use this platform as your digital sparring partner. Make mistakes here so you can shine when it counts! 
> 
> *Best of luck on your career journey. You've got this!* 💪🚀

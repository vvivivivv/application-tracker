# 📊 Application Tracker (React + Supabase)
This is a simple full-stack web application built using **ReactJS** and **JavaScript**, allowing users to track, manage, and analyse their job or internship applications.

---

## 🚀 Key Features

- **Secure authentication:** private user accounts via Supabase Auth (email/password)
- **Backend analytics:** statistics (application rates, status counts) calculated via server-side SQL RPC functions
- **Visual data dashboard:** daily activity chart to track application volume over time
- **Smart reminders:** automatically highlights upcoming deadlines and/or follow-ups based on reminder and application closing dates
- **Excel/CSV export:**: utility to export application history

---

## 💻 Tech Stack

- ReactJS (Frontend Framework)
- Tailwind CSS (Styling)
- Supabase (BaaS: Auth and Database)
- PostgreSQL (Relational Database)
- Vite (Development Build Tool)
- Vercel (Deployment)

--- 
## 🔧 Setup Instructions


1. Clone the repo:
   ```bash
   git clone https://github.com/vvivivivv/application-tracker.git
   cd application-tracker

2. Install dependencies:
   ```bash
   cd frontend
   npm install

3. Environment setup:
    Create a `.env` file in the `frontend/` folder
    ```bash
    VITE_SUPABASE_URL = your_supabase_project_url
    VITE_SUPABASE_ANON_KEY = your_supabase_anon_key

4. Database setup:
    Execute the SQL scripts found in the `backend/` folder within your Supabase SQL Editor in the following order:
    - schema.sql (tables) > policies.sql (security) > triggers.sql (automation) > analytics.sql (stats and reminders)

5. Run development server:
   ```bash
   npm run dev

---

## 👩‍💻 Live Demo


---

## 📝 Notes

- Implements Row Level Security such that users can only access their own data
- Logic is separated into custom hooks and modular components
- Offloads data calculations to PostgreSQL engine 
- Automatically tracks `created_at` and `updated_at` timestamps for every application

---

## 🧠 Future Improvements

- Automated application logging directly from LinkedIn or application webpage
- Support for linking specific resume versions to each application tag or type
- Weekly targets and progress visualisation



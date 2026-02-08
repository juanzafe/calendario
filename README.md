🏎️ Driving School App: Management & Analytics for Instructors
This project is a real-world tool designed to simplify the daily routine of driving instructors. It is currently in production and being used to manage lessons, track performance goals, and analyze monthly statistics effortlessly.

🌟 What does the app do?
The idea was born from a real need: to stop using paper or complicated Excel sheets to count daily lessons.

Lesson Management: Log each day's lessons with just a few clicks. The system knows if you've met your goal (e.g., 8 lessons for a half-shift or 13 for a full shift) and marks it visually for you.

Smart Calendar: The calendar comes pre-configured with Spanish public holidays for 2025 and 2026. It also allows you to mark vacation periods so they don't negatively impact your performance statistics.

Analytics Dashboard: Thanks to the integrated charts, instructors can see their total lessons for the month, compare them with previous months, and view their 6-month average to help predict future income.

Fast & Secure Access: Direct login with Google. No need to remember new passwords, and all your data is instantly synced to the cloud.

📈 Real-world Data & UX
This isn't just a coding exercise. I integrated Google Analytics to understand how the app is actually used. Through this, I discovered that 90% of the traffic is mobile, so I optimized the entire interface and the charts to look and work perfectly on smartphones, using touch gestures and adapted menus.

🛠️ What's "under the hood"?
To keep the app fast and reliable, I used:

React + TypeScript: For a solid interface without type errors.

Firebase (Auth & Firestore): Handles security and real-time data storage.

Recharts: To generate the performance and accumulation charts.

Tailwind CSS: For a clean, modern, and—above all—fast mobile-first design.

🚀 Quick Start
Clone the repo.

Install dependencies with npm install.

Configure your .env file with your Firebase keys.

Launch the project with npm run dev.

Developed by Juan Zamudio – Real solutions for everyday problems.
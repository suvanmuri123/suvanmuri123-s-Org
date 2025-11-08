# KaryaSuchi
> Tasks made easy, life made clear.

KaryaSuchi is an intelligent personal productivity application designed to bring clarity and focus to your daily life. It combines a smart to-do list, mood tracking, a focus timer, and productivity analytics into one beautifully designed interface, powered by the Google Gemini API.

## ✨ Features

- **AI-Powered Task Management**: Simply type what you need to do, and KaryaSuchi's AI will parse due dates and organize your tasks automatically. (e.g., "call mom tomorrow at 5pm").
- **Daily Self-Reflection Journal**: A guided journal to reflect on your wins, lessons, and feelings.
- **AI-Powered Summaries**: Get an encouraging summary and an actionable suggestion for your next day based on your reflection notes.
- **Pomodoro Focus Timer**: A built-in timer to help you focus on your tasks and take scheduled breaks, complete with a playful Mochi mascot animation.
- **Productivity Analytics**: Visualize your task completion and mood trends over time with beautiful charts.
- **Mood Tracking**: Log your daily mood and see how it correlates with your productivity.
- **Beautiful & Animated UI**: A calming, sakura-themed interface with smooth animations to create a pleasant user experience.
- **Secure (Local-First)**: All your data is stored securely in your browser's local storage.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS (via CDN)
- **AI**: Google Gemini API (`gemini-2.5-flash`)
- **Animation**: anime.js

## 🚀 Running Locally

This project uses Vite for a fast and modern development experience.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your API Key:**
    Create a file named `.env.local` in the root of the project and add your Google Gemini API key:
    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Then, open your browser to the URL provided (usually `http://localhost:5173`).

## ☁️ Deployment

You can deploy this application for free on modern static hosting platforms like Vercel or Netlify.

### Deploying to Vercel (Recommended)

1.  **Push to GitHub**: Make sure your project is on GitHub.
2.  **Import Project**: Go to your Vercel dashboard and click "Add New... -> Project". Select your Git repository.
3.  **Configure Project**:
    - **Framework Preset**: Vercel should automatically detect **Vite** and configure the build settings correctly.
    - **Build Command**: Should be `npm run build` or `vite build`.
    - **Output Directory**: Should be `dist`.
    - **Environment Variables**: This is the most important step.
        - Click to expand the "Environment Variables" section.
        - Add a new variable with the name `API_KEY`.
        - Paste your Google Gemini API key into the value field.
4.  **Deploy**: Click the "Deploy" button. Vercel will build and deploy your site, giving you a URL.

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
- **Offline Capable**: Thanks to a service worker, the app works even when you're offline.
- **Secure (Local-First)**: All your data is stored securely in your browser's local storage.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS
- **AI**: Google Gemini API (`gemini-2.5-flash`)
- **Animation**: anime.js
- **Build**: No-build setup using ES Modules and import maps.

## 🚀 Running Locally

This project is set up to run without a complex build process.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Set up your API Key:**
    The application requires a Google Gemini API key. You will need to make this available as an environment variable. While you can't use a `.env` file in this build-less setup, development servers often have a way to inject environment variables.

3.  **Serve the files:**
    You can use any simple static file server. If you have Node.js, you can use `serve`:
    ```bash
    # Install serve globally if you don't have it
    npm install -g serve

    # Run the server from the project's root directory
    serve .
    ```
    Then, open your browser to the URL provided (usually `http://localhost:3000`).

## ☁️ Deployment

You can deploy this application for free on modern static hosting platforms like Vercel or Netlify.

### General Instructions

The process involves these general steps:
1. Push your code to a Git provider (GitHub, GitLab, Bitbucket).
2. Connect your Git repository to the hosting service (Vercel, Netlify).
3. Configure the build settings.
4. Add your Gemini API key as an environment variable.

### Deploying to Vercel (Recommended)

1.  **Push to GitHub**: Make sure your project is on GitHub.
2.  **Import Project**: Go to your Vercel dashboard and click "Add New... -> Project". Select your Git repository.
3.  **Configure Project**:
    - **Framework Preset**: Vercel should automatically detect that this is a static site. If not, select `Other`.
    - **Build and Output Settings**: Leave these blank or as their default. No build step is needed.
    - **Environment Variables**: This is the most important step.
        - Click to expand the "Environment Variables" section.
        - Add a new variable with the name `API_KEY`.
        - Paste your Google Gemini API key into the value field.
4.  **Deploy**: Click the "Deploy" button. Vercel will deploy your site and give you a URL.

I have already included a `vercel.json` file in the project, which tells Vercel how to handle routing for this single-page application.

### Deploying to Netlify

1.  **Push to GitHub**: Ensure your project is on a GitHub repository.
2.  **Add New Site**: Go to your Netlify dashboard and click "Add new site -> Import an existing project".
3.  **Connect to Git Provider**: Select GitHub and authorize access. Choose your project's repository.
4.  **Site Settings**:
    - **Branch to deploy**: `main` (or your default branch).
    - **Build command**: Leave this blank.
    - **Publish directory**: Leave this as the default (or set it to the root of your project).
5.  **Environment Variables**:
    - Click "Show advanced" or go to the site's settings after creation.
    - Go to `Site settings > Build & deploy > Environment`.
    - Click "Edit variables" and add a new variable.
    - **Key**: `API_KEY`
    - **Value**: Your Google Gemini API key.
6.  **Deploy Site**: Click "Deploy site". Netlify will build (in this case, do nothing) and deploy your application.

# College Voting Polling System — Setup Instructions

## Prerequisites
- Node.js (v18 or newer) — download from https://nodejs.org
- npm (comes with Node.js)
- Visual Studio Code — download from https://code.visualstudio.com

---

## Option A: Run as a React App (Recommended)

### Step 1 — Create a new Vite + React project

Open VS Code terminal (`Ctrl + `` ` ``) and run:

```bash
npm create vite@latest college-voting-system -- --template react
cd college-voting-system
npm install
npm install react-router-dom
```

### Step 2 — Replace the App component

1. Delete `src/App.jsx` and `src/App.css`
2. Copy `CollegeVotingSystem.jsx` into `src/App.jsx`
3. Open `src/main.jsx` and make sure it reads:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

4. Delete `src/index.css` or clear it (the app injects its own styles)
5. In `index.html`, add Google Fonts to the `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Step 3 — Start the development server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## Option B: Use the Claude.ai Artifact (Instant Preview)

1. Open Claude.ai
2. Upload `CollegeVotingSystem.jsx`
3. Ask Claude: *"Run this as a React artifact"*
4. The app will render inline — no setup needed.

---

## How to Use the Application

### Normal User Flow
1. **Sign Up** — Create an account with your name, email, and password
2. **Register** — Select Student or Staff, fill in your ID, faculty, department, and contact
3. **Instructions** — Read the voting guidelines and check the acknowledgment box
4. **Ballot** — Select your candidate and submit your vote
5. **Success** — View your confirmation and sign out

### Admin Access
- **Email:** `admin@college.edu`
- **Password:** `admin123`
- The admin dashboard shows all registered users, vote counts per candidate with progress bars, and a recent registrations table.

### Test with Multiple Voters
Open the app in different browsers (or use Incognito windows) to simulate multiple voters.

---

## Project Structure

```
college-voting-system/
├── src/
│   ├── App.jsx          ← Main application (all components)
│   └── main.jsx         ← React entry point
├── index.html
├── package.json
└── vite.config.js
```

For a multi-file version matching the assignment folder structure:

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProgressBar.jsx
│   ├── Countdown.jsx
│   ├── ToastContainer.jsx
│   └── Modal.jsx
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Register.jsx
│   ├── Instructions.jsx
│   ├── Ballot.jsx
│   ├── Success.jsx
│   └── Admin.jsx
├── utils/
│   └── storage.js
├── App.jsx
└── main.jsx
```

The single-file version contains all of these — split them out for the multi-file assignment submission.

---

## Features Checklist

| Feature | Status |
|---|---|
| Login page with validation | ✅ |
| Signup page with validation | ✅ |
| Student/Staff registration form | ✅ |
| Registration saved to localStorage | ✅ |
| Voting instructions with checkbox | ✅ |
| Digital ballot paper (3 candidates) | ✅ |
| Vote confirmation popup | ✅ |
| Vote Success page | ✅ |
| Prevent multiple voting | ✅ |
| Already-voted detection | ✅ |
| Admin dashboard (hidden) | ✅ |
| Vote counts with progress bars | ✅ |
| Registrations table | ✅ |
| Dark mode toggle | ✅ |
| Toast notifications | ✅ |
| Election countdown timer | ✅ |
| Progress indicator (5 steps) | ✅ |
| Fully responsive (mobile/tablet/desktop) | ✅ |
| Smooth animations | ✅ |
| Form validation with error messages | ✅ |
| Professional footer | ✅ |

---

## Customisation

### Change election date
In `App.jsx`, find:
```js
const ELECTION_DATE = new Date("2026-12-31T23:59:59");
```
Update to your desired date.

### Add/change candidates
Find the `CANDIDATES` array near the top of the file and modify names, mottos, or manifestos.

### Reset all data (for testing)
Open the browser console (`F12`) and run:
```js
localStorage.clear(); location.reload();
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Blank page | Check the browser console for errors; ensure `main.jsx` imports `App` correctly |
| Styles not loading | The app injects styles dynamically — if they flash, add the CSS to a separate `.css` file |
| Can't log in | Make sure you signed up first; or use admin credentials above |
| Vote not saving | Check that localStorage is enabled in your browser settings |

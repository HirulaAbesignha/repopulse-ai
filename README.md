# RepoPulse AI

![RepoPulse AI Banner](./public/preview.png)

**RepoPulse AI** is a GitHub-integrated developer tool that helps developers analyze, improve, and present their GitHub repositories better.

It connects with GitHub using OAuth, loads the user's repositories, checks repository health, reviews README quality, gives improvement suggestions, and generates a professional `README.md` draft that users can copy or download.

Live App: https://repopulse-ai.vercel.app

---

## Overview

Many students, developers, and open-source contributors build useful projects, but their GitHub repositories often lack proper documentation, project structure, screenshots, setup instructions, and clear presentation.

RepoPulse AI solves this by analyzing a GitHub repository and showing what is missing. It helps users improve their repository quality and quickly generate a better README file.

This project was built as a working GitHub API integration and developer tool.

---

## Key Features

- GitHub OAuth login
- Fetch user's GitHub repositories
- Analyze public and user repositories
- Repository health score
- README quality checking
- GitHub repository metadata analysis
- Smart project summary
- Improvement suggestions
- Professional README generator
- Copy generated README
- Download generated `README.md`
- Support email section for users

---

## GitHub Integration

RepoPulse AI uses GitHub OAuth and the GitHub REST API.

The application allows users to sign in with GitHub and fetch their repositories. It then analyzes repository data such as:

- Repository name
- Description
- Stars
- Forks
- Issues
- Main language
- License
- README content
- Repository activity

The tool uses this data to calculate a repository health score and generate improvement suggestions.

---

## How It Works

```text
User signs in with GitHub
        ↓
RepoPulse fetches user's repositories
        ↓
User selects a repository
        ↓
RepoPulse analyzes GitHub API data
        ↓
Tool checks README quality and repo metadata
        ↓
User receives score, summary, suggestions, and README draft
```

---

## Tech Stack

- **Next.js** — React framework
- **Tailwind CSS** — Styling
- **GitHub OAuth** — User authentication
- **GitHub REST API** — Repository data fetching
- **Vercel** — Deployment
- **JavaScript** — Main programming language

---

## Screenshots

Add screenshots of the live project here.

Example:

```md
![Home Page](./public/home-preview.png)
![Repository Report](./public/report-preview.png)
```

---

## Project Structure

```text
repopulse-ai/
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.js
│   │   ├── auth/
│   │   │   ├── github/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.js
│   │   │   │   └── callback/
│   │   │   │       └── route.js
│   │   │   └── logout/
│   │   │       └── route.js
│   │   └── user/
│   │       ├── profile/
│   │       │   └── route.js
│   │       └── repos/
│   │           └── route.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── lib/
│   ├── github.js
│   ├── readmeGenerator.js
│   └── scoreRepo.js
├── public/
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

Follow these steps to run RepoPulse AI locally.

### 1. Clone the repository

```bash
git clone https://github.com/HirulaAbesignha/repopulse-ai.git
```

### 2. Go into the project folder

```bash
cd repopulse-ai
```

### 3. Install dependencies

```bash
npm install
```

---

## GitHub OAuth Setup

To use GitHub login, create a GitHub OAuth App.

Go to:

```text
GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
```

For local development, use:

```text
Homepage URL:
http://localhost:3000
```

```text
Authorization callback URL:
http://localhost:3000/api/auth/github/callback
```

After creating the OAuth App, copy the Client ID and Client Secret.

---

## Environment Variables

Create a `.env.local` file in the root folder.

```env
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Important:

```text
Never commit .env.local to GitHub.
```

Make sure `.gitignore` includes:

```gitignore
.env.local
.env
```

---

## Run Locally

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Build for Production

```bash
npm run build
```

Start production server:

```bash
npm start
```

---

## Deployment

RepoPulse AI is deployed on Vercel.

Live app:

```text
https://repopulse-ai.vercel.app
```

For production, update your GitHub OAuth App settings:

```text
Homepage URL:
https://repopulse-ai.vercel.app
```

```text
Authorization callback URL:
https://repopulse-ai.vercel.app/api/auth/github/callback
```

In Vercel, add these environment variables:

```env
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
NEXT_PUBLIC_APP_URL=https://repopulse-ai.vercel.app
```

---

## API Routes

### Analyze Repository

```text
POST /api/analyze
```

Analyzes a GitHub repository using its repository URL.

### GitHub Login

```text
GET /api/auth/github/login
```

Redirects the user to GitHub OAuth authorization.

### GitHub Callback

```text
GET /api/auth/github/callback
```

Handles the GitHub OAuth response and stores the access token securely in an HTTP-only cookie.

### Logout

```text
GET /api/auth/logout
```

Logs the user out by clearing authentication cookies.

### User Repositories

```text
GET /api/user/repos
```

Fetches repositories from the signed-in GitHub account.

### User Profile

```text
GET /api/user/profile
```

Fetches the signed-in GitHub user's profile information.

---

## Repository Health Checks

RepoPulse AI checks for:

- README file
- Repository description
- License
- Programming languages
- Repository update activity
- Issues data
- Pull request data
- Installation instructions
- Usage instructions
- Screenshots or preview images

Each check contributes to the final repository health score.

---

## README Generator

RepoPulse AI generates a professional README draft that includes:

- Project title
- Badges
- Overview
- Table of contents
- Project status
- Features
- Tech stack
- Preview section
- Getting started guide
- Environment variables
- Available scripts
- Project structure
- Repository health suggestions
- Roadmap
- Contributing guide
- License section
- Support section

Users can either copy the generated README or download it as a `README.md` file.

---

## Purpose of the Project

This project was created to demonstrate a working GitHub integration using GitHub OAuth and the GitHub API.

RepoPulse AI is designed to help:

- Students improve academic project repositories
- Developers improve portfolio projects
- Open-source contributors improve documentation
- Freelancers present projects more professionally
- GitHub users quickly generate better README files

---

## Roadmap

Planned improvements:

- [ ] Add AI-powered README rewriting
- [ ] Add repository comparison
- [ ] Add exportable PDF report
- [ ] Add GitHub issue improvement suggestions
- [ ] Add commit activity visualization
- [ ] Add project deployment checklist
- [ ] Add organization repository support
- [ ] Add saved reports for signed-in users

---

## Security Notes

RepoPulse AI uses HTTP-only cookies to store the GitHub access token during authentication.

Sensitive keys such as GitHub Client Secret and GitHub Token are stored as environment variables and should never be exposed on the frontend or committed to GitHub.

---

## Support

For support, questions, or feedback, contact:

```text
hirulapinibinda01@gmail.com
```

Or open an issue in this repository.

---

## Author

Built by **HirulaAbesignha**

GitHub: https://github.com/HirulaAbesignha

---

## License

This project is available under the MIT License.

You can update this section based on the license you choose for the repository.
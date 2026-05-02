function titleCase(text) {
  return text
    .replace(/[-_]/g, " ")
    .replace(/\w\S*/g, (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}

function getMainLanguage(repo, languages) {
  const languageList = Object.keys(languages || {});
  return repo.language || languageList[0] || "Not specified";
}

function getTechStack(languages) {
  const languageList = Object.keys(languages || {});

  if (languageList.length === 0) {
    return "- Add your technologies here";
  }

  return languageList.map((language) => `- ${language}`).join("\n");
}

function getRunCommands(mainLanguage) {
  const language = mainLanguage.toLowerCase();

  if (
    language.includes("javascript") ||
    language.includes("typescript") ||
    language.includes("html") ||
    language.includes("css")
  ) {
    return {
      install: "npm install",
      dev: "npm run dev",
      build: "npm run build",
      start: "npm start",
    };
  }

  if (language.includes("python")) {
    return {
      install: "pip install -r requirements.txt",
      dev: "python main.py",
      build: "Not required for most Python projects",
      start: "python main.py",
    };
  }

  if (language.includes("java")) {
    return {
      install: "mvn install",
      dev: "mvn spring-boot:run",
      build: "mvn package",
      start: "java -jar target/your-app-name.jar",
    };
  }

  return {
    install: "Add installation command here",
    dev: "Add development command here",
    build: "Add build command here",
    start: "Add start command here",
  };
}

function getImprovementList(suggestions) {
  if (!suggestions || suggestions.length === 0) {
    return "- No major improvements suggested.";
  }

  return suggestions.map((item) => `- ${item}`).join("\n");
}

function getRepoStatus(score) {
  if (score >= 85) {
    return "Strong";
  }

  if (score >= 65) {
    return "Good foundation";
  }

  if (score >= 40) {
    return "Needs improvement";
  }

  return "Early stage";
}

export function generateReadmeDraft({ repo, languages, score, suggestions }) {
  const projectTitle = titleCase(repo.name || "Project Name");
  const mainLanguage = getMainLanguage(repo, languages);
  const techStack = getTechStack(languages);
  const improvementList = getImprovementList(suggestions);
  const status = getRepoStatus(score);
  const commands = getRunCommands(mainLanguage);

  const description =
    repo.description ||
    "A software project built to solve a specific problem. Replace this line with a clear description of what the project does, who it is for, and why it is useful.";

  const repoUrl = repo.html_url || "https://github.com/username/repository";
  const fullName = repo.full_name || "username/repository";
  const licenseName = repo.license?.name || "Not specified";

  return `# ${projectTitle}

![GitHub stars](https://img.shields.io/github/stars/${fullName}?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/${fullName}?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/${fullName}?style=flat-square)
![GitHub license](https://img.shields.io/github/license/${fullName}?style=flat-square)

## Overview

${description}

This project is mainly built using **${mainLanguage}** and is designed to be simple, maintainable, and easy to improve.

## Table of Contents

- [Overview](#overview)
- [Project Status](#project-status)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Preview](#preview)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Repository Health](#repository-health)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Project Status

Current status: **${status}**

RepoPulse AI Score: **${score}/100**

This score is based on repository structure, README quality, project activity, license availability, and general GitHub project presentation.

## Features

- Clean and organized project structure
- Built with ${mainLanguage}
- Easy to run locally
- Suitable for future improvements and scaling
- Add your real project features here
- Add another important feature here
- Add user-focused benefits here

## Tech Stack

${techStack}

## Preview

Add screenshots, screen recordings, or demo GIFs here.

Example:

\`\`\`md
![Project Preview](./public/preview.png)
\`\`\`

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have the required tools installed.

For JavaScript or TypeScript projects:

\`\`\`bash
node -v
npm -v
\`\`\`

For other projects, add the required tools here.

### Installation

Clone the repository:

\`\`\`bash
git clone ${repoUrl}
\`\`\`

Go into the project folder:

\`\`\`bash
cd ${repo.name}
\`\`\`

Install dependencies:

\`\`\`bash
${commands.install}
\`\`\`

Run the project:

\`\`\`bash
${commands.dev}
\`\`\`

## Environment Variables

Create a \`.env\` file in the root directory and add the required environment variables.

Example:

\`\`\`env
DATABASE_URL=your_database_url
API_KEY=your_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

Update this section based on the actual environment variables used in your project.

## Available Scripts

Use these commands based on your project setup.

### Development

\`\`\`bash
${commands.dev}
\`\`\`

### Build

\`\`\`bash
${commands.build}
\`\`\`

### Start Production Server

\`\`\`bash
${commands.start}
\`\`\`

## Project Structure

Update this structure based on your actual folders.

\`\`\`text
${repo.name}/
├── app/
├── components/
├── lib/
├── public/
├── styles/
├── package.json
└── README.md
\`\`\`

## Repository Health

RepoPulse AI found the following improvement suggestions:

${improvementList}

Recommended README sections to keep updated:

- Project overview
- Features
- Installation guide
- Usage instructions
- Screenshots or demo
- Tech stack
- License
- Contact/support details

## Roadmap

Planned or suggested improvements:

- [ ] Add detailed project screenshots
- [ ] Improve setup documentation
- [ ] Add usage examples
- [ ] Add deployment instructions
- [ ] Add contribution guidelines
- [ ] Add license information

## Contributing

Contributions are welcome.

To contribute:

1. Fork the repository
2. Create a new branch

\`\`\`bash
git checkout -b feature/your-feature-name
\`\`\`

3. Make your changes
4. Commit your changes

\`\`\`bash
git commit -m "Add your message here"
\`\`\`

5. Push to your branch

\`\`\`bash
git push origin feature/your-feature-name
\`\`\`

6. Open a pull request

## License

Current license: **${licenseName}**

Update this section with the correct license for your project.

## Author

Created by the repository owner.

GitHub Repository: ${repoUrl}

## Support

If you have questions, issues, or suggestions, open an issue in this repository.
`;
}
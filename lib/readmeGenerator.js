export function generateReadmeDraft({ repo, languages, score, suggestions }) {
  const languageList = Object.keys(languages || {});

  const mainLanguage = repo.language || languageList[0] || "Not specified";

  const description =
    repo.description ||
    "A software project built to solve a specific problem. Add a clearer project description here.";

  const techStack =
    languageList.length > 0
      ? languageList.map((language) => `- ${language}`).join("\n")
      : "- Add your technologies here";

  const improvementList =
    suggestions.length > 0
      ? suggestions.map((item) => `- ${item}`).join("\n")
      : "- No major improvements suggested.";

  return `# ${repo.name}

## Overview

${description}

This project is mainly built using **${mainLanguage}**.

## Features

- Add your main feature here
- Add another important feature here
- Add user-focused benefits here

## Tech Stack

${techStack}

## Installation

Clone the repository:

\`\`\`bash
git clone ${repo.html_url}
\`\`\`

Go into the project folder:

\`\`\`bash
cd ${repo.name}
\`\`\`

Install dependencies:

\`\`\`bash
npm install
\`\`\`

Run the project:

\`\`\`bash
npm run dev
\`\`\`

## Usage

Explain how users can use this project after running it locally.

## Screenshots

Add screenshots or preview images here.

## Repository Health

RepoPulse AI Score: **${score}/100**

Suggested improvements:

${improvementList}

## License

Add your license information here.
`;
}
function decodeReadme(readme) {
  if (!readme?.content) return "";

  try {
    return Buffer.from(readme.content, "base64").toString("utf-8");
  } catch {
    return "";
  }
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

export function scoreRepository({ repo, readme, languages, issues, pulls }) {
  let score = 0;
  const checks = [];
  const suggestions = [];

  const readmeText = decodeReadme(readme);
  const lowerReadme = readmeText.toLowerCase();

  function addCheck(condition, points, successText, failText, suggestionText) {
    if (condition) {
      score += points;
      checks.push({ status: "pass", text: successText });
    } else {
      checks.push({ status: "fail", text: failText });

      if (suggestionText) {
        suggestions.push(suggestionText);
      }
    }
  }

  addCheck(
    Boolean(readme),
    20,
    "README file found",
    "README file is missing",
    "Add a README.md file explaining what the project is, how to install it, and how to use it."
  );

  addCheck(
    repo.description && repo.description.length > 10,
    10,
    "Repository has a clear description",
    "Repository description is missing or too short",
    "Add a short GitHub repository description so visitors immediately understand the project."
  );

  addCheck(
    Boolean(repo.license),
    10,
    "License found",
    "License is missing",
    "Add a license such as MIT if this is an open-source project."
  );

  addCheck(
    Object.keys(languages || {}).length > 0,
    10,
    "Programming languages detected",
    "No languages detected",
    "Make sure the repository contains source code files."
  );

  addCheck(
    Boolean(repo.updated_at),
    10,
    "Repository has update activity",
    "Repository update activity not found",
    "Push recent updates so users know the project is maintained."
  );

  addCheck(
    Array.isArray(issues),
    10,
    "Issues data loaded",
    "Could not load issues",
    "Enable or check GitHub Issues for better project tracking."
  );

  addCheck(
    Array.isArray(pulls),
    10,
    "Pull request data loaded",
    "Could not load pull requests",
    "Use pull requests to track changes and collaboration."
  );

  addCheck(
    includesAny(lowerReadme, ["install", "installation", "setup", "getting started"]),
    10,
    "README includes setup or installation guidance",
    "README should include setup or installation instructions",
    "Add a clear installation section with commands like npm install and npm run dev."
  );

  addCheck(
    includesAny(lowerReadme, ["usage", "how to use", "features", "demo"]),
    10,
    "README explains how to use the project",
    "README should explain how to use the project",
    "Add a usage or features section showing what users can do with the project."
  );

  addCheck(
    includesAny(lowerReadme, ["![", "<img", "screenshot", "preview"]),
    10,
    "README includes images or screenshots",
    "README should include screenshots or images",
    "Add screenshots, preview images, or a demo GIF to make the repo more attractive."
  );

  const missingSections = [];

  if (!includesAny(lowerReadme, ["install", "installation", "setup"])) {
    missingSections.push("Installation");
  }

  if (!includesAny(lowerReadme, ["usage", "how to use"])) {
    missingSections.push("Usage");
  }

  if (!includesAny(lowerReadme, ["features"])) {
    missingSections.push("Features");
  }

  if (!includesAny(lowerReadme, ["screenshot", "preview", "demo", "![", "<img"])) {
    missingSections.push("Screenshots");
  }

  if (!includesAny(lowerReadme, ["license"])) {
    missingSections.push("License");
  }

  const topLanguage =
    repo.language || Object.keys(languages || {})[0] || "Unknown";

  const summary = generateSummary({
    repo,
    topLanguage,
    score: Math.min(score, 100),
    missingSections,
  });

  return {
    score: Math.min(score, 100),
    checks,
    suggestions,
    summary,
    missingSections,
    readmeLength: readmeText.length,
  };
}

function generateSummary({ repo, topLanguage, score, missingSections }) {
  let quality = "needs improvement";

  if (score >= 85) quality = "looks strong and well-maintained";
  else if (score >= 65) quality = "has a good foundation but needs polishing";
  else if (score >= 40) quality = "is usable but missing important project details";

  const description = repo.description
    ? repo.description
    : "No repository description was provided";

  const missingText =
    missingSections.length > 0
      ? `The main missing areas are ${missingSections.join(", ")}.`
      : "The README covers the main expected areas.";

  return `${repo.full_name} is mainly a ${topLanguage} project. ${description}. Based on the repository health checks, this project ${quality}. ${missingText}`;
}
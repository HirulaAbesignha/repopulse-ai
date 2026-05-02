export function scoreRepository({ repo, readme, languages, issues, pulls }) {
  let score = 0;
  const checks = [];

  function addCheck(condition, points, successText, failText) {
    if (condition) {
      score += points;
      checks.push({ status: "pass", text: successText });
    } else {
      checks.push({ status: "fail", text: failText });
    }
  }

  addCheck(Boolean(readme), 20, "README file found", "README file is missing");

  addCheck(
    repo.description && repo.description.length > 10,
    10,
    "Repository has a clear description",
    "Repository description is missing or too short"
  );

  addCheck(
    repo.license,
    10,
    "License found",
    "License is missing"
  );

  addCheck(
    Object.keys(languages || {}).length > 0,
    10,
    "Programming languages detected",
    "No languages detected"
  );

  addCheck(
    repo.updated_at,
    10,
    "Repository has update activity",
    "Repository update activity not found"
  );

  addCheck(
    issues.length >= 0,
    10,
    "Issues data loaded",
    "Could not load issues"
  );

  addCheck(
    pulls.length >= 0,
    10,
    "Pull request data loaded",
    "Could not load pull requests"
  );

  const readmeText = readme?.content
    ? Buffer.from(readme.content, "base64").toString("utf-8").toLowerCase()
    : "";

  addCheck(
    readmeText.includes("install") || readmeText.includes("setup"),
    10,
    "README includes setup or installation guidance",
    "README should include setup or installation instructions"
  );

  addCheck(
    readmeText.includes("usage") || readmeText.includes("how to use"),
    10,
    "README explains how to use the project",
    "README should explain how to use the project"
  );

  addCheck(
    readmeText.includes("![") || readmeText.includes("<img"),
    10,
    "README includes images or screenshots",
    "README should include screenshots or images"
  );

  return {
    score: Math.min(score, 100),
    checks,
  };
}
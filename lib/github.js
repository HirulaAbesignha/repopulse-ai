export function parseGitHubUrl(repoUrl) {
  try {
    const url = new URL(repoUrl);
    const parts = url.pathname.split("/").filter(Boolean);

    if (url.hostname !== "github.com" || parts.length < 2) {
      throw new Error("Invalid GitHub repository URL");
    }

    return {
      owner: parts[0],
      repo: parts[1],
    };
  } catch {
    throw new Error("Please enter a valid GitHub repository URL");
  }
}

export async function githubFetch(endpoint) {
  const res = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}
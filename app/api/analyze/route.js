import { githubFetch, parseGitHubUrl } from "@/lib/github";
import { scoreRepository } from "@/lib/scoreRepo";

export async function POST(req) {
  try {
    const body = await req.json();
    const { repoUrl } = body;

    if (!repoUrl) {
      return Response.json(
        { error: "Repository URL is required" },
        { status: 400 }
      );
    }

    const { owner, repo } = parseGitHubUrl(repoUrl);

    const repoData = await githubFetch(`/repos/${owner}/${repo}`);
    const languages = await githubFetch(`/repos/${owner}/${repo}/languages`);
    const issues = await githubFetch(`/repos/${owner}/${repo}/issues?state=open`);
    const pulls = await githubFetch(`/repos/${owner}/${repo}/pulls?state=open`);

    let readme = null;

    try {
      readme = await githubFetch(`/repos/${owner}/${repo}/readme`);
    } catch {
      readme = null;
    }

    const result = scoreRepository({
      repo: repoData,
      readme,
      languages,
      issues,
      pulls,
    });

    return Response.json({
      repo: {
        name: repoData.name,
        fullName: repoData.full_name,
        description: repoData.description,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        language: repoData.language,
        updatedAt: repoData.updated_at,
        url: repoData.html_url,
      },
      languages,
      score: result.score,
      checks: result.checks,
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
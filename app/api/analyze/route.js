import { cookies } from "next/headers";
import { githubFetch, parseGitHubUrl } from "@/lib/github";
import { scoreRepository } from "@/lib/scoreRepo";
import { generateReadmeDraft } from "@/lib/readmeGenerator";

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

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("github_access_token")?.value || null;

    const { owner, repo } = parseGitHubUrl(repoUrl);

    const repoData = await githubFetch(`/repos/${owner}/${repo}`, accessToken);
    const languages = await githubFetch(
      `/repos/${owner}/${repo}/languages`,
      accessToken
    );

    const issues = await githubFetch(
      `/repos/${owner}/${repo}/issues?state=open`,
      accessToken
    );

    const pulls = await githubFetch(
      `/repos/${owner}/${repo}/pulls?state=open`,
      accessToken
    );

    let readme = null;

    try {
      readme = await githubFetch(`/repos/${owner}/${repo}/readme`, accessToken);
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

    const readmeDraft = generateReadmeDraft({
      repo: repoData,
      languages,
      score: result.score,
      suggestions: result.suggestions,
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
        license: repoData.license?.name || null,
      },
      languages,
      score: result.score,
      checks: result.checks,
      suggestions: result.suggestions,
      summary: result.summary,
      missingSections: result.missingSections,
      readmeLength: result.readmeLength,
      readmeDraft,
    });
  } catch (error) {
    console.error("Analyze API Error:", error);

    return Response.json(
      {
        error: error.message || "Something went wrong while analyzing the repo",
      },
      { status: 500 }
    );
  }
}
import { cookies } from "next/headers";
import { githubFetch } from "@/lib/github";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("github_access_token")?.value;

    if (!accessToken) {
      return Response.json(
        { error: "Not signed in with GitHub" },
        { status: 401 }
      );
    }

    const repos = await githubFetch(
      "/user/repos?sort=updated&direction=desc&per_page=100",
      accessToken
    );

    const cleanRepos = repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      private: repo.private,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: repo.updated_at,
      url: repo.html_url,
    }));

    return Response.json({
      repos: cleanRepos,
    });
  } catch (error) {
    console.error("Repos API Error:", error);

    return Response.json(
      { error: error.message || "Failed to load repositories" },
      { status: 500 }
    );
  }
}
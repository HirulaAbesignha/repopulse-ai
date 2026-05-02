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

    const user = await githubFetch("/user", accessToken);

    return Response.json({
      user: {
        login: user.login,
        name: user.name,
        avatarUrl: user.avatar_url,
        profileUrl: user.html_url,
        publicRepos: user.public_repos,
        followers: user.followers,
      },
    });
  } catch (error) {
    console.error("Profile API Error:", error);

    return Response.json(
      { error: error.message || "Failed to load profile" },
      { status: 500 }
    );
  }
}
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const { searchParams } = new URL(req.url);

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
      return NextResponse.redirect(`${appUrl}/?authError=missing_code`);
    }

    const cookieStore = await cookies();
    const savedState = cookieStore.get("github_oauth_state")?.value;

    if (!state || !savedState || state !== savedState) {
      return NextResponse.redirect(`${appUrl}/?authError=invalid_state`);
    }

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${appUrl}/api/auth/github/callback`,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("GitHub token error:", tokenData);
      return NextResponse.redirect(`${appUrl}/?authError=token_failed`);
    }

    const response = NextResponse.redirect(`${appUrl}/?login=success`);

    response.cookies.set("github_access_token", tokenData.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    response.cookies.delete("github_oauth_state");

    return response;
  } catch (error) {
    console.error("GitHub callback error:", error);
    return NextResponse.redirect(`${appUrl}/?authError=server_error`);
  }
}
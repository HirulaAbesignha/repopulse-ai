import { NextResponse } from "next/server";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const response = NextResponse.redirect(appUrl);

  response.cookies.delete("github_access_token");
  response.cookies.delete("github_oauth_state");

  return response;
}
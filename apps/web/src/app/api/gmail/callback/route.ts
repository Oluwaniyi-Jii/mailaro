import { NextResponse } from "next/navigation";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getGmailOAuthRedirectUri,
  GMAIL_OAUTH_STATE_COOKIE,
  isValidGmailOAuthState,
} from "@/lib/gmail-oauth";
import { encryptToken } from "@/lib/token-crypto";
import { prisma } from "@mailaro/db";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");
  const cookieStore = await cookies();
  const expectedStateHash = cookieStore.get(GMAIL_OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(GMAIL_OAUTH_STATE_COOKIE);

  if (!isValidGmailOAuthState(state, expectedStateHash)) {
    return NextResponse.redirect(new URL("/dashboard?error=gmail_state_invalid", request.url));
  }

  if (error || !code) {
    return NextResponse.redirect(new URL("/dashboard?error=gmail_connect_failed", request.url));
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: getGmailOAuthRedirectUri(),
    }),
  });

  const data = await tokenResponse.json();

  if (!tokenResponse.ok) {
    console.error("Token exchange failed:", data);
    return NextResponse.redirect(new URL("/dashboard?error=token_exchange_failed", request.url));
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const profileResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
    headers: { Authorization: `Bearer ${data.access_token}` },
  });

  if (!profileResponse.ok) {
    return NextResponse.redirect(new URL("/dashboard?error=gmail_profile_failed", request.url));
  }

  const profileData: { emailAddress?: string } = await profileResponse.json();
  const emailAddress = profileData.emailAddress;

  if (!emailAddress) {
    return NextResponse.redirect(new URL("/dashboard?error=gmail_profile_missing", request.url));
  }

  await prisma.gmailConnection.upsert({
    where: { userId: user.id },
    update: {
      emailAddress,
      accessToken: encryptToken(data.access_token),
      ...(data.refresh_token ? { refreshToken: encryptToken(data.refresh_token) } : {}),
      expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
      scope: data.scope,
    },
    create: {
      userId: user.id,
      emailAddress,
      accessToken: encryptToken(data.access_token),
      refreshToken: encryptToken(data.refresh_token),
      expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
      scope: data.scope,
    }
  });

  return NextResponse.redirect(new URL("/dashboard?success=gmail_connected", request.url));
}

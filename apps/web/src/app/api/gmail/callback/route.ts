import { NextResponse } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@mailaro/db";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

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
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/gmail/callback`,
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

  await prisma.gmailConnection.upsert({
    where: { userId: user.id },
    update: {
      emailAddress: session.user.email,
      accessToken: data.access_token,
      refreshToken: data.refresh_token || undefined,
      expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
      scope: data.scope,
    },
    create: {
      userId: user.id,
      emailAddress: session.user.email,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
      scope: data.scope,
    }
  });

  return NextResponse.redirect(new URL("/dashboard?success=gmail_connected", request.url));
}

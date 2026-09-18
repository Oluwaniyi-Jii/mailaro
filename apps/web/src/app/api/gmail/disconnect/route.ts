import { NextResponse } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@mailaro/db";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (user) {
    await prisma.gmailConnection.deleteMany({
      where: { userId: user.id }
    });
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}

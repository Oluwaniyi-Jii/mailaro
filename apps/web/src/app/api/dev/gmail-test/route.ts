import { NextResponse } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@mailaro/db";

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "development only" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { gmailConnection: true }
  });

  if (!user?.gmailConnection?.accessToken) {
    return NextResponse.json({ error: "no gmail connection" }, { status: 400 });
  }

  const { accessToken } = user.gmailConnection;

  // Fetch the latest message ID
  const listResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=1", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!listResponse.ok) {
    return NextResponse.json({ error: "failed to list messages", details: await listResponse.text() }, { status: 500 });
  }

  const listData = await listResponse.json();
  const messageId = listData.messages?.[0]?.id;

  if (!messageId) {
    return NextResponse.json({ error: "no messages found" }, { status: 404 });
  }

  // Fetch the message details
  const msgResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!msgResponse.ok) {
    return NextResponse.json({ error: "failed to fetch message details" }, { status: 500 });
  }

  const msgData = await msgResponse.json();
  
  // Normalize response
  const headers = msgData.payload?.headers || [];
  const subject = headers.find((h: any) => h.name.toLowerCase() === "subject")?.value || "No Subject";
  const from = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "Unknown Sender";
  
  const normalizedMessage = {
    id: msgData.id,
    threadId: msgData.threadId,
    snippet: msgData.snippet,
    subject,
    from,
  };

  return NextResponse.json({ success: true, message: normalizedMessage });
}

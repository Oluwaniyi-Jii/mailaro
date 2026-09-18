import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, CheckCircle2, LogOut, Mail, MailCheck } from "lucide-react";
import { prisma } from "@mailaro/db";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { gmailConnection: true },
  });

  const gmailConnection = user?.gmailConnection;
  const isConnected = !!gmailConnection;

  return (
    <div className="app-shell">
      <main className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
        <header className="mb-10 flex items-center justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="brand-mark h-10 w-10">
              <MailCheck className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-950">Mailaro</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">{session.user.name}</p>
              <p className="text-xs text-slate-500">{session.user.email}</p>
            </div>
            <Link
              href="/api/auth/signout"
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <section className={`surface-panel p-8 ${isConnected ? "border-brand-200" : ""}`}>
            <div
              className={`mb-6 flex h-12 w-12 items-center justify-center rounded-lg border ${
                isConnected
                  ? "border-brand-200 bg-brand-50 text-brand-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              <Mail className="h-6 w-6" />
            </div>

            {isConnected ? (
              <>
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    Gmail Connected
                  </h2>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="mb-6 text-sm leading-relaxed text-slate-600">
                  Tracking is active for{" "}
                  <span className="font-medium text-slate-950">
                    {gmailConnection.emailAddress}
                  </span>
                  . The extension is now permitted to insert tracking pixels.
                </p>

                <a
                  href="/api/gmail/disconnect"
                  className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                >
                  Disconnect Account
                </a>
              </>
            ) : (
              <>
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    Connect Gmail
                  </h2>
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <p className="mb-8 text-sm leading-relaxed text-slate-600">
                  Mailaro operates natively through your Gmail outbox. Securely connect
                  your account to enable invisible pixel tracking and smart link rewrites.
                </p>

                <a
                  href="/api/gmail/connect"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-brand-700 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-800"
                >
                  Authenticate with Google Workspace
                </a>
              </>
            )}
          </section>

          <section className="surface-panel flex flex-col items-center justify-center border-dashed p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">Activity Stream</h3>
            <p className="max-w-[220px] text-sm text-slate-500">
              Connect your account to view realtime engagement metrics.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

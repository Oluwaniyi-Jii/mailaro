import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Zap, LogOut, Mail } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Ambience */}
      <div className="glow-bg bg-purple-600/50 w-[800px] h-[800px] top-[-30%] right-[-10%]" />
      
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Mailaro</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{session.user.name}</p>
              <p className="text-xs text-zinc-400">{session.user.email}</p>
            </div>
            <a
              href="/api/auth/signout"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-zinc-400 hover:text-white"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="glass-panel rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-6 text-blue-400">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">Connect Gmail</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                Mailaro operates natively through your Gmail outbox. Securely connect your account to enable invisible pixel tracking and smart link rewrites.
              </p>
              
              <a
                href="/api/gmail/connect"
                className="inline-flex items-center justify-center w-full px-6 py-4 rounded-xl font-medium text-sm transition-all duration-300 bg-white text-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Authenticate with Google Workspace
              </a>
            </div>
          </section>

          {/* Placeholder for future activity stats */}
          <section className="glass-panel rounded-3xl p-8 border-dashed border-white/20 flex flex-col items-center justify-center text-center opacity-60">
            <h3 className="text-lg font-medium text-white mb-2">Activity Stream</h3>
            <p className="text-sm text-zinc-500 max-w-[200px]">
              Connect your account to view realtime engagement metrics.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

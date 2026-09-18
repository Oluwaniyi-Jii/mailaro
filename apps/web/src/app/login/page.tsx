"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2, Zap } from "lucide-react";

export default function LoginPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleGoogleSignIn = async () => {
    setStatus("loading");
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden selection:bg-fuchsia-500/30">
      {/* Abstract Background Orbs */}
      <div className="glow-bg bg-indigo-600 w-[600px] h-[600px] top-[-20%] left-[-10%]" />
      <div className="glow-bg bg-pink-600 w-[500px] h-[500px] bottom-[-10%] right-[-5%]" />
      
      <div className="relative z-10 w-full max-w-[420px] mx-auto p-6">
        <div className="glass-panel p-10 rounded-3xl relative overflow-hidden group">
          {/* Subtle hover gradient ring */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)]">
              <Zap className="w-7 h-7 text-white fill-white/20" strokeWidth={1.5} />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">
              Mailaro
            </h1>
            <p className="text-zinc-400 text-sm font-medium tracking-wide">
              Intelligence for your outbox.
            </p>
          </div>

          {status === "error" && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              Sign in failed. Please try again.
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={status === "loading"}
            className="group relative w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white px-6 py-4 rounded-2xl font-medium transition-all duration-300 overflow-hidden disabled:opacity-50"
          >
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
            ) : (
              <svg className="w-5 h-5 opacity-90 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            <span className="tracking-wide">
              {status === "loading" ? "Authenticating..." : "Continue with Google"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

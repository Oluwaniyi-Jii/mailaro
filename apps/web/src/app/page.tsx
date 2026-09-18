import { ArrowRight, MailCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="app-shell">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
        <header className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="brand-mark h-10 w-10">
              <MailCheck className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-950">
              Mailaro
            </span>
          </div>
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:border-brand-600 hover:text-brand-700"
          >
            Sign in
            <ArrowRight className="h-4 w-4" />
          </a>
        </header>

        <section className="grid flex-1 items-center gap-10 py-16 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-brand-700">
              Email tracking for operators
            </p>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.05] tracking-tight text-slate-950">
              Know what happens after an important email leaves your outbox.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
              Mailaro connects to Gmail, tracks opens and link engagement, and keeps
              the signal clean enough to use in real follow-up decisions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-800"
              >
                Connect Gmail
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:border-brand-600 hover:text-brand-700"
              >
                View dashboard
              </a>
            </div>
          </div>

          <div className="rounded-lg bg-brand-900 p-6 text-white shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-medium text-brand-100">Campaign signal</p>
                <p className="text-2xl font-semibold">Today</p>
              </div>
              <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-brand-50">
                Live
              </span>
            </div>
            <div className="space-y-5">
              {[
                ["Opened", "142", "72%"],
                ["Clicked", "38", "19%"],
                ["Replies", "11", "6%"],
              ].map(([label, count, percent]) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-200">{label}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-brand-100"
                      style={{ width: percent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

import { MailCheck } from "lucide-react";
import { GoogleSignInButton } from "./google-sign-in-button";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasError = Boolean(params?.error);

  return (
    <div className="app-shell flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[420px]">
        <div className="surface-panel p-8 sm:p-10">
          <div className="mb-8 flex justify-center">
            <div className="brand-mark h-12 w-12">
              <MailCheck className="h-6 w-6" strokeWidth={1.8} />
            </div>
          </div>

          <div className="mb-10 text-center">
            <h1 className="mb-2 text-3xl font-semibold tracking-tight text-slate-950">
              Mailaro
            </h1>
            <p className="text-sm font-medium text-slate-600">
              Intelligence for your outbox.
            </p>
          </div>

          {hasError && (
            <div className="mb-6 border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-700">
              Sign in failed. Please try again.
            </div>
          )}

          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}

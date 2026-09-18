import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="font-semibold">Signed in as {session.user.name}</p>
            <p className="text-sm opacity-90">{session.user.email}</p>
          </div>
          <a
            href="/api/auth/signout"
            className="px-4 py-2 bg-white text-blue-600 rounded-md font-medium text-sm hover:bg-blue-50 transition-colors border border-blue-200"
          >
            Sign out
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Integration</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-2">Connect your Gmail</h3>
            <p className="text-gray-500 text-sm mb-4">
              To send tracked emails, Mailaro needs permission to send emails on your behalf and read metadata for replies.
            </p>
            <a
              href="/api/gmail/connect"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition-colors"
            >
              Connect Gmail
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

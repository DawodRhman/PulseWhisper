import AdminLoginCard from "@/components/admin/AdminLoginCard";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/auth/session";
import { getAdminDashboardStats } from "@/lib/admin/dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  const dashboardStats = session ? await getAdminDashboardStats() : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {session ? (
        <AdminShell session={session} dashboardStats={dashboardStats} />
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
           {/* Background elements matching frontend style */}
           <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-blue-50 -z-10" />
           <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
              <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-200/20 blur-3xl" />
              <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-200/20 blur-3xl" />
           </div>

           <div className="w-full max-w-md relative z-10">
              <div className="mb-8 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 mb-6">
                  <span className="text-2xl font-bold">KW</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Portal</h1>
                <p className="mt-2 text-slate-500">Karachi Water & Sewerage Corporation</p>
              </div>
              <AdminLoginCard />
           </div>
           
           <div className="mt-8 text-center text-xs text-slate-400 relative z-10">
             &copy; {new Date().getFullYear()} KW&SC. Authorized Personnel Only.
           </div>
        </div>
      )}
    </div>
  );
}

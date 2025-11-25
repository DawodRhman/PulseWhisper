import "../globals.css";

export const metadata = {
  title: "Admin Control Center | KW&SC",
  description: "Internal administration portal for Karachi Water & Sewerage Corporation.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <section className="min-h-screen bg-white text-slate-900">{children}</section>;
}

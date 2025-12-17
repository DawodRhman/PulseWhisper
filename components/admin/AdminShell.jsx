"use client";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Megaphone,
  Users,
  Briefcase,
  Gavel,
  LogOut,
  ServerCog,
  Building2,
  UserRound,
  Share2,
  Sparkles,
  Clock4,
  ImageDown,
  BarChart3,
  MapPin,
  GitMerge,
  Trophy,
  HelpCircle,
  FileSearch,
  GraduationCap,
  Droplets,
  LayoutTemplate,
  Menu,
} from "lucide-react";
import ServicesPanel from "@/components/admin/services/ServicesPanel";
import TendersPanel from "@/components/admin/tenders/TendersPanel";
import CareersPanel from "@/components/admin/careers/CareersPanel";
import NewsPanel from "@/components/admin/news/NewsPanel";
import ProjectsPanel from "@/components/admin/projects/ProjectsPanel";
import LeadershipPanel from "@/components/admin/leadership/LeadershipPanel";
import SocialLinksPanel from "@/components/admin/social/SocialLinksPanel";
import MediaLibraryPanel from "@/components/admin/media/MediaLibraryPanel";
import UserManagementPanel from "@/components/admin/users/UserManagementPanel";
import AuditPanel from "@/components/admin/audit/AuditPanel";
import StatsPanel from "@/components/admin/stats/StatsPanel";
import LocationsPanel from "@/components/admin/locations/LocationsPanel";
import WorkflowPanel from "@/components/admin/workflow/WorkflowPanel";
import AchievementsPanel from "@/components/admin/achievements/AchievementsPanel";
import FaqPanel from "@/components/admin/faq/FaqPanel";
import RtiPanel from "@/components/admin/rti/RtiPanel";
import EducationPanel from "@/components/admin/education/EducationPanel";
import WaterTodayPanel from "@/components/admin/watertoday/WaterTodayPanel";
import PagesPanel from "@/components/admin/pages/PagesPanel";
import NavigationPanel from "@/components/admin/navigation/NavigationPanel";

const PANELS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, description: "At-a-glance insight" },
  { id: "navigation", label: "Navigation", icon: Menu, description: "Manage menu visibility", permissions: ["pages:write"] },
  { id: "pages", label: "Pages", icon: LayoutTemplate, description: "Manage dynamic pages" },
  { id: "services", label: "Services", icon: ServerCog, description: "Manage service cards", permissions: ["services:write"] },
  { id: "tenders", label: "Tenders", icon: FileText, description: "Procurement pipeline", permissions: ["tenders:write"] },
  { id: "careers", label: "Careers", icon: Briefcase, description: "Open roles", permissions: ["careers:write"] },
  { id: "news", label: "News", icon: Megaphone, description: "Press room", permissions: ["news:write"] },
  { id: "media", label: "Media Library", icon: ImageDown, description: "Assets & uploads", permissions: ["media:write"] },
  { id: "projects", label: "Projects", icon: Building2, description: "Portfolio highlights", permissions: ["projects:write"] },
  { id: "leadership", label: "Leadership", icon: UserRound, description: "Executive bios", permissions: ["leadership:write"] },
  { id: "stats", label: "Stats & Counters", icon: BarChart3, description: "Homepage metrics", permissions: ["settings:write"] },
  { id: "locations", label: "Locations", icon: MapPin, description: "Office addresses", permissions: ["settings:write"] },
  { id: "workflow", label: "Workflow", icon: GitMerge, description: "Process steps", permissions: ["settings:write"] },
  { id: "achievements", label: "Achievements", icon: Trophy, description: "Awards & milestones", permissions: ["settings:write"] },
  { id: "faq", label: "FAQs", icon: HelpCircle, description: "Questions & answers", permissions: ["faq:write"] },
  { id: "rti", label: "RTI Documents", icon: FileSearch, description: "Legal disclosures", permissions: ["rti:write"] },
  { id: "education", label: "Education", icon: GraduationCap, description: "Learning resources", permissions: ["education:write"] },
  { id: "watertoday", label: "Water Today", icon: Droplets, description: "Daily updates", permissions: ["watertoday:write"] },
  { id: "social", label: "Social Links", icon: Share2, description: "Connected channels", permissions: ["settings:write"] },
  { id: "users", label: "Operators", icon: Users, description: "RBAC assignments", permissions: ["users:write"] },
  { id: "audit", label: "Audit Trail", icon: Gavel, description: "Immutable activity logs", permissions: ["audit:read"] },
];

const DEFAULT_METRICS = [
  { label: "Modules tracked", value: 0, hint: "Seed data to begin" },
  { label: "Procurement items", value: 0, hint: "No tenders yet" },
  { label: "Stories", value: 0, hint: "Newsroom is empty" },
  { label: "Open roles", value: 0, hint: "Publish a position" },
];

const SECONDARY_METRICS = [
  { label: "Leadership bios", value: 0 },
  { label: "Projects", value: 0 },
  { label: "FAQ entries", value: 0 },
  { label: "Social links", value: 0 },
];

const CHECKLIST = [
  "Review new content submissions before publishing",
  "Refresh cached snapshots after performing bulk edits",
  "Keep leadership bios consistent with newsroom style",
  "Export audit trail weekly for compliance",
];

function hasPermission(session, permissions = []) {
  if (!permissions.length) return true;
  return permissions.some((permission) => session?.permissions?.includes(permission));
}

function formatRelative(value) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Never";
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return date.toLocaleDateString("en-GB");
}

function MetricCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

function PanelCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">{title}</h3>
      <div className="space-y-4 text-sm text-slate-700">{children}</div>
    </div>
  );
}

function Highlight({ title, meta, description, timestamp }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!title) return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-400 text-center">
      No recent activity
    </div>
  );

  let content = meta;
  if (timestamp) {
    content = mounted ? formatRelative(timestamp) : null;
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
           <p className="text-sm font-semibold text-slate-900 line-clamp-1">{title}</p>
           {description ? <p className="text-xs text-slate-500 mt-0.5">{description}</p> : null}
        </div>
        {content ? <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-full whitespace-nowrap ml-2">{content}</span> : null}
      </div>
    </div>
  );
}

export default function AdminShell({ session, dashboardStats }) {
  const router = useRouter();
  const accessiblePanels = useMemo(
    () => PANELS.filter((panel) => hasPermission(session, panel.permissions)),
    [session]
  );
  const [activePanel, setActivePanel] = useState(accessiblePanels[0]?.id ?? "overview");
  const metrics = dashboardStats?.metrics ?? DEFAULT_METRICS;
  const secondaryMetrics = dashboardStats?.secondaryMetrics ?? SECONDARY_METRICS;
  const highlights = dashboardStats?.highlights ?? {};
  const displayName = session?.user?.name || session?.user?.email?.split("@")[0];
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  const handleSignOut = async () => {
    try {
      await fetch("/api/papa/auth/logout", { method: "POST" });
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="admin-shell grid min-h-screen lg:grid-cols-[280px_1fr] bg-slate-50/50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col h-screen overflow-hidden border-r border-slate-200 bg-white">
        <div className="p-6 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-blue-500/20">
              KW
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Portal</p>
              <p className="text-sm font-bold text-slate-900">Control Center</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Modules</p>
          <ul className="space-y-1">
            {accessiblePanels.map((panel) => {
              const Icon = panel.icon;
              const selected = panel.id === activePanel;
              return (
                <li key={panel.id}>
                  <button
                    type="button"
                    onClick={() => setActivePanel(panel.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                      selected
                        ? "bg-gradient-to-r from-cyan-50 to-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={18} className={selected ? "text-blue-600" : "text-slate-400"} />
                    <span>{panel.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-4 border-t border-slate-100 flex-shrink-0">
           <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <Sparkles size={14} className="text-amber-500" /> Pro Tip
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Check the audit log regularly to monitor system activity.
              </p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
           <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-slate-900">
                {PANELS.find((p) => p.id === activePanel)?.label || "Dashboard"}
              </h2>
              <span className="hidden md:inline-flex h-6 w-px bg-slate-200"></span>
              <p className="hidden md:block text-sm text-slate-500">
                 {PANELS.find((p) => p.id === activePanel)?.description}
              </p>
           </div>

           <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                 <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                 <p className="text-xs text-slate-500">{session?.user?.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
           </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
           <div className="mx-auto max-w-7xl space-y-6">
              
              {/* Highlights & Stats (Only on Overview) */}
              {activePanel === "overview" && (
                <>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {metrics.map((metric) => (
                      <MetricCard key={metric.label} {...metric} />
                    ))}
                  </div>
                  
                  <div className="grid gap-6 lg:grid-cols-3">
                     <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                           <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
                           <div className="grid gap-4 sm:grid-cols-2">
                              <Highlight
                                title={highlights?.latestTender?.title}
                                description={highlights?.latestTender?.status ? `Status: ${highlights.latestTender.status}` : "Tender update"}
                                timestamp={highlights?.latestTender?.updatedAt}
                              />
                              <Highlight
                                title={highlights?.latestNews?.title}
                                description="Newsroom update"
                                timestamp={highlights?.latestNews?.publishedAt}
                              />
                           </div>
                        </div>
                     </div>
                     
                     <div className="space-y-6">
                        <PanelCard title="System Pulse">
                           <ul className="space-y-3">
                              {secondaryMetrics.map((entry) => (
                                <li key={entry.label} className="flex items-center justify-between text-sm">
                                  <span className="text-slate-500">{entry.label}</span>
                                  <span className="font-semibold text-slate-900">{entry.value}</span>
                                </li>
                              ))}
                           </ul>
                        </PanelCard>
                     </div>
                  </div>
                </>
              )}

              {/* Panel Content */}
              {activePanel !== "overview" && (
                 <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm min-h-[500px]">
                    <PanelContent panelId={activePanel} />
                 </div>
              )}
           </div>
        </div>
      </section>
    </div>
  );
}

function PanelContent({ panelId }) {
  switch (panelId) {
    case "services":
      return <ServicesPanel />;
    case "tenders":
      return <TendersPanel />;
    case "careers":
      return <CareersPanel />;
    case "news":
      return <NewsPanel />;
    case "projects":
      return <ProjectsPanel />;
    case "leadership":
      return <LeadershipPanel />;
    case "media":
      return <MediaLibraryPanel />;
    case "social":
      return <SocialLinksPanel />;
    case "users":
      return <UserManagementPanel />;
    case "audit":
      return <AuditPanel />;
    case "stats":
      return <StatsPanel />;
    case "locations":
      return <LocationsPanel />;
    case "workflow":
      return <WorkflowPanel />;
    case "achievements":
      return <AchievementsPanel />;
    case "faq":
      return <FaqPanel />;
    case "rti":
      return <RtiPanel />;
    case "education":
      return <EducationPanel />;
    case "watertoday":
      return <WaterTodayPanel />;
    case "pages":
      return <PagesPanel />;
    case "navigation":
      return <NavigationPanel />;
    default:
      return (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Snapshot Cache</p>
            <p className="mt-2 text-sm text-slate-600">Services, Tenders, Careers, and News APIs now serve cached payloads with stale-mode fallbacks.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">RBAC Roadmap</p>
            <p className="mt-2 text-sm text-slate-600">Next milestone: connect this UI to secure Prisma actions with optional MFA policies.</p>
          </div>
        </div>
      );
  }
}

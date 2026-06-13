import { useMemo } from "react";
import { BarChart3, LineChart, PieChart, ShieldCheck, Users } from "lucide-react";
import { metrics } from "./constants";
import SectionTitle from "./SectionTitle";
import { LineSpark, MiniBars } from "./MiniCharts";

const DashboardSection = ({ customerRows, claimRows, planRows, supportChats, selectedProfile, openPage }) => {
  const activeUsers = customerRows.filter((user) => user.status === "Active" || user.status === "Logged In").length;

  const dashboardMetrics = useMemo(
    () =>
      metrics.map((metric) => {
        if (metric.label === "Total Users") return { ...metric, value: String(customerRows.length), change: `${activeUsers} active` };
        if (metric.label === "Pending Claims") return { ...metric, value: String(claimRows.filter((claim) => claim.status !== "Approved" && claim.status !== "Rejected").length) };
        if (metric.label === "Approved Claims") return { ...metric, value: String(claimRows.filter((claim) => claim.status === "Approved").length) };
        if (metric.label === "Rejected Claims") return { ...metric, value: String(claimRows.filter((claim) => claim.status === "Rejected").length) };
        if (metric.label === "Open Support Tickets") return { ...metric, value: String(supportChats.filter((chat) => chat.status !== "Resolved").length), change: `${supportChats.length} total` };
        if (metric.label === "Active Policies") return { ...metric, value: String(planRows.filter((plan) => plan.state === "Active").length) };
        return metric;
      }),
    [activeUsers, claimRows, customerRows.length, planRows, supportChats],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">
              <ShieldCheck size={16} />
              Centralized admin control
            </div>
            <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Insurance Admin Dashboard</h1>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-600">
              Manage users, policies, claims, queries, requirements, document verification, notifications, reports, and operations from one console.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-black text-slate-950">Current Admin Profile</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">{selectedProfile.access}</div>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-600 text-sm font-black text-white">{selectedProfile.initials}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
              {["Email / Username", "Password", "Remember Me", "Forgot Password", "OTP 2FA"].map((label) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-white px-3 py-2">{label}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        {dashboardMetrics.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} onClick={() => openPage(item.page)} className="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-lg ${item.tone} text-white`}>
                  <Icon size={18} />
                </span>
                <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-600">{item.change}</span>
              </div>
              <div className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">{item.label}</div>
              <div className="mt-1 text-xl font-black text-slate-950">{item.value}</div>
            </button>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle icon={PieChart} title="Claims Status Overview" />
          <div className="mt-5 grid gap-5 sm:grid-cols-[180px_1fr]">
            <div className="relative mx-auto aspect-square w-40 rounded-full" style={{ background: "conic-gradient(#2563eb 0 42%, #10b981 42% 70%, #ef4444 70% 84%, #f59e0b 84% 100%)" }}>
              <div className="absolute inset-6 grid place-items-center rounded-full bg-white text-center">
                <span className="text-2xl font-black">6.1K</span>
                <span className="-mt-3 text-[11px] font-bold text-slate-500">claims</span>
              </div>
            </div>
            <div className="space-y-3">
              {[["Pending", "42%", "bg-blue-600"], ["Approved", "28%", "bg-emerald-500"], ["Rejected", "14%", "bg-rose-500"], ["Verification", "16%", "bg-amber-500"]].map(([label, value, color]) => (
                <button key={label} onClick={() => openPage("claims")} className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold hover:bg-slate-50">
                  <span className="flex items-center gap-2"><span className={`h-3 w-3 rounded-sm ${color}`} />{label}</span>
                  <span>{value}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle icon={LineChart} title="Monthly Policy Sales" />
          <div className="mt-5">
            <MiniBars values={[55, 70, 45, 85, 60, 75, 50, 90, 65, 80, 70, 95]} />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle icon={Users} title="User Registration Trends" />
          <div className="mt-5">
            <LineSpark values={[30, 55, 40, 70, 50, 85, 60, 75, 45, 90, 65, 80]} color="#0f766e" />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle icon={BarChart3} title="Claim Settlement Ratio" />
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[["Settled", "78%", "text-emerald-700"], ["In SLA", "91%", "text-blue-700"], ["Escalated", "6%", "text-rose-700"]].map(([label, value, color]) => (
              <button key={label} onClick={() => openPage("reports")} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center hover:bg-white">
                <div className={`text-2xl font-black ${color}`}>{value}</div>
                <div className="mt-1 text-xs font-bold text-slate-500">{label}</div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardSection;

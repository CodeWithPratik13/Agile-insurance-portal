import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, RefreshCw, ShieldCheck } from "lucide-react";
import { load, save } from "../../utils/storage";
import { getPolicyById } from "../../data/catalog";

// Renewal page headings, reminder text, and renewal action labels are controlled here.
const daysBetween = (a, b) => Math.max(0, Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)));

const DashboardRenewals = () => {
  const [purchases, setPurchases] = useState(() => load("purchases", []));

  const renewals = useMemo(() => {
    const now = new Date();
    return purchases
      .map((p) => {
        const policy = getPolicyById(p.policyId);
        if (!policy || !p.renewalAt) return null;
        const d = new Date(p.renewalAt);
        return { purchase: p, policy, days: daysBetween(now, d) };
      })
      .filter(Boolean)
      .sort((a, b) => a.days - b.days);
  }, [purchases]);

  const extend = (purchaseId) => {
    const all = load("purchases", []);
    const idx = all.findIndex((p) => p.id === purchaseId);
    if (idx < 0) return;
    const next = new Date(all[idx].renewalAt);
    next.setFullYear(next.getFullYear() + 1);
    all[idx] = { ...all[idx], renewalAt: next.toISOString(), status: "Active" };
    save("purchases", all);
    setPurchases(load("purchases", []));
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:rounded-[2.6rem] sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400" />
              Renewals - Reminders - One-click renew
            </div>
            <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900 dark:text-white">Renew policies</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Keep your coverage active with proactive renewals.</p>
          </div>
          <button
            onClick={() => setPurchases(load("purchases", []))}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-800 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {!renewals.length ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-white/5 sm:rounded-[2.6rem] sm:p-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-blue-600/10 text-blue-700 dark:text-blue-300">
            <CalendarClock size={26} />
          </div>
          <h2 className="mt-6 text-2xl font-black text-slate-900 dark:text-white">No renewals scheduled</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Buy a policy to see renewal reminders here.</p>
          <div className="mt-8">
            <Link
              to="/health-insurance"
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-4 text-sm font-black text-white shadow-sm hover:opacity-95"
            >
              Explore plans
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {renewals.map(({ purchase, policy, days }) => (
            <div
              key={purchase.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:rounded-[2.6rem] sm:p-7"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Policy</div>
                  <div className="mt-2 truncate text-lg font-black text-slate-900 dark:text-white">{purchase.policyNumber}</div>
                  <div className="mt-1 truncate text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {policy.company} • {policy.policyName}
                  </div>
                </div>
                <span
                  className={[
                    "rounded-full px-4 py-2 text-xs font-black",
                    days <= 15 ? "bg-rose-600/10 text-rose-700 dark:text-rose-300" : "bg-blue-600/10 text-blue-700 dark:text-blue-300",
                  ].join(" ")}
                >
                  {days} days left
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Renewal date</div>
                  <div className="mt-2 text-sm font-black text-slate-900 dark:text-white">
                    {new Date(purchase.renewalAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Coverage</div>
                  <div className="mt-2 text-sm font-black text-slate-900 dark:text-white">{policy.coverageLabel}</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
                <button
                  onClick={() => extend(purchase.id)}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-sm hover:opacity-95"
                >
                  Renew now
                </button>
                <Link
                  to={`/policies/${policy.id}`}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-800 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                >
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardRenewals;

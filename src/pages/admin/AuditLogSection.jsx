import { useMemo, useState } from "react";
import { ScrollText } from "lucide-react";
import { defaultAuditLogs } from "./constants";
import { STORAGE_AUDIT_LOGS } from "./helpers";

const isLoginAudit = (log) => {
  const action = log.action.toLowerCase();
  return action.includes("login") || action.includes("auth");
};

const formatAuditActionLabel = (action) => {
  const [, rawAction = action] = String(action).split("->").map((part) => part.trim());
  const endpoint = String(action).split("->")[0] || "";
  const endpointParts = endpoint.split("/").filter(Boolean);
  const moduleName = endpointParts[2] || endpointParts[1] || "system";
  const operationName = endpointParts[3] || "activity";
  const readableModule = moduleName.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
  const readableOperation = operationName.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
  return `${readableModule} ${readableOperation}: ${rawAction}`;
};

const AuditLogSection = ({ auditLogs, setAuditLogs, runAction }) => {
  const [auditFilter, setAuditFilter] = useState("login");

  const visibleAuditLogs = useMemo(
    () => auditLogs.filter((log) => (auditFilter === "login" ? isLoginAudit(log) : !isLoginAudit(log))),
    [auditLogs, auditFilter],
  );

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700">
            <ScrollText size={18} />
          </span>
          <div>
            <h2 className="text-base font-black text-slate-950">Audit Log</h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Complete activity trail — login events and all admin actions
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem(STORAGE_AUDIT_LOGS);
            setAuditLogs(defaultAuditLogs);
            runAction("Audit log reset", "Audit trail has been reset to defaults.");
          }}
          className="text-xs font-black text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-lg border border-slate-200 transition"
        >
          Reset Logs
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        {[
          { label: "Total Events", value: auditLogs.length, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Login Events", value: auditLogs.filter(isLoginAudit).length, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Insurance Events", value: auditLogs.filter((log) => !isLoginAudit(log)).length, color: "text-amber-700", bg: "bg-amber-50" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-lg ${stat.bg} p-4`}>
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="mt-1 text-xs font-bold text-slate-600">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {[
          { id: "login", label: "Login Audit" },
          { id: "insurance", label: "Claim, Policy, User & Insurance Audit" },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setAuditFilter(filter.id)}
            className={`rounded-lg px-4 py-2 text-sm font-black transition ${auditFilter === filter.id ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-black">#</th>
              <th className="px-4 py-3 font-black">Action Event</th>
              <th className="px-4 py-3 font-black">Operator</th>
              <th className="px-4 py-3 font-black">Timestamp</th>
              <th className="px-4 py-3 font-black">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {visibleAuditLogs.map((log, index) => {
              const isLogin = isLoginAudit(log);
              return (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5 text-xs font-black text-slate-400">{index + 1}</td>
                  <td className="px-4 py-3.5 text-xs font-semibold text-blue-900 max-w-xs">
                    <div className="truncate font-black">{formatAuditActionLabel(log.action)}</div>
                    <div className="mt-1 truncate font-mono text-[11px] text-slate-400">{log.action}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-slate-900 text-[10px] font-black text-white">
                        {log.initials}
                      </span>
                      <span className="font-semibold text-slate-700 text-xs">{log.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-bold text-slate-500">
                    {new Date(log.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`rounded-lg px-2 py-1 text-xs font-black ring-1 ${isLogin
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-blue-50 text-blue-700 ring-blue-200"
                        }`}
                    >
                      {isLogin ? "Login" : "Action"}
                    </span>
                  </td>
                </tr>
              );
            })}
            {visibleAuditLogs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm font-bold text-slate-500">
                  No {auditFilter === "login" ? "login" : "insurance activity"} audit records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AuditLogSection;

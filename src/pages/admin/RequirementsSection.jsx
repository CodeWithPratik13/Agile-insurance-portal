import { BadgeCheck, Plus } from "lucide-react";
import { statusClass } from "./helpers";
import SectionTitle from "./SectionTitle";

const RequirementsSection = ({ requirementRows, createRequirement, startEditRecord, mutateRows, runAction }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <SectionTitle icon={BadgeCheck} title="Requirement Management" action={<button onClick={createRequirement} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white transition hover:bg-blue-700"><Plus size={16} />Create Requirement</button>} />
    <div className="mt-5 grid gap-4 lg:grid-cols-3">
      {requirementRows.map((req) => (
        <article key={req.user} className="rounded-lg border border-slate-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-black">{req.user}</div>
              <div className="mt-1 text-xs font-semibold text-slate-500">Age {req.age} - {req.budget} - {req.coverage}</div>
            </div>
            <span className={`rounded-lg px-2 py-1 text-xs font-black ring-1 ${statusClass(req.status)}`}>{req.status}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Edit", "Suggest Policies", "Generate Quotes", "Approve", "Delete"].map((action) => (
              <button key={action} onClick={() => action === "Edit" ? startEditRecord("requirements", req) : action === "Approve" ? mutateRows("requirements", req, "approve") : action === "Delete" ? mutateRows("requirements", req, "delete") : runAction(action, `${action} for ${req.user}.`)} className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-black transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">{action}</button>
            ))}
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default RequirementsSection;

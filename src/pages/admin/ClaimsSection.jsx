import { ClipboardCheck, Plus } from "lucide-react";
import { claimSteps } from "./constants";
import DataTable from "./DataTable";
import SectionTitle from "./SectionTitle";

const ClaimsSection = ({ claimRows, createClaim, respondToClaim, rejectClaimForMissingDetails, actionButtons, runAction }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <SectionTitle icon={ClipboardCheck} title="Claims Management" action={<button onClick={createClaim} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white transition hover:bg-blue-700"><Plus size={16} />Create Claim</button>} />
    <DataTable columns={["id", "user", "policy", "amount", "status", "officer"]} rows={claimRows} renderActions={(row) => (
      <div className="flex flex-wrap gap-1">
        {actionButtons(row, "claims")}
        <button onClick={() => respondToClaim(row)} className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-black text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
          Respond
        </button>
        <button onClick={() => rejectClaimForMissingDetails(row)} className="rounded-lg border border-rose-200 px-2 py-2 text-xs font-black text-rose-700 transition hover:bg-rose-50">
          Reject Missing
        </button>
      </div>
    )} />
    <div className="mt-5 grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
      {claimSteps.map((step, index) => (
        <button key={step} onClick={() => runAction("Claim workflow", step)} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-left hover:bg-white">
          <div className="text-xs font-black text-blue-700">Step {index + 1}</div>
          <div className="mt-1 text-sm font-bold text-slate-700">{step}</div>
        </button>
      ))}
    </div>
  </section>
);

export default ClaimsSection;

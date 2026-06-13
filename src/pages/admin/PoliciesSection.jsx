import { FileText, Plus } from "lucide-react";
import DataTable from "./DataTable";
import SectionTitle from "./SectionTitle";

const PoliciesSection = ({ planRows, createPlan, actionButtons }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <SectionTitle icon={FileText} title="Policy Management" action={<button onClick={createPlan} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white transition hover:bg-blue-700"><Plus size={16} />Create Plan</button>} />
    <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
      Admin-created active policies are saved to the shared catalog and become visible on public product pages.
    </div>
    <DataTable columns={["name", "company", "categorySlug", "coverage", "premiumYearly", "offer", "renewalDate", "state"]} rows={planRows} renderActions={(row) => actionButtons(row, "policies")} />
  </section>
);

export default PoliciesSection;

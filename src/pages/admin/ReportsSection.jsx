import { BarChart3, Download } from "lucide-react";
import SectionTitle from "./SectionTitle";

const ReportsSection = ({ openReportDetail, runAction }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <SectionTitle icon={BarChart3} title="Reports & Analytics" />
    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {["Claims Report", "Revenue Report", "User Growth Report", "Policy Sales Report", "Agent Performance Report"].map((report) => (
        <button key={report} onClick={() => openReportDetail(report)} className="rounded-lg border border-slate-200 p-4 text-left font-black transition hover:border-blue-200 hover:bg-blue-50">{report}</button>
      ))}
    </div>
    <div className="mt-5 flex flex-wrap gap-2">
      {["PDF", "Excel", "CSV"].map((format) => (
        <button key={format} onClick={() => runAction("Export ready", `${format} export generated.`)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-black hover:bg-slate-50"><Download size={15} />{format}</button>
      ))}
    </div>
  </section>
);

export default ReportsSection;

import { ArrowLeft, BarChart3, Download, LineChart } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { LineSpark } from "./MiniCharts";

const ReportDetailSection = ({ selectedReport, customerRows, planRows, claimRows, openPage, runAction }) => {
  const report = selectedReport || "Analytics Report";
  const reportStats = [
    { label: "Total Users", value: customerRows.length },
    { label: "Policies", value: planRows.length },
    { label: "Claims", value: claimRows.length },
    { label: "Payments", value: "INR 8.42 Cr" },
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <SectionTitle
        icon={BarChart3}
        title={report}
        action={
          <button onClick={() => openPage("reports")} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-50">
            <ArrowLeft size={16} />
            Back to Reports
          </button>
        }
      />
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reportStats.map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-black uppercase text-slate-500">{item.label}</div>
            <div className="mt-2 text-2xl font-black text-slate-950">{item.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5">
        <SectionTitle icon={LineChart} title={`${report} Trend`} />
        <div className="mt-5">
          <LineSpark values={[32, 48, 44, 61, 58, 73, 69, 82, 78, 88, 84, 96]} color="#2563eb" />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {["PDF", "Excel", "CSV"].map((format) => (
          <button key={format} onClick={() => runAction("Export ready", `${report} ${format} export generated.`)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-black hover:bg-slate-50"><Download size={15} />{format}</button>
        ))}
      </div>
    </section>
  );
};

export default ReportDetailSection;

import { Circle, Eraser, PenLine, Send, ShieldCheck, Undo2 } from "lucide-react";
import { statusClass } from "./helpers";
import SectionTitle from "./SectionTitle";

const DocumentsSection = ({
  documentRows,
  selectedDocument,
  setSelectedDocument,
  currentDocumentKey,
  currentDocumentMarks,
  draftMark,
  markupTool,
  setMarkupTool,
  startMarkup,
  continueMarkup,
  finishMarkup,
  undoDocumentMark,
  sendDocumentCorrection,
  runAction,
  startEditRecord,
  mutateRows,
}) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <SectionTitle icon={ShieldCheck} title="Document Verification" />
    <div className="mt-5 grid gap-5 2xl:grid-cols-[360px_1fr]">
      <div className="space-y-3">
        {documentRows.map((doc) => {
          const docKey = `${doc.type}-${doc.owner}`;
          return (
            <article key={docKey} className={`rounded-lg border p-4 ${currentDocumentKey === docKey ? "border-blue-300 bg-blue-50" : "border-slate-200"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-black">{doc.type}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-500">{doc.owner}</div>
                  {doc.note && <div className="mt-2 text-xs font-bold text-rose-700">{doc.note}</div>}
                </div>
                <span className={`rounded-lg px-2 py-1 text-xs font-black ring-1 ${statusClass(doc.status)}`}>{doc.status}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedDocument(doc);
                    runAction("Document opened", `${doc.type} for ${doc.owner} is ready for admin markup.`);
                  }}
                  className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-black transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  View
                </button>
                <button onClick={() => startEditRecord("documents", doc)} className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-black transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">Edit</button>
                <button onClick={() => mutateRows("documents", doc, "approve")} className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-black transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">Approve</button>
                <button onClick={() => mutateRows("documents", doc, "delete")} className="cursor-pointer rounded-lg border border-rose-200 px-3 py-2 text-xs font-black text-rose-700 transition hover:bg-rose-50">Reject</button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        {selectedDocument ? (
          <>
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-sm font-black text-slate-950">{selectedDocument.type} Review</div>
                <div className="mt-1 text-xs font-bold text-slate-500">{selectedDocument.owner}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "pen", label: "Pen", icon: PenLine },
                  { id: "circle", label: "Circle", icon: Circle },
                  { id: "eraser", label: "Eraser", icon: Eraser },
                ].map((tool) => {
                  const ToolIcon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setMarkupTool(tool.id)}
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black transition ${markupTool === tool.id ? "border-blue-300 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                      <ToolIcon size={14} />
                      {tool.label}
                    </button>
                  );
                })}
                <button onClick={undoDocumentMark} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50">
                  <Undo2 size={14} />
                  Undo
                </button>
                <button onClick={sendDocumentCorrection} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-black text-white hover:bg-emerald-700">
                  <Send size={14} />
                  Send Back
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="relative mx-auto aspect-[4/5] max-w-3xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="absolute inset-0 bg-white">
                  {selectedDocument.dataUrl ? (
                    selectedDocument.mimeType?.startsWith("image/") ? (
                      <img src={selectedDocument.dataUrl} alt={selectedDocument.type} className="h-full w-full object-contain" />
                    ) : (
                      <iframe title={selectedDocument.type} src={selectedDocument.dataUrl} className="h-full w-full border-0" />
                    )
                  ) : (
                    <div className="h-full p-8">
                      <div className="border-b border-slate-200 pb-4">
                        <div className="text-xs font-black uppercase tracking-wide text-blue-700">Submitted User Document</div>
                        <div className="mt-2 text-2xl font-black text-slate-950">{selectedDocument.type}</div>
                        <div className="mt-1 text-sm font-bold text-slate-500">Owner: {selectedDocument.owner}</div>
                      </div>
                      <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-600">
                        {["Identity fields verified against user profile.", "Policy or claim reference checked by admin.", "Missing or incorrect areas can be circled before sending back.", "User receives the correction request after Send Back."].map((line, index) => (
                          <div key={line} className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
                            <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-900 text-xs font-black text-white">{index + 1}</span>
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <svg
                  className="absolute inset-0 h-full w-full touch-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  onPointerDown={startMarkup}
                  onPointerMove={continueMarkup}
                  onPointerUp={finishMarkup}
                >
                  {[...currentDocumentMarks, ...(draftMark ? [draftMark] : [])].map((mark) => {
                    if (mark.tool === "circle") {
                      const [start, end = start] = mark.points;
                      const x = Math.min(start.x, end.x);
                      const y = Math.min(start.y, end.y);
                      const width = Math.max(Math.abs(end.x - start.x), 2);
                      const height = Math.max(Math.abs(end.y - start.y), 2);
                      return <ellipse key={mark.id} cx={x + width / 2} cy={y + height / 2} rx={width / 2} ry={height / 2} fill="none" stroke={mark.color} strokeWidth="1.2" />;
                    }
                    return <polyline key={mark.id} fill="none" stroke={mark.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" points={mark.points.map((point) => `${point.x},${point.y}`).join(" ")} />;
                  })}
                </svg>
              </div>
            </div>
          </>
        ) : (
          <div className="grid min-h-[420px] place-items-center rounded-lg border border-dashed border-slate-300 bg-white text-center">
            <div>
              <div className="text-sm font-black text-slate-800">Select a document</div>
              <div className="mt-1 text-xs font-semibold text-slate-500">Use View to open the markup workspace.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
);

export default DocumentsSection;

import { Send, X } from "lucide-react";

const EditPanel = ({ editingRecord, setEditingRecord, saveEditedRecord, sendEditedRecordToUser }) => {
  if (!editingRecord) return null;
  const fields = editingRecord.fields || Object.keys(editingRecord.draft);

  return (
    <section className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-black text-blue-950">Edit {editingRecord.kind}</div>
          <div className="mt-1 text-xs font-bold text-blue-700">Make changes, save locally, or send the edited details back to the user.</div>
        </div>
        <button onClick={() => setEditingRecord(null)} className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50">
          <X size={14} />
          Close
        </button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => (
          <label key={field} className="block">
            <span className="text-xs font-black uppercase tracking-wide text-blue-700">{field.replace(/([A-Z])/g, " $1")}</span>
            <input
              value={editingRecord.draft[field] ?? ""}
              onChange={(event) =>
                editingRecord.onChangeDraft?.(field, event.target.value)
              }
              className="mt-2 h-11 w-full rounded-lg border border-blue-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500"
            />
          </label>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={saveEditedRecord} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-black text-white hover:bg-blue-700">
          Save Changes
        </button>
        <button onClick={sendEditedRecordToUser} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-black text-white hover:bg-emerald-700">
          <Send size={15} />
          Send to User
        </button>
      </div>
    </section>
  );
};

export default EditPanel;

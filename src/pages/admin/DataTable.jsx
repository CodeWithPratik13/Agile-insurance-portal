import { statusClass } from "./helpers";

const DataTable = ({ columns, rows, renderActions }) => (
  <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
    <table className="w-full min-w-[760px] text-left text-sm">
      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
        <tr>
          {columns.map((head) => (
            <th key={head} className="px-3 py-3 font-black">{head}</th>
          ))}
          {renderActions && <th className="px-3 py-3 font-black">Actions</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {rows.map((row) => (
          <tr key={row.id || row.name || row.user || row.type}>
            {columns.map((column) => {
              const key = column.toLowerCase().replaceAll(" ", "");
              const value = row[key] ?? row[column.toLowerCase()] ?? row[column] ?? row.state ?? "";
              return (
                <td key={column} className="px-3 py-4 font-semibold text-slate-700">
                  {String(value).match(/active|pending|approved|review|open|inactive|draft|verification|re-upload/i) ? (
                    <span className={`rounded-lg px-2 py-1 text-xs font-black ring-1 ${statusClass(value)}`}>{value}</span>
                  ) : (
                    value
                  )}
                </td>
              );
            })}
            {renderActions && <td className="px-3 py-4">{renderActions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;

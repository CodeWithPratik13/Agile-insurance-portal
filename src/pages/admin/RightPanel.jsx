const RightPanel = ({
  selectedProfile,
  detail,
  documentRows,
  claimRows,
  supportChats,
  requirementRows,
  openPage,
}) => (
  <aside className="hidden min-h-0 overflow-y-auto border-l border-slate-200 bg-white p-5 xl:block">
    <div className="sticky top-0 bg-white pb-4">
      <div className="text-sm font-black text-slate-950">Right Panel</div>
      <div className="mt-1 text-xs font-semibold text-slate-500">Independent scroll area</div>
    </div>

    <div className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          {selectedProfile.profilePhoto ? (
            <img src={selectedProfile.profilePhoto} alt={selectedProfile.name} className="h-11 w-11 rounded-lg object-cover" />
          ) : (
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-600 text-sm font-black text-white">{selectedProfile.initials}</span>
          )}
          <div className="min-w-0">
            <div className="truncate text-sm font-black">{selectedProfile.name}</div>
            <div className="truncate text-xs font-semibold text-slate-500">{selectedProfile.role}</div>
          </div>
        </div>
        <div className="mt-3 text-xs font-semibold leading-5 text-slate-600">{selectedProfile.access}</div>
      </div>

      <div className="rounded-lg border border-slate-200 p-4">
        <div className="text-sm font-black text-slate-950">{detail.title}</div>
        {detail.photo && <img src={detail.photo} alt={detail.title} className="mt-3 h-24 w-24 rounded-lg object-cover" />}
        <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-950 p-3 text-xs font-semibold leading-5 text-slate-100">{detail.body}</pre>
      </div>

      <div className="rounded-lg border border-slate-200 p-4">
        <div className="text-sm font-black text-slate-950">Operations Queue</div>
        <div className="mt-3 space-y-2 text-sm font-bold text-slate-700">
          <button onClick={() => openPage("documents")} className="flex w-full justify-between rounded-lg bg-slate-50 px-3 py-3 text-left hover:bg-slate-100"><span>Pending verifications</span><span>{documentRows.filter((doc) => doc.status === "Pending").length}</span></button>
          <button onClick={() => openPage("claims")} className="flex w-full justify-between rounded-lg bg-slate-50 px-3 py-3 text-left hover:bg-slate-100"><span>Claims in review</span><span>{claimRows.filter((claim) => claim.status === "Under Review").length}</span></button>
          <button onClick={() => openPage("support")} className="flex w-full justify-between rounded-lg bg-slate-50 px-3 py-3 text-left hover:bg-slate-100"><span>Open support chats</span><span>{supportChats.filter((chat) => chat.status !== "Resolved").length}</span></button>
          <button onClick={() => openPage("requirements")} className="flex w-full justify-between rounded-lg bg-slate-50 px-3 py-3 text-left hover:bg-slate-100"><span>Quotes requested</span><span>{requirementRows.length}</span></button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 p-4">
        <div className="text-sm font-black text-slate-950">Quick Actions</div>
        <div className="mt-3 grid gap-2">
          {[
            ["Create plan", "policies"],
            ["Send reminder", "notifications"],
            ["Export claims", "reports"],
            ["Open audit logs", "settings"],
          ].map(([label, page]) => (
            <button key={label} onClick={() => openPage(page)} className="rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-black hover:bg-slate-50">{label}</button>
          ))}
        </div>
      </div>
    </div>
  </aside>
);

export default RightPanel;

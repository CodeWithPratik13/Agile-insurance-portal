const SectionTitle = ({ icon: Icon, title, action }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700">
        <Icon size={18} />
      </span>
      <h2 className="truncate text-base font-black text-slate-950">{title}</h2>
    </div>
    {action}
  </div>
);

export default SectionTitle;

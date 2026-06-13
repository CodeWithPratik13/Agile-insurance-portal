const ActionButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
    title={label}
    aria-label={label}
  >
    <Icon size={16} />
  </button>
);

export default ActionButton;

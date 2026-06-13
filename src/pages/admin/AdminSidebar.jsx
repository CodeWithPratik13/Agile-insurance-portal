import { LogOut, Menu, ShieldCheck } from "lucide-react";

const AdminSidebar = ({
  mobile = false,
  collapsed = false,
  allowedNav,
  activePage,
  selectedProfile,
  openPage,
  onLogout,
  onToggleCollapsed,
}) => (
  <aside className={`${mobile ? "flex" : "hidden lg:flex"} h-full ${collapsed && !mobile ? "w-[92px]" : "w-[292px]"} shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-300`}>
    <div className={`flex items-center gap-3 border-b border-slate-200 px-4 py-5 ${collapsed && !mobile ? "justify-center" : ""}`}>
      {(!collapsed || mobile) && (
        <>
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-600 text-white">
            <ShieldCheck size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-base font-black text-slate-950">Agile Admin</div>
            <div className="truncate text-xs font-semibold text-slate-500">{selectedProfile.role}</div>
          </div>
        </>
      )}
      <button
        onClick={onToggleCollapsed}
        className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <Menu size={20} />
      </button>
    </div>

    <nav className="scrollbar-none min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {allowedNav.map((item) => {
        const Icon = item.icon;
        const active = activePage === item.id;
        return (
          <div key={item.id}>
            <button
              onClick={() => openPage(item.id)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-sm ${collapsed && !mobile ? "justify-center" : ""} ${active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"}`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon size={18} className={active ? "text-white" : "text-blue-700"} />
              {(!collapsed || mobile) && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
            </button>
          </div>
        );
      })}
    </nav>

    <div className="border-t border-slate-200 p-4">
      {(!collapsed || mobile) && <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
        {selectedProfile.profilePhoto ? (
          <img src={selectedProfile.profilePhoto} alt={selectedProfile.name} className="h-10 w-10 rounded-lg object-cover" />
        ) : (
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-xs font-black text-white">{selectedProfile.initials}</span>
        )}
        <div className="min-w-0">
          <div className="truncate text-sm font-black text-slate-950">{selectedProfile.name}</div>
          <div className="truncate text-xs font-semibold text-slate-500">{selectedProfile.email}</div>
        </div>
      </div>}
      <button
        onClick={onLogout}
        className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 ${collapsed && !mobile ? "justify-center" : ""}`}
        title="Logout"
      >
        <LogOut size={18} />
        {(!collapsed || mobile) && "Logout"}
      </button>
    </div>
  </aside>
);

export default AdminSidebar;

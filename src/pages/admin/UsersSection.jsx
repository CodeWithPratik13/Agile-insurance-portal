import { Users } from "lucide-react";
import DataTable from "./DataTable";
import SectionTitle from "./SectionTitle";

const UsersSection = ({ activeUsers, refreshRealUsers, createCustomer, actionButtons, customerRows }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <SectionTitle
      icon={Users}
      title="User Management"
      action={
        <div className="flex flex-wrap gap-2">
          <button onClick={refreshRealUsers} className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">Refresh Real Users</button>
          <button onClick={createCustomer} className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white transition hover:bg-blue-700">Create User</button>
        </div>
      }
    />
    <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
      Showing real app profiles from registration/login storage. Active users: {activeUsers}.
    </div>
    <DataTable columns={["id", "name", "email", "phone", "address", "policies", "status", "city"]} rows={customerRows} renderActions={(row) => actionButtons(row, "users")} />
  </section>
);

export default UsersSection;

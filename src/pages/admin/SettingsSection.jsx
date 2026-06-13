import { Search, Settings } from "lucide-react";
import { adminSettingCards } from "./constants";
import SectionTitle from "./SectionTitle";

const SettingsSection = ({ openSettingDetail }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <SectionTitle icon={Settings} title="System Settings" />
    <div className="mt-5">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold outline-none focus:border-blue-500" placeholder="Search settings..." />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {adminSettingCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => openSettingDetail(card.id)}
              className="group flex min-h-24 items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-blue-600 text-white transition group-hover:bg-blue-700">
                <Icon size={25} />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-black text-slate-900">{card.title}</span>
                <span className="mt-1 block text-sm font-semibold leading-5 text-slate-500">{card.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  </section>
);

export default SettingsSection;

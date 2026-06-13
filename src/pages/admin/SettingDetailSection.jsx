import { ArrowLeft } from "lucide-react";
import { adminSettingCards, settingFieldGroups } from "./constants";
import { renderSettingField } from "./SettingFieldRenderer";
import SectionTitle from "./SectionTitle";

const SettingDetailSection = ({ selectedSettingId, getSettingValue, updateSettingModule, updateStructuredSetting, updateSettingFile, openPage }) => {
  const card = adminSettingCards.find((item) => item.id === selectedSettingId) || adminSettingCards[0];
  const Icon = card.icon;
  const fields = settingFieldGroups[card.id] || [];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <SectionTitle
        icon={Icon}
        title={card.title}
        action={
          <button onClick={() => openPage("settings")} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-50">
            <ArrowLeft size={16} />
            Back to Settings
          </button>
        }
      />
      <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm font-bold leading-6 text-blue-800">
        {card.description} Changes save instantly and are stored for this admin portal.
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {fields.map((field) => renderSettingField({
          settingId: card.id,
          field,
          getSettingValue,
          updateSettingModule,
          updateStructuredSetting,
          updateSettingFile,
        }))}
      </div>
    </section>
  );
};

export default SettingDetailSection;

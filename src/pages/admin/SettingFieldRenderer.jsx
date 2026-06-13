import { Mail, Plus } from "lucide-react";

export const renderSettingField = ({ settingId, field, getSettingValue, updateSettingModule, updateStructuredSetting, updateSettingFile }) => {
  const value = getSettingValue(settingId, field);

  if (field.type === "boolean") {
    return (
      <label key={field.name} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
        <span>
          <span className="block text-sm font-black text-slate-800">{field.label}</span>
          <span className="mt-1 block text-xs font-semibold text-slate-500">{value ? "Enabled" : "Disabled"}</span>
        </span>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => updateSettingModule(settingId, field, event.target.checked)}
          className="h-5 w-5 cursor-pointer rounded border-slate-300"
        />
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label key={field.name} className="block rounded-lg border border-slate-200 bg-white p-4">
        <span className="text-xs font-black uppercase tracking-wide text-slate-500">{field.label}</span>
        <textarea
          value={value}
          onChange={(event) => updateSettingModule(settingId, field, event.target.value)}
          className="mt-2 min-h-32 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold outline-none focus:border-blue-500"
        />
      </label>
    );
  }

  if (field.type === "templateList") {
    const templates = Array.isArray(value) ? value : field.defaultValue;
    return (
      <div key={field.name} className="rounded-lg border border-slate-200 bg-white p-4 xl:col-span-2">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-black text-slate-950">{field.label}</div>
            <div className="text-xs font-semibold text-slate-500">Policy, claim, payment, and renewal messages are editable here.</div>
          </div>
          <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">{templates.length} templates</span>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {templates.map((template, index) => (
            <article key={template.key} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-black text-slate-900">{template.name}</div>
                  <div className="mt-1 text-xs font-bold text-slate-500">{template.channel}</div>
                </div>
                <Mail size={18} className="text-blue-600" />
              </div>
              <label className="mt-4 block">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">Subject</span>
                <input
                  value={template.subject}
                  onChange={(event) =>
                    updateStructuredSetting("notifications", field, (items) =>
                      items.map((item, itemIndex) => (itemIndex === index ? { ...item, subject: event.target.value } : item)),
                    )
                  }
                  className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-blue-500"
                />
              </label>
              <label className="mt-3 block">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">Body</span>
                <textarea
                  value={template.body}
                  onChange={(event) =>
                    updateStructuredSetting("notifications", field, (items) =>
                      items.map((item, itemIndex) => (itemIndex === index ? { ...item, body: event.target.value } : item)),
                    )
                  }
                  className="mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-blue-500"
                />
              </label>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === "gatewayList") {
    const gateways = Array.isArray(value) ? value : field.defaultValue;
    return (
      <div key={field.name} className="rounded-lg border border-slate-200 bg-white p-4 xl:col-span-2">
        <div className="text-sm font-black text-slate-950">{field.label}</div>
        <div className="mt-1 text-xs font-semibold text-slate-500">Enabled gateways appear automatically on checkout.</div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {gateways.map((gateway, index) => (
            <article key={gateway.key} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-black text-slate-900">{gateway.name}</div>
                  <div className="mt-1 text-xs font-bold text-slate-500">{gateway.settlement}</div>
                </div>
                <label className="inline-flex items-center gap-2 text-xs font-black text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(gateway.enabled)}
                    onChange={(event) =>
                      updateStructuredSetting("payment", field, (items) =>
                        items.map((item, itemIndex) => (itemIndex === index ? { ...item, enabled: event.target.checked } : item)),
                      )
                    }
                    className="h-5 w-5 rounded border-slate-300"
                  />
                  {gateway.enabled ? "Enabled" : "Disabled"}
                </label>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">Mode</span>
                  <select
                    value={gateway.mode}
                    onChange={(event) =>
                      updateStructuredSetting("payment", field, (items) =>
                        items.map((item, itemIndex) => (itemIndex === index ? { ...item, mode: event.target.value } : item)),
                      )
                    }
                    className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-blue-500"
                  >
                    {["Test", "Live", "Sandbox", "Manual"].map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">Merchant ID</span>
                  <input
                    value={gateway.merchantId}
                    onChange={(event) =>
                      updateStructuredSetting("payment", field, (items) =>
                        items.map((item, itemIndex) => (itemIndex === index ? { ...item, merchantId: event.target.value } : item)),
                      )
                    }
                    className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-blue-500"
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === "policyFormBuilder") {
    const forms = value && typeof value === "object" ? value : field.defaultValue;
    return (
      <div key={field.name} className="rounded-lg border border-slate-200 bg-white p-4 xl:col-span-2">
        <div className="text-sm font-black text-slate-950">{field.label}</div>
        <div className="mt-1 text-xs font-semibold text-slate-500">Health and Vehicle fields can be renamed, typed, required, and extended.</div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {Object.entries(forms).map(([formKey, fields]) => (
            <article key={formKey} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-black capitalize text-slate-900">{formKey} Policy</div>
                <button
                  type="button"
                  onClick={() =>
                    updateStructuredSetting("forms", field, (currentForms) => ({
                      ...currentForms,
                      [formKey]: [
                        ...(currentForms[formKey] || []),
                        { key: `customField${Date.now()}`, label: "New Field", type: "text", required: false },
                      ],
                    }))
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-black text-white hover:bg-blue-700"
                >
                  <Plus size={14} />
                  Add Field
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {fields.map((formField, index) => (
                  <div key={formField.key} className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="grid gap-3 sm:grid-cols-[1fr_120px_auto]">
                      <input
                        value={formField.label}
                        onChange={(event) =>
                          updateStructuredSetting("forms", field, (currentForms) => ({
                            ...currentForms,
                            [formKey]: currentForms[formKey].map((item, itemIndex) => (itemIndex === index ? { ...item, label: event.target.value } : item)),
                          }))
                        }
                        className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-bold outline-none focus:border-blue-500"
                      />
                      <select
                        value={formField.type}
                        onChange={(event) =>
                          updateStructuredSetting("forms", field, (currentForms) => ({
                            ...currentForms,
                            [formKey]: currentForms[formKey].map((item, itemIndex) => (itemIndex === index ? { ...item, type: event.target.value } : item)),
                          }))
                        }
                        className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-bold outline-none focus:border-blue-500"
                      >
                        {["text", "number", "select", "date", "textarea"].map((option) => <option key={option}>{option}</option>)}
                      </select>
                      <label className="inline-flex h-10 items-center gap-2 text-xs font-black text-slate-700">
                        <input
                          type="checkbox"
                          checked={Boolean(formField.required)}
                          onChange={(event) =>
                            updateStructuredSetting("forms", field, (currentForms) => ({
                              ...currentForms,
                              [formKey]: currentForms[formKey].map((item, itemIndex) => (itemIndex === index ? { ...item, required: event.target.checked } : item)),
                            }))
                          }
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        Required
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === "featureMatrix") {
    const featureGroups = value && typeof value === "object" ? value : field.defaultValue;
    return (
      <div key={field.name} className="rounded-lg border border-slate-200 bg-white p-4 xl:col-span-2">
        <div className="text-sm font-black text-slate-950">{field.label}</div>
        <div className="mt-1 text-xs font-semibold text-slate-500">Add-ons are stored by insurance line and ready for plan mapping.</div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {Object.entries(featureGroups).map(([groupKey, features]) => (
            <article key={groupKey} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-black capitalize text-slate-900">{groupKey} Insurance</div>
              <textarea
                value={features.join("\n")}
                onChange={(event) =>
                  updateStructuredSetting("features", field, (groups) => ({
                    ...groups,
                    [groupKey]: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean),
                  }))
                }
                className="mt-3 min-h-36 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-blue-500"
              />
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <label key={field.name} className="block rounded-lg border border-slate-200 bg-white p-4">
        <span className="text-xs font-black uppercase tracking-wide text-slate-500">{field.label}</span>
        <select
          value={value}
          onChange={(event) => updateSettingModule(settingId, field, event.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-blue-500"
        >
          {field.options.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
    );
  }

  if (field.type === "file") {
    return (
      <div key={field.name} className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="text-xs font-black uppercase tracking-wide text-slate-500">{field.label}</div>
        {value ? (
          <img src={value} alt={field.label} className="mt-3 h-20 w-20 rounded-lg border border-slate-200 object-contain" />
        ) : (
          <div className="mt-3 grid h-20 w-20 place-items-center rounded-lg border border-dashed border-slate-300 text-xs font-bold text-slate-400">No file</div>
        )}
        <label className="mt-3 inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-black text-white hover:bg-blue-700">
          Upload
          <input type="file" accept={field.accept} className="hidden" onChange={(event) => updateSettingFile(settingId, field, event.target.files?.[0])} />
        </label>
      </div>
    );
  }

  return (
    <label key={field.name} className="block rounded-lg border border-slate-200 bg-white p-4">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">{field.label}</span>
      <input
        type={field.type}
        value={value}
        onChange={(event) => updateSettingModule(settingId, field, field.type === "number" ? Number(event.target.value) : event.target.value)}
        className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-blue-500"
      />
    </label>
  );
};

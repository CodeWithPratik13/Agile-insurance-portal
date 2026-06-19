import { useMemo, useState, useRef } from "react";
import ReactDOM from "react-dom";
import {
  BarChart3, Bell, CheckCircle2, ClipboardCheck, Edit3, Eye, FileText, ListChecks, Menu,
  MoreVertical, Plus, Search, Settings2, ShieldAlert, Trash2, X,
} from "lucide-react";
import { notifyClaimDecision } from "../utils/notifications";
import { randomDigits } from "../utils/ids";
import { readSystemSettings, saveSystemSettings } from "../utils/systemSettings";
import { adminSettingCards, navItems, pageTitles, requirements, tickets, users, documents } from "./admin/constants";
import {
  fileToDataUrl,
  formatStructuredDetail,
  loadAdmins,
  loadAuditLogs,
  makeUiId,
  persistPolicyRows,
  readAdminClaims,
  readAdminPolicyRows,
  readRealUsers,
  readSupportChats,
  readUploadedDocuments,
  rowKeyFor,
  saveAdmins,
  saveAuditLogs,
} from "./admin/helpers";
import AdminLogin from "./admin/AdminLogin";
import AdminPageContent from "./admin/AdminPageContent";
import AdminSidebar from "./admin/AdminSidebar";
import ActionButton from "./admin/ActionButton";
import EditPanel from "./admin/EditPanel";

/* ════════════════════════════════════════════════════════════════════════
   POLICY MANAGEMENT — data, sub-components, and full page (inlined)
   ════════════════════════════════════════════════════════════════════════ */

const SectionTitle = ({ icon: Icon, title, action }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-center gap-2">
      {Icon && (
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
          <Icon size={18} />
        </span>
      )}
      <h2 className="text-lg font-black text-slate-950">{title}</h2>
    </div>
    {action}
  </div>
);

const INITIAL_POLICY_LIST = [
  { id: 1, policyNo: "POL-HLT-001", policyName: "Family Health Gold", category: "Health", type: "Individual", coverage: 500000, premium: 12000, status: "Active", createdDate: "01-Jun-2026", description: "A comprehensive health insurance policy for individuals and families.", minAge: 18, maxAge: 65, currency: "INR - Indian Rupee", code: "POL-HLT-001", salesCount: 320, regulations: "IRDAI Regulation 2016, Health Insurance Guidelines", features: ["Cashless Hospitalization", "Pre & Post Hospitalization", "Day Care Procedures", "Ambulance Cover"], premiumBreakdown: { base: 10000, tax: 1800, discount: 200 } },
  { id: 2, policyNo: "POL-MOT-002", policyName: "Vehicle Premium Policy", category: "Motor", type: "Individual", coverage: 300000, premium: 8500, status: "Active", createdDate: "03-Jun-2026", description: "Comprehensive motor insurance for personal vehicles.", minAge: 18, maxAge: 70, currency: "INR - Indian Rupee", code: "POL-MOT-002", salesCount: 210, regulations: "Motor Vehicle Act 1988, IRDAI Motor Guidelines", features: ["Third-Party Liability", "Own Damage", "Zero Depreciation", "Roadside Assistance"], premiumBreakdown: { base: 7200, tax: 1296, discount: 0 } },
  { id: 3, policyNo: "POL-LFE-003", policyName: "Life Secure Plus", category: "Life", type: "Individual", coverage: 1000000, premium: 15000, status: "Draft", createdDate: "05-Jun-2026", description: "Term life insurance with critical illness rider.", minAge: 21, maxAge: 55, currency: "INR - Indian Rupee", code: "POL-LFE-003", salesCount: 85, regulations: "Life Insurance Act 1956, IRDAI Life Guidelines", features: ["Death Benefit", "Critical Illness Cover", "Accidental Disability", "Premium Waiver"], premiumBreakdown: { base: 12500, tax: 2250, discount: 500 } },
  { id: 4, policyNo: "POL-HLT-004", policyName: "Senior Health Care", category: "Health", type: "Individual", coverage: 750000, premium: 18000, status: "Inactive", createdDate: "07-Jun-2026", description: "Specialized health coverage for senior citizens.", minAge: 60, maxAge: 80, currency: "INR - Indian Rupee", code: "POL-HLT-004", salesCount: 145, regulations: "IRDAI Senior Citizen Health Guidelines 2020", features: ["In-patient Hospitalization", "Pre-existing Conditions", "Domiciliary Treatment", "AYUSH Coverage"], premiumBreakdown: { base: 15000, tax: 2700, discount: 300 } },
  { id: 5, policyNo: "POL-MOT-005", policyName: "Commercial Vehicle Policy", category: "Motor", type: "Commercial", coverage: 1500000, premium: 22000, status: "Active", createdDate: "08-Jun-2026", description: "Insurance for commercial transport and fleet vehicles.", minAge: 18, maxAge: 65, currency: "INR - Indian Rupee", code: "POL-MOT-005", salesCount: 485, regulations: "Motor Vehicle Act 1988, Commercial Vehicle Guidelines", features: ["Third-Party Liability", "Cargo Cover", "Driver PA Cover", "Fleet Discount"], premiumBreakdown: { base: 18500, tax: 3330, discount: 170 } },
];

const PM_CAT_BG = { Health: "#dcfce7", Motor: "#dbeafe", Life: "#f3e8ff", Travel: "#fef9c3", Home: "#ffe4e6" };
const PM_CAT_TEXT = { Health: "#16a34a", Motor: "#1d4ed8", Life: "#7c3aed", Travel: "#a16207", Home: "#be123c" };
const PM_STATUS = { Active: { bg: "#dcfce7", text: "#15803d", dot: "#16a34a" }, Draft: { bg: "#fef9c3", text: "#92400e", dot: "#d97706" }, Inactive: { bg: "#fee2e2", text: "#b91c1c", dot: "#ef4444" } };
const PM_ALL_FEATURES = ["Cashless Hospitalization", "Pre & Post Hospitalization", "Day Care Procedures", "Ambulance Cover", "Third-Party Liability", "Own Damage", "Zero Depreciation", "Roadside Assistance", "Death Benefit", "Critical Illness Cover", "Accidental Disability", "Premium Waiver", "Cargo Cover", "Driver PA Cover", "AYUSH Coverage", "Domiciliary Treatment", "No Claim Bonus", "Maternity Cover", "Mental Health Cover", "International Coverage"];
const pmFmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

const PMModal = ({ title, onClose, children, wide }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
    <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: wide ? 820 : 560, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px", borderBottom: "1px solid #e5e7eb" }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>{title}</h2>
        <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 20, color: "#6b7280", lineHeight: 1, padding: "0 4px" }}>✕</button>
      </div>
      <div style={{ overflowY: "auto", flex: 1, padding: "18px 22px" }}>{children}</div>
    </div>
  </div>
);

const PMInput = ({ label, value, onChange, type = "text", readOnly, as, rows = 3 }) => {
  const s = { width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", background: readOnly ? "#f9fafb" : "#fff", color: "#111827", fontFamily: "inherit" };
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 3 }}>{label}</label>
      {as === "textarea" ? <textarea value={value} onChange={onChange} readOnly={readOnly} rows={rows} style={{ ...s, resize: "vertical" }} /> : <input type={type} value={value} onChange={onChange} readOnly={readOnly} style={s} />}
    </div>
  );
};

const PMSecTitle = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 800, color: "#4f46e5", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 2 }}>{children}</div>
);

const PMViewModal = ({ policy, onClose }) => (
  <PMModal title="Policy Details" onClose={onClose} wide>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {[["Policy No", policy.policyNo], ["Policy Name", policy.policyName], ["Category", policy.category], ["Type", policy.type], ["Status", policy.status], ["Currency", policy.currency], ["Coverage", pmFmt(policy.coverage)], ["Premium", pmFmt(policy.premium)], ["Min Age", policy.minAge], ["Max Age", policy.maxAge], ["Created", policy.createdDate]].map(([l, v]) => (
        <div key={l} style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>{l}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{v}</div>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 12, background: "#eef2ff", borderRadius: 8, padding: "10px 12px" }}>
      <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>Description</div>
      <div style={{ fontSize: 13, color: "#374151" }}>{policy.description}</div>
    </div>
    <div style={{ marginTop: 12 }}>
      <PMSecTitle>Features</PMSecTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {policy.features.map(f => <span key={f} style={{ background: "#ede9fe", color: "#5b21b6", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>✓ {f}</span>)}
      </div>
    </div>
    <div style={{ textAlign: "right", marginTop: 16 }}>
      <button onClick={onClose} style={{ padding: "8px 20px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Close</button>
    </div>
  </PMModal>
);

const PMEditModal = ({ policy, onClose, onSave }) => {
  const [form, setForm] = useState({ ...policy });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <PMModal title={`Edit — ${policy.policyNo}`} onClose={onClose} wide>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
        <PMInput label="Policy Name *" value={form.policyName} onChange={set("policyName")} />
        <PMInput label="Policy Code *" value={form.code} onChange={set("code")} />
        <PMInput label="Category *" value={form.category} onChange={set("category")} />
        <PMInput label="Type *" value={form.type} onChange={set("type")} />
        <PMInput label="Min Age" value={form.minAge} onChange={set("minAge")} type="number" />
        <PMInput label="Max Age" value={form.maxAge} onChange={set("maxAge")} type="number" />
        <PMInput label="Coverage (₹) *" value={form.coverage} onChange={set("coverage")} type="number" />
        <PMInput label="Premium (₹) *" value={form.premium} onChange={set("premium")} type="number" />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 3 }}>Status *</label>
        <select value={form.status} onChange={set("status")} style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 }}>
          {["Active", "Draft", "Inactive"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <PMInput label="Short Description" value={form.description} onChange={set("description")} as="textarea" />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
        <button onClick={onClose} style={{ padding: "8px 18px", border: "1px solid #d1d5db", background: "#fff", borderRadius: 8, fontWeight: 700, cursor: "pointer", color: "#374151", fontSize: 13 }}>Cancel</button>
        <button onClick={() => { onSave(form); onClose(); }} style={{ padding: "8px 18px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Save Changes</button>
      </div>
    </PMModal>
  );
};

const PMCloneModal = ({ policy, onClose, onClone, nextId }) => {
  const newCode = `POL-${policy.category.substring(0, 3).toUpperCase()}-${String(nextId).padStart(3, "0")}`;
  const [name, setName] = useState(`${policy.policyName} (Copy)`);
  const [code, setCode] = useState(newCode);
  return (
    <PMModal title="Clone Policy" onClose={onClose}>
      <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: "#0369a1", fontWeight: 500 }}>Cloning <strong>{policy.policyName}</strong> — all settings will be copied.</div>
      </div>
      <PMInput label="New Policy Name *" value={name} onChange={e => setName(e.target.value)} />
      <PMInput label="New Policy Code *" value={code} onChange={e => setCode(e.target.value)} />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={onClose} style={{ padding: "8px 18px", border: "1px solid #d1d5db", background: "#fff", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Cancel</button>
        <button onClick={() => { onClone({ ...policy, id: nextId, policyNo: code, policyName: name, code, status: "Draft", createdDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-"), salesCount: 0 }); onClose(); }} style={{ padding: "8px 18px", background: "#059669", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Clone Policy</button>
      </div>
    </PMModal>
  );
};

const PMPremiumModal = ({ policy, onClose, onSave }) => {
  const [pb, setPb] = useState({ ...policy.premiumBreakdown });
  const total = Number(pb.base) + Number(pb.tax) - Number(pb.discount);
  return (
    <PMModal title={`Configure Premium — ${policy.policyName}`} onClose={onClose}>
      <PMSecTitle>Premium Breakdown</PMSecTitle>
      <PMInput label="Base Premium (₹)" value={pb.base} onChange={e => setPb(p => ({ ...p, base: e.target.value }))} type="number" />
      <PMInput label="Tax / GST (₹)" value={pb.tax} onChange={e => setPb(p => ({ ...p, tax: e.target.value }))} type="number" />
      <PMInput label="Discount (₹)" value={pb.discount} onChange={e => setPb(p => ({ ...p, discount: e.target.value }))} type="number" />
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 14px", marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 800, color: "#15803d", fontSize: 13 }}>Final Premium</span>
        <span style={{ fontWeight: 800, color: "#15803d", fontSize: 20 }}>{pmFmt(total)}</span>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
        <button onClick={onClose} style={{ padding: "8px 18px", border: "1px solid #d1d5db", background: "#fff", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Cancel</button>
        <button onClick={() => { onSave({ premiumBreakdown: pb, premium: total }); onClose(); }} style={{ padding: "8px 18px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Save Premium</button>
      </div>
    </PMModal>
  );
};

const PMFeaturesModal = ({ policy, onClose, onSave }) => {
  // Pre-seed selected from policy.features
  const [selected, setSelected] = useState(new Set(policy.features));
  // Custom features = policy features that are NOT in the master list,
  // so previously saved customs are restored when re-opening the modal.
  const [customFeatures, setCustomFeatures] = useState(
    policy.features.filter(f => !PM_ALL_FEATURES.includes(f))
  );
  const [customInput, setCustomInput] = useState("");
  const [duplicateError, setDuplicateError] = useState("");

  const toggle = f => setSelected(s => {
    const ns = new Set(s);
    ns.has(f) ? ns.delete(f) : ns.add(f);
    return ns;
  });

  const addCustom = () => {
    const val = customInput.trim();
    if (!val) return;
    // Duplicate check across both master list and already-added customs
    const allKnown = [...PM_ALL_FEATURES, ...customFeatures].map(x => x.toLowerCase());
    if (allKnown.includes(val.toLowerCase())) {
      setDuplicateError(`"${val}" already exists.`);
      return;
    }
    setDuplicateError("");
    setCustomFeatures(prev => [...prev, val]);
    // Auto-select the newly added feature
    setSelected(s => new Set([...s, val]));
    setCustomInput("");
  };

  const removeCustom = (f) => {
    setCustomFeatures(prev => prev.filter(x => x !== f));
    setSelected(s => { const ns = new Set(s); ns.delete(f); return ns; });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addCustom(); }
  };

  // All features to save = selected standard + all custom (whether checked or not
  // custom ones are always included since user explicitly added them; unchecking
  // a custom = remove it via the ✕ button instead)
  const handleSave = () => {
    onSave({ features: [...selected] });
    onClose();
  };

  return (
    <PMModal title={`Configure Features — ${policy.policyName}`} onClose={onClose} wide>
      <PMSecTitle>Select Policy Features</PMSecTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
        {PM_ALL_FEATURES.map(f => (
          <label key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", border: `1px solid ${selected.has(f) ? "#6366f1" : "#e5e7eb"}`, borderRadius: 8, cursor: "pointer", background: selected.has(f) ? "#eef2ff" : "#fff", fontSize: 12 }}>
            <input type="checkbox" checked={selected.has(f)} onChange={() => toggle(f)} style={{ accentColor: "#4f46e5" }} />
            {f}
          </label>
        ))}
      </div>

      {/* Custom features appear here as checkboxes with a remove (✕) button */}
      {customFeatures.length > 0 && (
        <>
          <PMSecTitle>Custom Features</PMSecTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
            {customFeatures.map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", border: `1px solid ${selected.has(f) ? "#6366f1" : "#e5e7eb"}`, borderRadius: 8, background: selected.has(f) ? "#eef2ff" : "#fff", fontSize: 12 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, cursor: "pointer" }}>
                  <input type="checkbox" checked={selected.has(f)} onChange={() => toggle(f)} style={{ accentColor: "#4f46e5" }} />
                  {f}
                </label>
                <button
                  onClick={() => removeCustom(f)}
                  title="Remove this feature"
                  style={{ border: "none", background: "none", cursor: "pointer", color: "#ef4444", fontSize: 14, lineHeight: 1, padding: "0 2px", flexShrink: 0 }}
                >✕</button>
              </div>
            ))}
          </div>
        </>
      )}

      <PMSecTitle>Add Custom Feature</PMSecTitle>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          value={customInput}
          onChange={e => { setCustomInput(e.target.value); setDuplicateError(""); }}
          onKeyDown={handleKeyDown}
          placeholder="Type a feature name and press Add or Enter…"
          style={{ flex: 1, padding: "8px 10px", border: `1px solid ${duplicateError ? "#ef4444" : "#d1d5db"}`, borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none" }}
        />
        <button
          onClick={addCustom}
          style={{ padding: "8px 16px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }}
        >
          + Add
        </button>
      </div>
      {duplicateError && (
        <div style={{ marginTop: 5, fontSize: 12, color: "#ef4444", fontWeight: 600 }}>{duplicateError}</div>
      )}

      {/* Live preview of all selected features */}
      {selected.size > 0 && (
        <div style={{ marginTop: 14, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#15803d", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
            Selected ({selected.size})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {[...selected].map(f => (
              <span key={f} style={{ background: "#dcfce7", color: "#15803d", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>✓ {f}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
        <button onClick={onClose} style={{ padding: "8px 18px", border: "1px solid #d1d5db", background: "#fff", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Cancel</button>
        <button onClick={handleSave} style={{ padding: "8px 18px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Save Features</button>
      </div>
    </PMModal>
  );
};

const PMRegulationsModal = ({ policy, onClose, onSave }) => {
  const [regs, setRegs] = useState(policy.regulations);
  const [minAge, setMinAge] = useState(policy.minAge);
  const [maxAge, setMaxAge] = useState(policy.maxAge);
  return (
    <PMModal title={`Configure Regulations — ${policy.policyName}`} onClose={onClose}>
      <PMSecTitle>Regulatory Information</PMSecTitle>
      <PMInput label="Applicable Regulations / Acts" value={regs} onChange={e => setRegs(e.target.value)} as="textarea" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <PMInput label="Min Eligible Age" value={minAge} onChange={e => setMinAge(e.target.value)} type="number" />
        <PMInput label="Max Eligible Age" value={maxAge} onChange={e => setMaxAge(e.target.value)} type="number" />
      </div>
      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#92400e", fontWeight: 500 }}>
        ⚠️ Changes apply to new policies only. Existing policies are not affected.
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
        <button onClick={onClose} style={{ padding: "8px 18px", border: "1px solid #d1d5db", background: "#fff", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Cancel</button>
        <button onClick={() => { onSave({ regulations: regs, minAge: Number(minAge), maxAge: Number(maxAge) }); onClose(); }} style={{ padding: "8px 18px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Save Regulations</button>
      </div>
    </PMModal>
  );
};

const PMSalesModal = ({ policy, onClose }) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const rawData = [42, 58, 71, 89, 95, Math.max(policy.salesCount - 355, 40)];
  const maxVal = Math.max(...rawData);
  return (
    <PMModal title={`Sales Analytics — ${policy.policyName}`} onClose={onClose} wide>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
        {[["Total Sales", policy.salesCount, "#4f46e5"], ["Revenue", pmFmt(policy.salesCount * policy.premium), "#059669"], ["Avg Premium", pmFmt(policy.premium), "#d97706"]].map(([l, v, c]) => (
          <div key={l} style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 14px", borderLeft: `4px solid ${c}` }}>
            <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 700 }}>{l}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginTop: 3 }}>{v}</div>
          </div>
        ))}
      </div>
      <PMSecTitle>Monthly Sales — 2026</PMSecTitle>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, padding: "0 4px" }}>
        {months.map((m, i) => (
          <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#4f46e5" }}>{rawData[i]}</div>
            <div style={{ width: "100%", background: "#4f46e5", borderRadius: "4px 4px 0 0", height: `${(rawData[i] / maxVal) * 110}px` }} />
            <div style={{ fontSize: 10, color: "#6b7280" }}>{m}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "right", marginTop: 18 }}>
        <button onClick={onClose} style={{ padding: "8px 20px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Close</button>
      </div>
    </PMModal>
  );
};

const PMDeleteModal = ({ policy, onClose, onConfirm }) => (
  <PMModal title="Delete Policy" onClose={onClose}>
    <div style={{ textAlign: "center", padding: "8px 0 14px" }}>
      <div style={{ fontSize: 42, marginBottom: 10 }}>🗑️</div>
      <div style={{ fontWeight: 800, fontSize: 15, color: "#111827", marginBottom: 6 }}>Delete "{policy.policyName}"?</div>
      <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 18 }}>This is permanent. Policy {policy.policyNo} and all associated data will be removed.</div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <button onClick={onClose} style={{ padding: "8px 20px", border: "1px solid #d1d5db", background: "#fff", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Cancel</button>
        <button onClick={() => { onConfirm(policy.id); onClose(); }} style={{ padding: "8px 20px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Yes, Delete</button>
      </div>
    </div>
  </PMModal>
);

// ── Three-dot action dropdown menu ────────────────────────────────────────
// Uses a React portal + fixed positioning so the dropdown is never clipped
// by the table's overflow-x:auto / overflow:hidden containers.
const PM_MENU_ITEMS = [
  { type: "view",        label: "View Details",          icon: Eye },
  { type: "edit",        label: "Edit Policy",           icon: Edit3 },
  { type: "clone",       label: "Clone Policy",          icon: ClipboardCheck },
  { type: "premium",     label: "Configure Premium",     icon: Settings2 },
  { type: "features",    label: "Configure Features",    icon: ListChecks },
  { type: "regulations", label: "Configure Regulations", icon: ShieldAlert },
  { type: "sales",       label: "View Sales",            icon: BarChart3 },
  { type: "delete",      label: "Delete Policy",         icon: Trash2, danger: true },
];

const PMRowMenu = ({ policy, openMenuId, setOpenMenuId, setModal }) => {
  const isOpen = openMenuId === policy.id;
  const btnRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      // Align right edge of the 224 px (w-56) menu with right edge of button.
      // If there isn't enough space below, flip upward.
      const menuHeight = PM_MENU_ITEMS.length * 40 + 8; // approx
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow < menuHeight
        ? rect.top - menuHeight
        : rect.bottom + 4;
      const left = Math.max(8, rect.right - 224);
      setMenuPos({ top, left });
    }
    setOpenMenuId(isOpen ? null : policy.id);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={btnRef}
        onClick={handleToggle}
        aria-label="More actions"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 34,
          height: 34,
          borderRadius: 8,
          border: "1px solid #e2e8f0",
          background: "#fff",
          color: "#475569",
          cursor: "pointer",
          flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
        onMouseLeave={e => e.currentTarget.style.background = "#fff"}
      >
        <MoreVertical size={16} color="#475569" strokeWidth={2.5} />
      </button>

      {isOpen && ReactDOM.createPortal(
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: menuPos.top,
            left: menuPos.left,
            zIndex: 9999,
            width: 224,
          }}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
        >
          {PM_MENU_ITEMS.map((item) => (
            <button
              key={item.type}
              onClick={() => { setModal({ type: item.type, policy }); setOpenMenuId(null); }}
              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold transition hover:bg-slate-50 ${item.danger ? "text-rose-600" : "text-slate-700"}`}
            >
              <item.icon size={15} />
              {item.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
};

const PolicyManagementPage = () => {
  const [policies, setPolicies] = useState(INITIAL_POLICY_LIST);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState("2026-12-31");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const nextId = useMemo(() => Math.max(0, ...policies.map(p => p.id)) + 1, [policies]);
  const PAGE_SIZE = 5;

  const filtered = useMemo(() => {
    return policies.filter(p => {
      const matchesSearch = !search || p.policyName.toLowerCase().includes(search.toLowerCase()) || p.policyNo.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "All" || p.type === typeFilter;
      const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    });
  }, [policies, search, typeFilter, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const categories = useMemo(() => ["All", ...new Set(policies.map(p => p.category))], [policies]);
  const types = useMemo(() => ["All", ...new Set(policies.map(p => p.type))], [policies]);

  const updatePolicy = (id, changes) => setPolicies(rows => rows.map(p => (p.id === id ? { ...p, ...changes } : p)));
  const addPolicy = (policy) => setPolicies(rows => [policy, ...rows]);
  const deletePolicy = (id) => setPolicies(rows => rows.filter(p => p.id !== id));

  const createNewPolicy = () => {
    const id = nextId;
    const code = `POL-NEW-${String(id).padStart(3, "0")}`;
    addPolicy({
      id, policyNo: code, policyName: "New Insurance Policy", category: "Health", type: "Individual",
      coverage: 100000, premium: 5000, status: "Draft",
      createdDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-"),
      description: "Newly created policy — configure details below.", minAge: 18, maxAge: 65,
      currency: "INR - Indian Rupee", code, salesCount: 0,
      regulations: "IRDAI Regulation 2016", features: [], premiumBreakdown: { base: 5000, tax: 0, discount: 0 },
    });
    setPage(1);
  };

  // Close menu when clicking anywhere outside
  const handleSectionClick = () => setOpenMenuId(null);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" onClick={handleSectionClick}>
      <SectionTitle
        icon={FileText}
        title="Policy Management"
        action={
          <button onClick={(e) => { e.stopPropagation(); createNewPolicy(); }} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white transition hover:bg-blue-700">
            <Plus size={16} />Add New Policy
          </button>
        }
      />

      {/* Filters */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-500">Search Policy</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by Policy No, Name..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm font-semibold outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-500">Policy Type</label>
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-blue-500">
            {types.map(t => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-500">Policy Category</label>
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-blue-500">
            {categories.map(c => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-500">Status</label>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-blue-500">
            {["All", "Active", "Draft", "Inactive"].map(s => <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-500">Created By</label>
          <select className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-blue-500">
            <option>All Users</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-500">Date From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-500">Date To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-blue-500" />
        </div>
        <button onClick={() => setPage(1)} className="h-11 rounded-lg bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700">Search</button>
        <button
          onClick={() => { setSearch(""); setTypeFilter("All"); setCategoryFilter("All"); setStatusFilter("All"); setPage(1); }}
          className="h-11 rounded-lg border border-slate-200 px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
        >
          Reset
        </button>
      </div>

      {/* Table — overflow-x-auto only, NOT overflow:hidden, so portal still renders fine */}
      <div className="mt-5 rounded-lg border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                {["Policy No", "Policy Name", "Category", "Type", "Coverage (₹)", "Premium (₹)", "Status", "Created Date", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((policy) => {
                const st = PM_STATUS[policy.status] || PM_STATUS.Draft;
                const catBg = PM_CAT_BG[policy.category] || "#e0e7ff";
                const catText = PM_CAT_TEXT[policy.category] || "#4338ca";
                return (
                  <tr key={policy.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-800 whitespace-nowrap">{policy.policyNo}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">{policy.policyName}</td>
                    <td className="px-4 py-3">
                      <span style={{ background: catBg, color: catText }} className="rounded-lg px-2 py-1 text-xs font-black">{policy.category}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{policy.type}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{pmFmt(policy.coverage)}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{pmFmt(policy.premium)}</td>
                    <td className="px-4 py-3">
                      <span style={{ background: st.bg, color: st.text }} className="rounded-lg px-2 py-1 text-xs font-black">{policy.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{policy.createdDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setModal({ type: "view", policy }); }}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                        >
                          View
                        </button>
                        <PMRowMenu
                          policy={policy}
                          openMenuId={openMenuId}
                          setOpenMenuId={setOpenMenuId}
                          setModal={setModal}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm font-semibold text-slate-400">
                    No policies match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
          <span>Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} entries</span>
          <div className="flex items-center gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold disabled:opacity-40">‹</button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)} className={`rounded-lg px-3 py-1.5 font-bold ${page === n ? "bg-blue-600 text-white" : "border border-slate-200"}`}>{n}</button>
            ))}
            {totalPages > 3 && <span className="px-1">…</span>}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Policies Sold", value: policies.reduce((s, p) => s + (p.salesCount || 0), 0).toLocaleString("en-IN") },
          { label: "Active Policies", value: policies.filter(p => p.status === "Active").length },
          { label: "Claims Raised", value: 234 },
          { label: "Claims Approved", value: 190 },
        ].map(c => (
          <div key={c.label} className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-bold text-slate-500">{c.label}</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{c.value}</p>
          </div>
        ))}
      </div>

      {modal?.type === "view"        && <PMViewModal        policy={modal.policy} onClose={() => setModal(null)} />}
      {modal?.type === "edit"        && <PMEditModal        policy={modal.policy} onClose={() => setModal(null)} onSave={(form) => updatePolicy(modal.policy.id, { ...form, coverage: Number(form.coverage), premium: Number(form.premium), minAge: Number(form.minAge), maxAge: Number(form.maxAge) })} />}
      {modal?.type === "clone"       && <PMCloneModal       policy={modal.policy} nextId={nextId} onClose={() => setModal(null)} onClone={(newPolicy) => addPolicy(newPolicy)} />}
      {modal?.type === "premium"     && <PMPremiumModal     policy={modal.policy} onClose={() => setModal(null)} onSave={(changes) => updatePolicy(modal.policy.id, changes)} />}
      {modal?.type === "features"    && <PMFeaturesModal    policy={modal.policy} onClose={() => setModal(null)} onSave={(changes) => updatePolicy(modal.policy.id, changes)} />}
      {modal?.type === "regulations" && <PMRegulationsModal policy={modal.policy} onClose={() => setModal(null)} onSave={(changes) => updatePolicy(modal.policy.id, changes)} />}
      {modal?.type === "sales"       && <PMSalesModal       policy={modal.policy} onClose={() => setModal(null)} />}
      {modal?.type === "delete"      && <PMDeleteModal      policy={modal.policy} onClose={() => setModal(null)} onConfirm={(id) => deletePolicy(id)} />}
    </section>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   ADMIN PAGE
   ════════════════════════════════════════════════════════════════════════ */

const AdminPage = () => {
  const [adminProfiles, setAdminProfiles] = useState(() => loadAdmins());
  const [selectedProfile, setSelectedProfile] = useState(() => loadAdmins()[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [customerRows, setCustomerRows] = useState(() => {
    const realUsers = readRealUsers();
    return realUsers.length ? realUsers : users;
  });
  const [claimRows, setClaimRows] = useState(readAdminClaims);
  const [, setTicketRows] = useState(tickets);
  const [requirementRows, setRequirementRows] = useState(requirements);
  const [documentRows, setDocumentRows] = useState(() => {
    const uploadedDocs = readUploadedDocuments();
    return uploadedDocs.length ? [...uploadedDocs, ...documents] : documents;
  });
  const [planRows, setPlanRows] = useState(readAdminPolicyRows);
  const [auditLogs, setAuditLogs] = useState(() => loadAuditLogs());
  const [systemSettings, setSystemSettings] = useState(readSystemSettings);
  const [selectedSettingId, setSelectedSettingId] = useState("general");
  const [showAdminProfilePassword, setShowAdminProfilePassword] = useState(false);
  const [adminNameDraft, setAdminNameDraft] = useState(() => loadAdmins()[0]?.name || "");
  const [passwordDraft, setPasswordDraft] = useState({ old: "", next: "", confirm: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [supportChats, setSupportChats] = useState(() => readSupportChats());
  const [selectedChat, setSelectedChat] = useState(null);
  const [adminReply, setAdminReply] = useState("");
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentMarks, setDocumentMarks] = useState({});
  const [markupTool, setMarkupTool] = useState("pen");
  const [draftMark, setDraftMark] = useState(null);
  const [detail, setDetail] = useState({
    title: "Admin Activity",
    body: "Select a row or action to view operational context here.",
    photo: "",
  });

  const activeUsers = customerRows.filter((user) => user.status === "Active" || user.status === "Logged In").length;

  const addAuditLogEntry = (actionString) => {
    const nextLog = {
      id: makeUiId("LOG-", 4),
      action: actionString,
      username: selectedProfile?.email || "system-account",
      initials: selectedProfile?.initials || "SYS",
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((currentLogs) => {
      const updated = [nextLog, ...currentLogs];
      saveAuditLogs(updated);
      return updated;
    });
  };

  const allowedNav = useMemo(
    () => navItems.filter((item) => item.roles.includes(selectedProfile.role)),
    [selectedProfile.role],
  );

  const openPage = (page) => {
    setActivePage(page);
    setMobileOpen(false);
    setEditingRecord(null);
    setSelectedReport(null);
    // FIX 1: no longer writes a redundant "You opened X as Super Admin" detail —
    // that info is already shown in the header label + Right Panel user card.
  };

  const runAction = (title, body, photo = "") => setDetail({ title, body: formatStructuredDetail(body), photo });

  const editFieldsByKind = {
    users: ["name", "email", "phone", "address", "policies", "status", "city"],
    claims: ["id", "user", "policy", "amount", "status", "officer", "description", "docName"],
    policies: ["name", "company", "categorySlug", "type", "coverage", "premiumYearly", "offer", "duration", "renewalDate", "themeColor", "state"],
    documents: ["type", "owner", "status", "note"],
    requirements: ["user", "age", "budget", "coverage", "status"],
    support: ["id", "user", "subject", "priority", "status"],
  };

  const updateRowsForKind = (kind, updater) => {
    const setter = {
      users: setCustomerRows,
      claims: setClaimRows,
      support: setTicketRows,
      requirements: setRequirementRows,
      documents: setDocumentRows,
      policies: setPlanRows,
    }[kind];
    if (!setter) return;
    setter((rows) => {
      const nextRows = typeof updater === "function" ? updater(rows) : updater;
      if (kind === "policies") persistPolicyRows(nextRows);
      return nextRows;
    });
  };

  const startEditRecord = (kind, target) => {
    setEditingRecord({ kind, key: rowKeyFor(target), draft: { ...target }, fields: editFieldsByKind[kind] || Object.keys(target) });
    runAction("Edit opened", `${selectedProfile.name} is editing ${rowKeyFor(target)}.`);
  };

  const saveEditedRecord = () => {
    if (!editingRecord) return;
    updateRowsForKind(editingRecord.kind, (rows) =>
      rows.map((row) => (rowKeyFor(row) === editingRecord.key ? { ...row, ...editingRecord.draft } : row)),
    );
    addAuditLogEntry(`ui/${editingRecord.kind}/edit -> Saved changes for ${editingRecord.key}`);
    runAction("Changes saved", `${editingRecord.key} was updated by ${selectedProfile.name}.`);
  };

  const sendEditedRecordToUser = () => {
    if (!editingRecord) return;
    saveEditedRecord();
    addAuditLogEntry(`ui/${editingRecord.kind}/send -> Sent edited details back to user for ${editingRecord.key}`);
    runAction("Sent to user", {
      record: editingRecord.key,
      type: editingRecord.kind,
      message: "Updated details have been sent back to the user for review.",
    });
  };

  const currentDocumentKey = selectedDocument ? `${selectedDocument.type}-${selectedDocument.owner}` : "";
  const currentDocumentMarks = documentMarks[currentDocumentKey] || [];

  const pointFromEvent = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };
  };

  const startMarkup = (event) => {
    if (!selectedDocument) return;
    const point = pointFromEvent(event);
    if (markupTool === "eraser") {
      setDocumentMarks((marks) => ({
        ...marks,
        [currentDocumentKey]: (marks[currentDocumentKey] || []).slice(0, -1),
      }));
      return;
    }
    setDraftMark({ id: `mark-${Date.now()}`, tool: markupTool, points: [point], color: markupTool === "circle" ? "#dc2626" : "#2563eb" });
  };

  const continueMarkup = (event) => {
    if (!draftMark || markupTool !== "pen") return;
    const point = pointFromEvent(event);
    setDraftMark((mark) => ({ ...mark, points: [...mark.points, point] }));
  };

  const finishMarkup = (event) => {
    if (!draftMark || !selectedDocument) return;
    const endPoint = pointFromEvent(event);
    const completedMark = draftMark.tool === "circle" ? { ...draftMark, points: [draftMark.points[0], endPoint] } : draftMark;
    setDocumentMarks((marks) => ({
      ...marks,
      [currentDocumentKey]: [...(marks[currentDocumentKey] || []), completedMark],
    }));
    setDraftMark(null);
  };

  const undoDocumentMark = () => {
    if (!selectedDocument) return;
    setDocumentMarks((marks) => ({
      ...marks,
      [currentDocumentKey]: (marks[currentDocumentKey] || []).slice(0, -1),
    }));
  };

  const sendDocumentCorrection = () => {
    if (!selectedDocument) return;
    setDocumentRows((rows) =>
      rows.map((doc) =>
        `${doc.type}-${doc.owner}` === currentDocumentKey
          ? { ...doc, status: "Re-upload Requested", note: "Marked corrections sent by admin." }
          : doc,
      ),
    );
    addAuditLogEntry(`ui/documents/markup/send -> Sent correction marks for ${currentDocumentKey}`);
    runAction("Document sent back", `${selectedDocument.owner} will see the marked corrections for ${selectedDocument.type}.`);
  };

  const refreshRealUsers = () => {
    const realUsers = readRealUsers();
    setCustomerRows(realUsers.length ? realUsers : users);
    runAction("Users refreshed", `${realUsers.length} real registered or logged-in users loaded from the app profile store.`);
  };

  const createCustomer = () => {
    const nextUser = {
      id: makeUiId("USR", 5),
      name: "New Customer",
      email: `customer${customerRows.length + 1}@agile.demo`,
      phone: "Not added",
      address: "Not added",
      policies: 0,
      status: "Active",
      city: "Not added",
    };
    setCustomerRows((rows) => [nextUser, ...rows]);
    setEditingRecord({ kind: "users", key: rowKeyFor(nextUser), draft: { ...nextUser }, fields: editFieldsByKind.users });
    addAuditLogEntry(`ui/users/create -> Added customer profile: ${nextUser.email}`);
    runAction("User created", `${nextUser.name} was added by ${selectedProfile.name}.`);
  };

  const createPlan = () => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextPlan = {
      id: makeUiId("admin-policy-", 8),
      name: `New Insurance Plan ${planRows.length + 1}`,
      company: "Agile Insurance",
      categorySlug: "health-insurance",
      type: "Health",
      coverage: "₹10,00,000",
      premium: "INR 11,988/yr",
      premiumYearly: 11988,
      offer: "Admin Offer",
      duration: "1 year",
      renewalDate: nextYear.toISOString().slice(0, 10),
      themeColor: "#2563eb",
      state: "Draft",
    };
    setPlanRows((rows) => [nextPlan, ...rows]);
    setEditingRecord({ kind: "policies", key: rowKeyFor(nextPlan), draft: { ...nextPlan }, fields: editFieldsByKind.policies });
    addAuditLogEntry(`ui/policies/create -> Initialized draft plan: ${nextPlan.name}`);
    runAction("Plan created", `${nextPlan.name} is ready for editing and approval.`);
  };

  const createClaim = () => {
    const year = new Date().getFullYear();
    const nextClaim = {
      id: `CLM-${year}-${randomDigits(8)}`,
      user: customerRows[0]?.name || "New Customer",
      email: customerRows[0]?.email || "not-provided@agile.demo",
      phone: customerRows[0]?.phone || "Not added",
      policy: "Health",
      amount: "INR 25,000",
      status: "Pending",
      officer: selectedProfile.name,
      description: "Claim created from admin portal.",
      docName: "Documents pending",
    };
    setClaimRows((rows) => [nextClaim, ...rows]);
    setEditingRecord({ kind: "claims", key: rowKeyFor(nextClaim), draft: { ...nextClaim }, fields: editFieldsByKind.claims });
    addAuditLogEntry(`ui/claims/create -> Opened claim sheet: ${nextClaim.id}`);
    runAction("Claim created", `${nextClaim.id} was created. Add or edit customer name, policy, amount, documents, and notes before sending.`);
  };

  const createRequirement = () => {
    const nextRequirement = {
      user: customerRows[0]?.name || "Customer",
      age: 30,
      budget: "INR 15,000",
      coverage: "INR 10L",
      status: "Review",
    };
    setRequirementRows((rows) => [nextRequirement, ...rows]);
    runAction("Requirement created", `A new policy requirement was created for ${nextRequirement.user}.`);
  };

  const updateAdminProfile = (changes) => {
    const nextAdmins = adminProfiles.map((admin) =>
      admin.email === selectedProfile.email ? { ...admin, ...changes } : admin,
    );
    const nextSelected = nextAdmins.find((admin) => admin.email === selectedProfile.email);
    setAdminProfiles(nextAdmins);
    setSelectedProfile(nextSelected);
    saveAdmins(nextAdmins);
    return nextSelected;
  };

  const saveAdminName = () => {
    const name = adminNameDraft.trim();
    if (!name) {
      runAction("Name required", "Admin name cannot be empty.");
      return;
    }
    const nextSelected = updateAdminProfile({
      name,
      initials: name
        .split(" ")
        .map((part) => part)
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    });
    addAuditLogEntry(`ui/profile/updateName -> Changed administrative label name to: ${nextSelected.name}`);
    runAction("Admin name updated", `Admin name changed to ${nextSelected.name}.`);
  };

  const saveAdminPassword = () => {
    if (passwordDraft.old !== selectedProfile.password) {
      setPasswordMessage("Old password is incorrect.");
      return;
    }
    if (passwordDraft.next.length < 6) {
      setPasswordMessage("New password must be at least 6 characters.");
      return;
    }
    if (passwordDraft.next !== passwordDraft.confirm) {
      setPasswordMessage("New password and confirm password do not match.");
      return;
    }
    updateAdminProfile({ password: passwordDraft.next });
    setPasswordDraft({ old: "", next: "", confirm: "" });
    setPasswordMessage("Password changed successfully.");
    addAuditLogEntry(`ui/profile/updatePassword -> Modified credentials passcode keys`);
    runAction("Admin password updated", `${selectedProfile.name} changed their password after old password verification.`);
  };

  const updateAdminPhoto = (file) => {
    fileToDataUrl(file, (profilePhoto) => {
      updateAdminProfile({ profilePhoto });
      addAuditLogEntry(`ui/profile/updatePhoto -> Modified account metadata visual layout profile avatar`);
      runAction("Admin photo updated", `${selectedProfile.name} uploaded a new profile photo.`);
    });
  };

  const mutateRows = (kind, target, action) => {
    const targetKey = target.id || target.name || target.user || target.type;
    const updater = (row) => {
      const rowKey = row.id || row.name || row.user || row.type;
      if (rowKey !== targetKey) return row;
      if (action === "approve") {
        if (kind === "claims") {
          notifyClaimDecision({ claimId: row.id, status: "Approved", adminName: selectedProfile.name });
          return { ...row, status: "Approved" };
        }
        if (kind === "documents") return { ...row, status: "Approved" };
        if (kind === "policies") return { ...row, state: "Active" };
        if (kind === "support") return { ...row, status: "Resolved" };
        return { ...row, status: "Active" };
      }
      return row;
    };
    const remove = (row) => (row.id || row.name || row.user || row.type) !== targetKey;
    const setter = {
      users: setCustomerRows,
      claims: setClaimRows,
      support: setTicketRows,
      requirements: setRequirementRows,
      documents: setDocumentRows,
      policies: setPlanRows,
    }[kind];

    setter((rows) => {
      const nextRows = action === "delete" ? rows.filter(remove) : rows.map(updater);
      if (kind === "policies") persistPolicyRows(nextRows);
      return nextRows;
    });
    addAuditLogEntry(`ui/${kind}/${action} -> Executed action on item reference key ID: ${targetKey}`);
    runAction(
      action === "delete" ? "Deleted" : "Approved",
      `${targetKey} was ${action === "delete" ? "removed" : "approved"} by ${selectedProfile.name}.`,
    );
  };

  const respondToClaim = (claim) => {
    const message = `Dear ${claim.user}, your ${claim.policy} claim ${claim.id} is under review. Please keep your policy number, hospital bills, identity proof, and bank details ready.`;
    setClaimRows((rows) => rows.map((row) => (row.id === claim.id ? { ...row, status: "Under Review", response: message } : row)));
    addAuditLogEntry(`ui/claims/respond -> Forwarded manual procedural response guidelines message to ${claim.id}`);
    runAction("Response sent to user", {
      claimId: claim.id,
      user: claim.user,
      response: message,
    });
  };

  const rejectClaimForMissingDetails = (claim) => {
    const missing = [];
    if (!claim.amount) missing.push("Claim amount");
    if (!claim.policy) missing.push("Policy type");
    if (claim.status === "Documents") missing.push("Required documents");
    const reason = missing.length ? `Missing details: ${missing.join(", ")}` : "Rejected after verification due to incomplete claim evidence";
    setClaimRows((rows) => rows.map((row) => (row.id === claim.id ? { ...row, status: "Rejected", rejectionReason: reason } : row)));
    notifyClaimDecision({ claimId: claim.id, status: "Rejected", reason, adminName: selectedProfile.name });
    addAuditLogEntry(`ui/claims/reject -> Issued fallback state negative evaluation on: ${claim.id}`);
    runAction("Claim rejected", {
      claimId: claim.id,
      user: claim.user,
      reason,
      responseToUser: "Your claim was rejected because required details are missing. Please resubmit with complete documents.",
    });
  };

  const getSettingValue = (settingId, field) => {
    const saved = systemSettings.modules?.[settingId]?.[field.name];
    return saved ?? field.defaultValue ?? "";
  };

  const updateSettingModule = (settingId, field, value) => {
    setSystemSettings((settings) => {
      const next = {
        ...settings,
        modules: {
          ...(settings.modules || {}),
          [settingId]: {
            ...(settings.modules?.[settingId] || {}),
            [field.name]: value,
          },
        },
      };
      saveSystemSettings(next);
      return next;
    });
    addAuditLogEntry(`ui/settings/update -> ${settingId}.${field.name}`);
    runAction("Setting applied", `${field.label} updated in real time.`);
  };

  const updateStructuredSetting = (settingId, field, updater, actionLabel = field.label) => {
    const current = getSettingValue(settingId, field);
    const nextValue = typeof updater === "function" ? updater(current) : updater;
    updateSettingModule(settingId, field, nextValue);
    runAction("Configuration updated", `${actionLabel} configuration has been saved locally.`);
  };

  const updateSettingFile = (settingId, field, file) => {
    if (!file) return;
    fileToDataUrl(file, (dataUrl) => updateSettingModule(settingId, field, dataUrl));
  };

  const openSettingDetail = (settingId) => {
    const card = adminSettingCards.find((item) => item.id === settingId) || adminSettingCards[0];
    setSelectedSettingId(card.id);
    setActivePage("setting-detail");
    setDetail({ title: card.title, body: card.description, photo: "" });
  };

  const actionButtons = (target, kind) => (
    <div className="flex gap-1">
      <ActionButton
        icon={Eye}
        label="View"
        onClick={() =>
          runAction(
            `Viewing ${target.id || target.name || target.user}`,
            kind === "users" ? {
              profile: target.name,
              email: target.email,
              phone: target.phone,
              city: target.city,
              address: target.address || "Not added",
              loginStatus: target.status,
              policiesPurchased: target.policies || 0,
              claimsSubmitted: claimRows.filter((claim) => claim.user === target.name || claim.email === target.email).length,
              claimSummary: claimRows.filter((claim) => claim.user === target.name || claim.email === target.email).map((claim) => `${claim.id} - ${claim.policy} - ${claim.status}`).join("; ") || "No claims found for this user",
              paymentsMade: 0,
              documentsUploaded: 0,
              documents: "No uploaded documents found",
              recentActivity: target.status === "Logged In" ? "Currently logged in to the user portal" : "Registered user profile available",
            } : target,
            kind === "users" ? target.profilePhoto : "",
          )
        }
      />
      <ActionButton icon={Edit3} label="Edit" onClick={() => startEditRecord(kind, target)} />
      <ActionButton icon={CheckCircle2} label="Approve" onClick={() => mutateRows(kind, target, "approve")} />
      <ActionButton icon={Trash2} label="Delete" onClick={() => mutateRows(kind, target, "delete")} />
    </div>
  );

  const openReportDetail = (report) => {
    setSelectedReport(report);
    setEditingRecord(null);
    setActivePage("report-detail");
    setDetail({ title: report, body: `${report} opened with current admin data.`, photo: "" });
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        adminProfiles={adminProfiles}
        selectedProfile={selectedProfile}
        setSelectedProfile={setSelectedProfile}
        onLogin={() => {
          setIsAuthenticated(true);
          setActivePage("dashboard");
          setAdminNameDraft(selectedProfile.name);
          addAuditLogEntry(`Authentication / Login successful as [${selectedProfile.role}]`);
          setDetail({ title: "Login successful", body: `${selectedProfile.name} signed in as ${selectedProfile.role}.`, photo: selectedProfile.profilePhoto || "" });
        }}
      />
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-100 text-slate-900">
      <div className="flex h-full min-h-0">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          allowedNav={allowedNav}
          activePage={activePage}
          selectedProfile={selectedProfile}
          openPage={openPage}
          onLogout={() => setIsAuthenticated(false)}
          onToggleCollapsed={() => setSidebarCollapsed((value) => !value)}
        />

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button className="absolute inset-0 bg-slate-950/50" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
            <div className="relative h-full">
              <AdminSidebar
                mobile
                allowedNav={allowedNav}
                activePage={activePage}
                selectedProfile={selectedProfile}
                openPage={openPage}
                onLogout={() => setIsAuthenticated(false)}
                onToggleCollapsed={() => setMobileOpen(false)}
              />
              <button className="absolute right-4 top-4 rounded-lg bg-white p-2 text-slate-700 shadow" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="shrink-0 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button className="rounded-lg border border-slate-200 p-2 lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
                  <Menu size={20} />
                </button>
                <div className="min-w-0">
                  <div className="truncate text-xs font-black uppercase tracking-wide text-slate-500">{pageTitles[activePage]}</div>
                  <div className="truncate text-lg font-black text-slate-950">{selectedProfile.role} Workspace</div>
                </div>
              </div>

              <div className="hidden min-w-0 flex-1 justify-center px-4 md:flex">
                <div className="relative w-full max-w-xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium outline-none focus:border-blue-500" placeholder="Search users, claims, tickets, policies..." />
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button onClick={() => openPage("notifications")} className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700" aria-label="Notifications">
                  <Bell size={18} />
                </button>
                <button onClick={() => openPage("profile")} className="hidden h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 sm:inline-flex">
                  {selectedProfile.profilePhoto ? (
                    <img src={selectedProfile.profilePhoto} alt={selectedProfile.name} className="h-8 w-8 rounded-lg object-cover" />
                  ) : (
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-xs font-black text-white">{selectedProfile.initials}</span>
                  )}
                  {selectedProfile.name.split(" ")[0]}
                </button>
              </div>
            </div>
          </header>

          <div className="grid min-h-0 flex-1 xl:grid-cols-[minmax(0,1fr)_340px]">
            <section className="scrollbar-none min-h-0 overflow-y-auto p-4 sm:p-6">
              <EditPanel editingRecord={editingRecord} setEditingRecord={setEditingRecord} saveEditedRecord={saveEditedRecord} sendEditedRecordToUser={sendEditedRecordToUser} />

              {activePage === "policies" ? (
                <PolicyManagementPage />
              ) : (
                <AdminPageContent
                  activePage={activePage}
                  selectedProfile={selectedProfile}
                  customerRows={customerRows}
                  claimRows={claimRows}
                  supportChats={supportChats}
                  requirementRows={requirementRows}
                  documentRows={documentRows}
                  planRows={planRows}
                  activeUsers={activeUsers}
                  refreshRealUsers={refreshRealUsers}
                  createCustomer={createCustomer}
                  createClaim={createClaim}
                  createRequirement={createRequirement}
                  createPlan={createPlan}
                  actionButtons={actionButtons}
                  respondToClaim={respondToClaim}
                  rejectClaimForMissingDetails={rejectClaimForMissingDetails}
                  runAction={runAction}
                  setSupportChats={setSupportChats}
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  adminReply={adminReply}
                  setAdminReply={setAdminReply}
                  addAuditLogEntry={addAuditLogEntry}
                  selectedDocument={selectedDocument}
                  setSelectedDocument={setSelectedDocument}
                  currentDocumentKey={currentDocumentKey}
                  currentDocumentMarks={currentDocumentMarks}
                  draftMark={draftMark}
                  markupTool={markupTool}
                  setMarkupTool={setMarkupTool}
                  startMarkup={startMarkup}
                  continueMarkup={continueMarkup}
                  finishMarkup={finishMarkup}
                  undoDocumentMark={undoDocumentMark}
                  sendDocumentCorrection={sendDocumentCorrection}
                  startEditRecord={startEditRecord}
                  mutateRows={mutateRows}
                  openReportDetail={openReportDetail}
                  selectedReport={selectedReport}
                  auditLogs={auditLogs}
                  setAuditLogs={setAuditLogs}
                  selectedSettingId={selectedSettingId}
                  getSettingValue={getSettingValue}
                  updateSettingModule={updateSettingModule}
                  updateStructuredSetting={updateStructuredSetting}
                  updateSettingFile={updateSettingFile}
                  openPage={openPage}
                  openSettingDetail={openSettingDetail}
                  adminNameDraft={adminNameDraft}
                  setAdminNameDraft={setAdminNameDraft}
                  updateAdminPhoto={updateAdminPhoto}
                  saveAdminName={saveAdminName}
                  passwordDraft={passwordDraft}
                  setPasswordDraft={setPasswordDraft}
                  showAdminProfilePassword={showAdminProfilePassword}
                  setShowAdminProfilePassword={setShowAdminProfilePassword}
                  saveAdminPassword={saveAdminPassword}
                  passwordMessage={passwordMessage}
                />
              )}
            </section>

            {/* RIGHT PANEL — FIX 3: replaced dev placeholder heading with "Quick Overview" */}
            <aside className="hidden min-h-0 overflow-y-auto border-l border-slate-200 bg-white p-5 xl:block">
              <div className="sticky top-0 bg-white pb-4">
                <div className="text-sm font-black text-slate-950">Quick Overview</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">Snapshot of your current activity</div>
              </div>

              <div className="space-y-5">
                {/* Admin profile card */}
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

                {/* FIX 1: detail card — only reflects real actions (view/approve/respond/etc.)
                    since openPage() no longer overwrites it with a duplicate nav message */}
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="text-sm font-black text-slate-950">{detail.title}</div>
                  {detail.photo && (
                    <img src={detail.photo} alt={detail.title} className="mt-3 h-24 w-24 rounded-lg object-cover" />
                  )}
                  <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-950 p-3 text-xs font-semibold leading-5 text-slate-100">{detail.body}</pre>
                </div>

                {/* FIX 2: Operations Queue — dashboard only, not on every page */}
                {activePage === "dashboard" && (
                  <div className="rounded-lg border border-slate-200 p-4">
                    <div className="text-sm font-black text-slate-950">Operations Queue</div>
                    <div className="mt-3 space-y-2 text-sm font-bold text-slate-700">
                      <button onClick={() => openPage("documents")} className="flex w-full justify-between rounded-lg bg-slate-50 px-3 py-3 text-left hover:bg-slate-100">
                        <span>Pending verifications</span>
                        <span>{documentRows.filter(d => d.status === "Pending").length}</span>
                      </button>
                      <button onClick={() => openPage("claims")} className="flex w-full justify-between rounded-lg bg-slate-50 px-3 py-3 text-left hover:bg-slate-100">
                        <span>Claims in review</span>
                        <span>{claimRows.filter(c => c.status === "Under Review").length}</span>
                      </button>
                      <button onClick={() => openPage("support")} className="flex w-full justify-between rounded-lg bg-slate-50 px-3 py-3 text-left hover:bg-slate-100">
                        <span>Open support chats</span>
                        <span>{supportChats.filter(s => s.status !== "Resolved").length}</span>
                      </button>
                      <button onClick={() => openPage("requirements")} className="flex w-full justify-between rounded-lg bg-slate-50 px-3 py-3 text-left hover:bg-slate-100">
                        <span>Quotes requested</span>
                        <span>{requirementRows.length}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="text-sm font-black text-slate-950">Quick Actions</div>
                  <div className="mt-3 grid gap-2">
                    {[
                      ["Create plan", "policies"],
                      ["Send reminder", "notifications"],
                      ["Export claims", "reports"],
                    ].map(([label, page]) => (
                      <button key={label} onClick={() => openPage(page)} className="rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-black hover:bg-slate-50">{label}</button>
                    ))}
                    <button
                      onClick={() => {
                        // Try the settings card route first (audit logs lives inside Settings in this app).
                        // openSettingDetail navigates to setting-detail with the audit card selected.
                        const auditCard = adminSettingCards.find(c =>
                          c.id === "audit-logs" || c.id === "audit" || c.id === "auditlogs" ||
                          (c.title && c.title.toLowerCase().includes("audit"))
                        );
                        if (auditCard) {
                          openSettingDetail(auditCard.id);
                        } else {
                          // Fallback: open settings page directly
                          openPage("settings");
                        }
                      }}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-black hover:bg-slate-50"
                    >
                      Open audit logs
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;

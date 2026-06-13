import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Server, Save, CheckCircle, ArrowLeft } from "lucide-react";
import { readSystemSettings, saveSystemSettings, systemConfigurationDefaults } from "../utils/systemSettings";

export default function SystemConfigurationPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState(() => {
    const settings = readSystemSettings();
    return {
      claimsModule: settings.modules?.configuration?.claimsModule ?? systemConfigurationDefaults.claimsModule,
      quotesModule: settings.modules?.configuration?.quotesModule ?? systemConfigurationDefaults.quotesModule,
      policyRenewal: settings.modules?.configuration?.policyRenewal ?? systemConfigurationDefaults.policyRenewal,
      agentPortal: settings.modules?.configuration?.agentPortal ?? systemConfigurationDefaults.agentPortal,
      customerPortal: settings.modules?.configuration?.customerPortal ?? systemConfigurationDefaults.customerPortal,
      emailNotifications: settings.modules?.configuration?.emailNotifications ?? systemConfigurationDefaults.emailNotifications,
      smsNotifications: settings.modules?.configuration?.smsNotifications ?? systemConfigurationDefaults.smsNotifications,
      auditLogging: settings.modules?.configuration?.auditLogging ?? systemConfigurationDefaults.auditLogging,
      multiHospitalSupport: settings.modules?.configuration?.multiHospitalSupport ?? systemConfigurationDefaults.multiHospitalSupport,
    };
  });

  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setConfig((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ToggleCard = ({ label, desc, value, onClick }) => (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition cursor-pointer"
    >
      <div>
        <h3 className="text-white font-medium">{label}</h3>
        <p className="text-slate-400 text-sm">{desc}</p>
      </div>

      <div
        className={`w-14 h-7 flex items-center rounded-full p-1 transition ${
          value ? "bg-green-500" : "bg-slate-700"
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${
            value ? "translate-x-7" : ""
          }`}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 text-white">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex items-center gap-3">

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/admin/settings")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center">
            <Server className="text-blue-400" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              System Configuration
            </h1>
            <p className="text-slate-400 text-sm">
              Manage core modules & system features
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-medium transition"
        >
          <Save size={18} />
          Save Changes
        </button>
      </motion.div>

      {/* STATUS */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        {saved ? (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle size={18} />
            Settings saved successfully
          </div>
        ) : (
          <p className="text-slate-400">
            Toggle modules to enable or disable system features
          </p>
        )}
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        <ToggleCard label="Claims Module" desc="Enable claim processing" value={config.claims} onClick={() => toggle("claims")} />
        <ToggleCard label="Quotes Module" desc="Enable quotation system" value={config.quotes} onClick={() => toggle("quotes")} />
        <ToggleCard label="Policy Renewal" desc="Auto renewal system" value={config.renewal} onClick={() => toggle("renewal")} />
        <ToggleCard label="Agent Portal" desc="Agent dashboard access" value={config.agent} onClick={() => toggle("agent")} />
        <ToggleCard label="Customer Portal" desc="Customer self-service" value={config.customer} onClick={() => toggle("customer")} />
        <ToggleCard label="Email Notifications" desc="Email alerts" value={config.email} onClick={() => toggle("email")} />
        <ToggleCard label="SMS Notifications" desc="SMS alerts" value={config.sms} onClick={() => toggle("sms")} />
        <ToggleCard label="Audit Logging" desc="Track system actions" value={config.audit} onClick={() => toggle("audit")} />
        <ToggleCard label="Multi-Hospital Support" desc="Healthcare expansion module" value={config.hospital} onClick={() => toggle("hospital")} />

      </div>

      {/* FOOTER */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-slate-400 text-sm">
          Footer Section
        </p>
      </div>

    </div>
  );
}
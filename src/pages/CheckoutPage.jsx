import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  CreditCard,
  FileUp,
  Landmark,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";
import { getPolicyById } from "../data/catalog";
import { load, save, uid } from "../utils/storage";
import { useAuth } from "../contexts/useAuth";
import { getModuleSetting, paymentGatewayDefaults, policyFeatureDefaults, policyFormDefaults } from "../utils/systemSettings";
import { addUserNotification } from "../utils/notifications";

const formatInr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// Checkout form labels, validation messages, payment method names, and success payload are managed here.
const calcGst = (amount) => Math.round(amount * 0.18);

// Gateway icons are local UI mappings; gateway enablement comes from admin System Settings.
const gatewayIcons = {
  razorpay: Wallet,
  stripe: CreditCard,
  paypal: Building2,
  bankTransfer: Landmark,
};

// Checkout maps policy categories to the dynamic form groups configured by the admin.
const policyCategoryFormMap = {
  "health-insurance": "health",
  "car-insurance": "vehicle",
  "term-insurance": "life",
  "life-insurance": "life",
  "travel-insurance": "travel",
  "home-insurance": "home",
  "business-insurance": "business",
};

// Select fields need predictable production options until the admin builder supports per-field option editing.
const dynamicSelectOptions = {
  gender: ["Male", "Female", "Other", "Prefer not to say"],
  smoker: ["No", "Yes"],
  propertyType: ["Apartment", "Independent House", "Commercial", "Other"],
  ownershipType: ["Owned", "Rented", "Leased"],
};

const CheckoutPage = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const policy = getPolicyById(policyId);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // Payment gateway selection is initialized from persisted admin settings.
  const [paymentMethod, setPaymentMethod] = useState(() => {
    const gateways = getModuleSetting("payment", "gateways", paymentGatewayDefaults);
    return (Array.isArray(gateways) ? gateways : paymentGatewayDefaults).find((gateway) => gateway.enabled)?.methodId || "bankTransfer";
  });

  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    nomineeName: "",
    nomineeRelation: "Spouse",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    kycDocName: "",
    aadhaarDocName: "",
    panDocName: "",
    addressProofName: "",
    photoName: "",
    bankPassbookName: "",
    otherDocName: "",
  });
  const [dynamicAnswers, setDynamicAnswers] = useState({});
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const premium = useMemo(() => policy?.premiumYearly ?? 0, [policy]);
  const gst = useMemo(() => calcGst(premium), [premium]);
  const total = premium + gst;

  // Policy-specific fields and add-ons are read from Admin > System Settings > Policy Forms/Manage Features.
  const dynamicFormType = policy ? policyCategoryFormMap[policy.categorySlug] || "" : "";
  const dynamicPolicyFields = useMemo(() => {
    const configuredForms = getModuleSetting("forms", "policyForms", policyFormDefaults);
    return dynamicFormType ? configuredForms?.[dynamicFormType] || [] : [];
  }, [dynamicFormType]);
  const availableAddOns = useMemo(() => {
    const configuredFeatures = getModuleSetting("features", "policyFeatures", policyFeatureDefaults);
    return dynamicFormType ? configuredFeatures?.[dynamicFormType] || [] : [];
  }, [dynamicFormType]);

  // Enabled gateways are shown responsively in the checkout side panel.
  const enabledPaymentGateways = useMemo(() => {
    const configuredGateways = getModuleSetting("payment", "gateways", paymentGatewayDefaults);
    return (Array.isArray(configuredGateways) ? configuredGateways : paymentGatewayDefaults)
      .filter((gateway) => gateway.enabled)
      .map((gateway) => ({
        ...gateway,
        id: gateway.methodId,
        label: gateway.name,
        icon: gatewayIcons[gateway.methodId] || CreditCard,
      }));
  }, []);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const updateDynamicAnswer = (k, v) => setDynamicAnswers((p) => ({ ...p, [k]: v }));
  const toggleAddOn = (addOn) => {
    setSelectedAddOns((current) => (current.includes(addOn) ? current.filter((item) => item !== addOn) : [...current, addOn]));
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Full Name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^\d{10}$/.test(String(form.phone || "").trim())) return "Enter a valid 10-digit phone number.";
    if (!form.nomineeName.trim()) return "Nominee name is required.";
    if (!form.addressLine1.trim()) return "Address is required.";
    if (!form.city.trim()) return "City is required.";
    if (!form.state.trim()) return "State is required.";
    if (!/^\d{6}$/.test(String(form.pincode || "").trim())) return "Enter a valid 6-digit pincode.";
    if (!form.aadhaarDocName.trim()) return "Aadhaar document is required.";
    if (!form.panDocName.trim()) return "PAN document is required.";
    if (!form.addressProofName.trim()) return "Address proof is required.";
    if (!form.photoName.trim()) return "Applicant photo is required.";
    if (["life", "business"].includes(dynamicFormType) && !form.bankPassbookName.trim()) return "Bank passbook is required for this policy.";
    const missingDynamicField = dynamicPolicyFields.find((field) => field.required && !String(dynamicAnswers[field.key] || "").trim());
    if (missingDynamicField) return `${missingDynamicField.label} is required.`;
    return "";
  };

  const onPay = async () => {
    setError("");
    const v = validate();
    if (v) return setError(v);
    if (!enabledPaymentGateways.length) return setError("No payment gateway is enabled. Please contact support.");

    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      const purchaseId = uid("purchase");
      const policyNumber = `AGL-${Math.random().toString(10).slice(2, 8)}-${String(Date.now()).slice(-4)}`;
      const invoiceNumber = `INV-${Math.random().toString(10).slice(2, 7)}-${String(Date.now()).slice(-5)}`;
      const today = new Date();
      const renewal = new Date(today);
      renewal.setFullYear(renewal.getFullYear() + 1);

      const purchases = load("purchases", []);
      const payments = load("payments", []);

      purchases.unshift({
        id: purchaseId,
        policyId: policy.id,
        policyNumber,
        invoiceNumber,
        amount: total,
        premium,
        gst,
        paymentMethod,
        paymentGateway: enabledPaymentGateways.find((gateway) => gateway.id === paymentMethod)?.name || paymentMethod,
        status: "Active",
        activatedAt: today.toISOString(),
        renewalAt: renewal.toISOString(),
        userSnapshot: { fullName: form.fullName, email: form.email, phone: form.phone },
        nominee: { name: form.nomineeName, relation: form.nomineeRelation },
        address: { line1: form.addressLine1, city: form.city, state: form.state, pincode: form.pincode },
        kyc: {
          aadhaar: form.aadhaarDocName,
          pan: form.panDocName,
          addressProof: form.addressProofName,
          applicantPhoto: form.photoName,
          bankPassbook: form.bankPassbookName,
          otherDocument: form.otherDocName,
        },
        policyForm: { type: dynamicFormType, answers: dynamicAnswers },
        addOns: selectedAddOns,
        adminReviewStatus: "Pending Review",
      });

      payments.unshift({
        id: uid("pay"),
        purchaseId,
        invoiceNumber,
        amount: total,
        method: enabledPaymentGateways.find((gateway) => gateway.id === paymentMethod)?.name || paymentMethod,
        status: "Success",
        createdAt: today.toISOString(),
      });

      save("purchases", purchases);
      save("payments", payments);
      addUserNotification({
        userId: user?.id || "",
        userEmail: form.email,
        type: "payment-received",
        title: "Payment Received",
        body: `Payment of ${formatInr(total)} was received through ${enabledPaymentGateways.find((gateway) => gateway.id === paymentMethod)?.name || paymentMethod}. Policy ${policyNumber} is active.`,
        referenceId: invoiceNumber,
      });
      addUserNotification({
        userId: user?.id || "",
        userEmail: form.email,
        type: "policy-issued",
        title: "Policy Issued",
        body: `Your policy ${policyNumber} has been issued for ${policy.policyName}.`,
        referenceId: policyNumber,
      });

      navigate(`/payment/success?purchaseId=${encodeURIComponent(purchaseId)}`, { replace: true });
    } catch (e) {
      setError(e?.message || "Payment failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!policy) {
    return (
      <div className="min-h-[70vh] bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm sm:rounded-[2.5rem] sm:p-10">
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Checkout unavailable</h1>
          <p className="mt-2 text-slate-600">This policy does not exist.</p>
          <div className="mt-8">
            <Link to="/health-insurance" className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">
              Browse Plans
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700">
                <ShieldCheck size={16} className="text-blue-600" />
                Secure checkout • PCI-DSS aligned UX (demo)
              </div>
              <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Checkout</h1>
              <p className="mt-2 text-slate-600">Confirm details, upload KYC and complete payment.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-blue-600/10 px-4 py-3 text-xs font-black text-blue-700">
                <Lock size={16} />
                Encrypted session
              </span>
              <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600/10 px-4 py-3 text-xs font-black text-emerald-700">
                <BadgeCheck size={16} />
                Trusted payments
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1fr_420px]">
        <div className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8">
            <div className="text-sm font-black text-slate-900">Selected policy summary</div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: "Company", value: policy.company },
                { label: "Plan", value: policy.policyName },
                { label: "Coverage", value: policy.coverageLabel },
                { label: "Claim ratio", value: `${policy.claimSettlementRatio}%` },
              ].map((x) => (
                <div key={x.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="text-xs font-bold text-slate-500">{x.label}</div>
                  <div className="mt-2 text-sm font-black text-slate-900">{x.value}</div>
                </div>
              ))}
            </div>
          </div>

          {dynamicPolicyFields.length || availableAddOns.length ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <FileUp size={18} className="text-blue-600" />
                  {dynamicFormType === "vehicle" ? "Vehicle policy details" : "Health policy details"}
                </div>
                <span className="rounded-full bg-blue-600/10 px-3 py-2 text-xs font-black text-blue-700">
                  Admin configured
                </span>
              </div>

              {dynamicPolicyFields.length ? (
                <>
                  {/* Dynamic policy form fields come from Admin > Policy Forms and are validated before payment. */}
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {dynamicPolicyFields.map((field) => (
                      <label key={field.key} className={field.type === "textarea" ? "space-y-2 sm:col-span-2" : "space-y-2"}>
                        <span className="text-xs font-semibold text-slate-700">
                          {field.label}
                          {field.required ? " *" : ""}
                        </span>
                        {field.type === "select" ? (
                          <select
                            value={dynamicAnswers[field.key] || ""}
                            onChange={(e) => updateDynamicAnswer(field.key, e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-blue-500"
                          >
                            <option value="">Select {field.label}</option>
                            {(dynamicSelectOptions[field.key] || ["Yes", "No"]).map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field.type === "textarea" ? (
                          <textarea
                            value={dynamicAnswers[field.key] || ""}
                            onChange={(e) => updateDynamicAnswer(field.key, e.target.value)}
                            className="min-h-28 w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-blue-500"
                            placeholder={field.label}
                          />
                        ) : (
                          <input
                            type={field.type}
                            value={dynamicAnswers[field.key] || ""}
                            onChange={(e) => updateDynamicAnswer(field.key, e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-blue-500"
                            placeholder={field.label}
                          />
                        )}
                      </label>
                    ))}
                  </div>
                </>
              ) : null}

              {availableAddOns.length ? (
                <div className="mt-6">
                  {/* Add-on selections are saved with the purchase for policy issuance and future admin review. */}
                  <div className="text-xs font-black uppercase text-slate-500">
                    {dynamicFormType === "vehicle" ? "Vehicle Insurance Add-ons" : "Health Insurance Add-ons"}
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {availableAddOns.map((addOn) => {
                      const active = selectedAddOns.includes(addOn);
                      return (
                        <button
                          key={addOn}
                          type="button"
                          onClick={() => toggleAddOn(addOn)}
                          className={[
                            "rounded-2xl border px-4 py-3 text-left text-sm font-black shadow-sm transition",
                            active
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-200 bg-slate-50 text-slate-800 hover:bg-white",
                          ].join(" ")}
                        >
                          {addOn}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900">
              <User size={18} className="text-blue-600" />
              User details
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-semibold text-slate-700">Full Name</span>
                <input
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-blue-500"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-slate-700">Phone</span>
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-blue-500"
                  inputMode="numeric"
                />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-xs font-semibold text-slate-700">Email</span>
                <input
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-blue-500"
                />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900">
              <Sparkles size={18} className="text-blue-600" />
              Nominee details
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-semibold text-slate-700">Nominee Name</span>
                <input
                  value={form.nomineeName}
                  onChange={(e) => update("nomineeName", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-blue-500"
                  placeholder="e.g. Priya Sharma"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-slate-700">Relation</span>
                <select
                  value={form.nomineeRelation}
                  onChange={(e) => update("nomineeRelation", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-blue-500"
                >
                  {["Spouse", "Parent", "Child", "Sibling", "Other"].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900">
              <MapPin size={18} className="text-blue-600" />
              Address
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <span className="text-xs font-semibold text-slate-700">Address line</span>
                <input
                  value={form.addressLine1}
                  onChange={(e) => update("addressLine1", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-blue-500"
                  placeholder="House/Flat, street, landmark…"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-slate-700">City</span>
                <input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-blue-500"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-slate-700">State</span>
                <input
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-blue-500"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-slate-700">Pincode</span>
                <input
                  value={form.pincode}
                  onChange={(e) => update("pincode", e.target.value.replace(/[^\d]/g, "").slice(0, 6))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-blue-500"
                  inputMode="numeric"
                />
              </label>
              <div className="hidden sm:block" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900">
              <FileUp size={18} className="text-blue-600" />
              KYC and required documents
            </div>
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6">
              <div>
                <div className="text-sm font-black text-slate-900">Upload documents for admin review</div>
                <div className="mt-1 text-sm font-semibold text-slate-600">
                  Document names are stored as frontend checkout preview data for this demo.
                </div>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ["aadhaarDocName", "Aadhaar card", true],
                  ["panDocName", "PAN card", true],
                  ["addressProofName", "Address proof", true],
                  ["photoName", "Applicant photo", true],
                  ["bankPassbookName", "Bank passbook", ["life", "business"].includes(dynamicFormType)],
                  ["otherDocName", "Other required document", false],
                ].map(([key, label, required]) => (
                  <label key={key} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <span className="text-xs font-black text-slate-700">
                      {label}
                      {required ? " *" : ""}
                    </span>
                    <input
                      type="file"
                      className="mt-3 w-full text-xs font-semibold text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-xs file:font-black file:text-white"
                      onChange={(e) => update(key, e.target.files?.[0]?.name ?? "")}
                    />
                    {form[key] ? <div className="mt-2 truncate text-xs font-black text-blue-700">{form[key]}</div> : null}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="sticky top-28 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-6">
              <div className="text-sm font-black text-slate-900">Payment methods</div>
              <div className="mt-5 space-y-3">
                {enabledPaymentGateways.map((m) => {
                  const Icon = m.icon;
                  const active = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={[
                        "flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-left text-sm font-black shadow-sm transition",
                        active
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className={["grid h-10 w-10 place-items-center rounded-2xl", active ? "bg-white/15" : "bg-slate-100"].join(" ")}>
                          <Icon size={18} className={active ? "text-white" : "text-blue-600"} />
                        </span>
                        {m.label}
                      </span>
                      <span className={active ? "text-white/90" : "text-slate-400"}>●</span>
                    </button>
                  );
                })}
                {!enabledPaymentGateways.length ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm font-bold text-rose-700">
                    No payment gateway is currently enabled.
                  </div>
                ) : null}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-6"
            >
              <div className="text-sm font-black text-slate-900">Payment summary</div>
              <div className="mt-5 space-y-3 text-sm font-semibold text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Yearly premium</span>
                  <span className="font-black">{formatInr(premium)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">GST (18%)</span>
                  <span className="font-black">{formatInr(gst)}</span>
                </div>
                <div className="h-px bg-slate-200" />
                {selectedAddOns.length ? (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500">Selected add-ons</span>
                    <span className="max-w-[220px] text-right text-xs font-black text-slate-900">{selectedAddOns.join(", ")}</span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total payable</span>
                  <span className="text-lg font-black text-slate-900">{formatInr(total)}</span>
                </div>
              </div>

              {error ? (
                <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                  {error}
                </div>
              ) : null}

              <button
                disabled={busy || !enabledPaymentGateways.length}
                onClick={onPay}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-sm font-black text-white shadow-sm hover:opacity-95 disabled:opacity-70"
              >
                {busy ? "Processing payment…" : "Pay & Activate Policy"}
              </button>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">
                  PCI-DSS Security (demo) • Trust badges • Fraud checks
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                  Demo checkout only. No real payment is processed in this project.
                </div>
              </div>
            </motion.div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;

import { randomDigits } from "../../utils/ids";
import { readAdminPolicies, normalizeAdminPolicy, saveAdminPolicies } from "../../data/catalog";
import { claims, defaultPolicyPlans } from "./constants";

export const STORAGE_AUDIT_LOGS = "agile-admin-audit-logs";

export const makeUiId = (prefix, length = 6) => `${prefix}${randomDigits(length)}`;

export const readUploadedDocuments = () => [];

export const readSubmittedClaims = () => [];

export const readAdminClaims = () => {
  const submitted = readSubmittedClaims();
  return submitted.length ? [...submitted, ...claims.filter((claim) => !submitted.some((item) => item.id === claim.id))] : claims;
};

export const readRealUsers = () => [];

export const readSupportChats = () => [];

export const saveAdmins = () => {};

export const saveAuditLogs = () => {};

export const saveSupportChats = () => {};

export const loadAdmins = () => [
  {
    adminId: "ADM-SUPER-001",
    password: "Super@123",
    profilePhoto: "",
    name: "Asha Menon",
    email: "asha.admin@agileinsure.in",
    role: "Super Admin",
    initials: "AM",
    access: "Full platform access",
  },
  {
    adminId: "ADM-MGR-002",
    password: "Manager@123",
    profilePhoto: "",
    name: "Rohit Kapoor",
    email: "rohit.manager@agileinsure.in",
    role: "Insurance Manager",
    initials: "RK",
    access: "Policies, users, requirements",
  },
  {
    adminId: "ADM-CLM-003",
    password: "Claims@123",
    profilePhoto: "",
    name: "Naina Shah",
    email: "naina.claims@agileinsure.in",
    role: "Claims Officer",
    initials: "NS",
    access: "Claims and document review",
  },
  {
    adminId: "ADM-SUP-004",
    password: "Support@123",
    profilePhoto: "",
    name: "Imran Ali",
    email: "imran.support@agileinsure.in",
    role: "Support Executive",
    initials: "IA",
    access: "Tickets and user replies",
  },
];

export const loadAuditLogs = () => [
  { id: "LOG-001", action: "ui/bridges/deploy", username: "asha.admin@agileinsure.in", initials: "AM", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "LOG-002", action: "ui/assets/create", username: "rohit.manager@agileinsure.in", initials: "RK", createdAt: new Date(Date.now() - 14400000).toISOString() },
  { id: "LOG-003", action: "ui/documents/verify", username: "naina.claims@agileinsure.in", initials: "NS", createdAt: new Date(Date.now() - 72000000).toISOString() },
];

export const readAdminPolicyRows = () => {
  const saved = readAdminPolicies();
  if (!saved.length) return defaultPolicyPlans;
  return saved.map((policy) => ({
    id: policy.id,
    name: policy.policyName,
    company: policy.company,
    categorySlug: policy.categorySlug,
    type: policy.categorySlug?.replace("-insurance", "").replace("car", "Vehicle") || "Health",
    coverage: policy.coverageLabel,
    premium: `INR ${policy.premiumYearly}/yr`,
    premiumYearly: policy.premiumYearly,
    offer: policy.aiBadge || "",
    duration: `${policy.validityYears || 1} year`,
    renewalDate: policy.renewalDate || "",
    themeColor: policy.themeColor || "#2563eb",
    state: policy.state || "Active",
  }));
};

export const readUserActivity = (user, adminClaims = []) => {
  const purchases = [];
  const payments = [];
  const documentsData = [];
  const allClaims = adminClaims.filter((claim) => {
    const claimUser = claim.user || claim.fullName || claim.name || "";
    const claimEmail = claim.email || "";
    return claimUser === user.name || claimEmail === user.email;
  });
  const allDocuments = documentsData;

  return {
    profile: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    address: user.address || "Not added",
    loginStatus: user.status,
    policiesPurchased: Array.isArray(purchases) ? purchases.length : 0,
    claimsSubmitted: allClaims.length,
    claimSummary: allClaims.length ? allClaims.map((claim) => `${claim.id || claim.claimId || "Claim"} - ${claim.policy || claim.policyName || "Policy"} - ${claim.status || "Submitted"}`).join("; ") : "No claims found for this user",
    paymentsMade: Array.isArray(payments) ? payments.filter((payment) => payment.status === "Success").length : 0,
    documentsUploaded: allDocuments.length,
    documents: allDocuments.length ? allDocuments.map((doc) => doc.name || doc.type || doc.fileName || "Document").join(", ") : "No uploaded documents found",
    recentActivity: user.status === "Logged In" ? "Currently logged in to the user portal" : "Registered user profile available",
  };
};

export const formatStructuredDetail = (value) => {
  if (typeof value === "string") return value;
  return Object.entries(value)
    .map(([key, item]) => {
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
      return `${label}: ${item}`;
    })
    .join("\n");
};

export const fileToDataUrl = (file, callback) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => callback(String(reader.result || ""));
  reader.readAsDataURL(file);
};

export const statusClass = (status) => {
  const value = String(status).toLowerCase();
  if (value.includes("approved") || value.includes("active") || value.includes("ready") || value.includes("logged in")) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  if (value.includes("reject") || value.includes("inactive") || value.includes("re-upload")) {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }
  if (value.includes("open") || value.includes("high") || value.includes("pending") || value.includes("review")) {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }
  return "bg-blue-50 text-blue-700 ring-blue-200";
};

export const rowKeyFor = (row) => row.id || row.name || row.user || row.type;

export const persistPolicyRows = (rows) => {
  const adminPolicies = rows.map((row) => normalizeAdminPolicy(row)).filter((row) => row.state !== "Draft");
  saveAdminPolicies(adminPolicies);
};

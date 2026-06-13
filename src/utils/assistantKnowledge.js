import { categories, getPolicyById, policies } from "../data/catalog";
import { load } from "./storage";

const compactPolicy = (policy) => ({
  id: policy.id,
  category: policy.categorySlug,
  company: policy.company,
  name: policy.policyName,
  monthlyPremium: policy.premiumLabel,
  yearlyPremium: policy.premiumYearly,
  coverage: policy.coverageLabel,
  claimSettlementRatio: `${policy.claimSettlementRatio}%`,
  type: policy.policyType,
  emiAvailable: policy.emiAvailable,
  familyCoverage: policy.familyCoverage,
  benefits: policy.keyBenefits,
});

const readSessionUser = () => {
  try {
    return JSON.parse(localStorage.getItem("agile_insurance_session_v1") || "{}")?.user || null;
  } catch {
    return null;
  }
};

// Builds local portal knowledge for the frontend assistant.
export const buildAssistantKnowledge = () => {
  const user = readSessionUser();
  const purchases = load("purchases", []);
  const payments = load("payments", []);
  const claims = load("claims", []);
  const documents = load("documents", []);

  const purchasedPolicies = purchases.map((purchase) => {
    const policy = getPolicyById(purchase.policyId);
    return {
      policyNumber: purchase.policyNumber,
      status: purchase.status,
      amount: purchase.amount,
      activatedAt: purchase.activatedAt,
      renewalAt: purchase.renewalAt,
      company: policy?.company,
      name: policy?.policyName,
      category: policy?.categorySlug,
    };
  });

  return {
    appName: "Agile Insurance / Agile Claim",
    allowedScope: [
      "insurance plans and policy catalog",
      "policy comparison and coverage details",
      "checkout and premium payments",
      "claim filing, claim tracking, claim documents, and claim status",
      "renewals, documents, KYC demo status, dashboard navigation, auth/login help",
      "contact support by mobile, email, and WhatsApp",
    ],
    refusalRule:
      "If the user asks about anything outside this insurance portal, reply briefly that you can only help with Agile Insurance portal topics.",
    contact: {
      mobile: "+91 98765 43210",
      email: "care@agileclaim.com",
      whatsapp: "+91 98765 43210",
      workingHours: "Mon-Sat, 9:00 AM - 7:00 PM",
      office: "Sector 44, Gurugram, Haryana",
    },
    routes: {
      dashboard: "/dashboard",
      policies: "/dashboard/policies",
      claims: "/dashboard/claims",
      payments: "/dashboard/payments",
      renewals: "/dashboard/renewals",
      documents: "/dashboard/documents",
      contact: "/dashboard/contact",
      profile: "/dashboard/profile",
      security: "/dashboard/security",
      buyHealthPolicy: "/health-insurance",
    },
    demoRules: {
      frontendOnly: "Auth, documents, claims, purchases, and payments are stored locally in the browser.",
      otp: "The demo registration OTP is 123456.",
      documents: "Uploaded documents are stored locally as frontend demo records.",
      payments: "Payments are mock/demo flows and do not charge real money.",
    },
    user: user ? { fullName: user.fullName, email: user.email, phone: user.phone } : null,
    catalogCategories: categories.map(({ slug, title, subtitle, companies }) => ({ slug, title, subtitle, companies })),
    featuredPolicies: policies.slice(0, 35).map(compactPolicy),
    dashboardData: {
      purchases: purchasedPolicies.slice(0, 12),
      payments: payments.slice(0, 12),
      claims: claims.slice(0, 12),
      documents: documents.map((doc) => ({ name: doc.name, createdAt: doc.createdAt, size: doc.size })).slice(0, 12),
    },
  };
};

import { API_ENDPOINTS } from "./api";

// Backend contract notes for the Node.js/Express team.
// Keep this file updated when frontend payload shapes change.
export const backendContracts = {
  policyApplication: {
    endpoint: API_ENDPOINTS.purchases,
    method: "POST",
    payload: {
      policyId: "string",
      userSnapshot: "{ fullName, email, phone }",
      nominee: "{ name, relation }",
      address: "{ line1, city, state, pincode }",
      kyc: "{ aadhaar, pan, addressProof, applicantPhoto, bankPassbook, otherDocument }",
      policyForm: "{ type, answers }",
      addOns: "string[]",
      paymentGateway: "Razorpay | Stripe | PayPal | Bank Transfer",
    },
  },
  adminPolicy: {
    endpoint: API_ENDPOINTS.policies,
    method: "POST/PUT",
    payload: {
      categorySlug: "health-insurance | car-insurance | term-insurance | life-insurance | travel-insurance | home-insurance | business-insurance",
      policyName: "string",
      company: "string",
      premiumYearly: "number",
      coverageAmount: "number",
      offer: "string",
      renewalDate: "YYYY-MM-DD",
      themeColor: "hex color",
      state: "Draft | Active | Inactive",
    },
  },
  notification: {
    endpoint: API_ENDPOINTS.notifications,
    method: "POST",
    payload: {
      userId: "string",
      userEmail: "string",
      type: "payment-received | policy-issued | claim-submitted | claim-approved | claim-rejected",
      title: "string",
      body: "string",
      referenceId: "policy/claim/payment id",
    },
  },
};

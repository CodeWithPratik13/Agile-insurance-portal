// UI-only configuration defaults for admin settings and customer-facing feature gates.

// System module flags control which major insurance workflows are available in the portal.
export const systemConfigurationDefaults = {
  claimsModule: true,
  quotesModule: true,
  policyRenewal: true,
  agentPortal: true,
  customerPortal: true,
  emailNotifications: true,
  smsNotifications: true,
  auditLogging: true,
  multiHospitalSupport: true,
};

// Notification templates are editable message bodies that can later be connected to email/SMS providers.
export const notificationTemplateDefaults = [
  { key: "policyIssued", name: "Policy Issued", channel: "Email + SMS", subject: "Your policy has been issued", body: "Dear {{customerName}}, policy {{policyNumber}} is now active." },
  { key: "policyApproved", name: "Policy Approved", channel: "Email", subject: "Policy approved", body: "Your policy request has been approved by the operations team." },
  { key: "claimSubmitted", name: "Claim Submitted", channel: "Email + SMS", subject: "Claim received", body: "Claim {{claimId}} has been submitted and is under review." },
  { key: "claimApproved", name: "Claim Approved", channel: "Email + SMS", subject: "Claim approved", body: "Claim {{claimId}} has been approved for payout processing." },
  { key: "claimRejected", name: "Claim Rejected", channel: "Email", subject: "Claim update", body: "Claim {{claimId}} could not be approved. Please review the reason shared by support." },
  { key: "paymentReceived", name: "Payment Received", channel: "Email + SMS", subject: "Payment received", body: "Payment of {{amount}} has been received for invoice {{invoiceNumber}}." },
  { key: "renewalReminder", name: "Renewal Reminder", channel: "Email + SMS", subject: "Policy renewal reminder", body: "Policy {{policyNumber}} renews on {{renewalDate}}. Renew early to avoid a lapse." },
];

// Payment gateway configuration drives checkout method visibility and future provider credential forms.
export const paymentGatewayDefaults = [
  { key: "razorpay", name: "Razorpay", enabled: true, mode: "Test", merchantId: "rzp_test_agile", settlement: "T+2", methodId: "razorpay" },
  { key: "stripe", name: "Stripe", enabled: true, mode: "Test", merchantId: "acct_agile_demo", settlement: "T+3", methodId: "stripe" },
  { key: "paypal", name: "PayPal", enabled: true, mode: "Sandbox", merchantId: "paypal-agile-demo", settlement: "T+3", methodId: "paypal" },
  { key: "bankTransfer", name: "Bank Transfer", enabled: true, mode: "Manual", merchantId: "AGILE-BANK-001", settlement: "Manual review", methodId: "bankTransfer" },
];

// Dynamic policy forms power the admin form builder and can be mapped to actual quote forms later.
export const policyFormDefaults = {
  health: [
    { key: "age", label: "Age", type: "number", required: true },
    { key: "gender", label: "Gender", type: "select", required: true },
    { key: "occupation", label: "Occupation", type: "text", required: true },
    { key: "existingDiseases", label: "Existing Diseases", type: "textarea", required: false },
  ],
  vehicle: [
    { key: "vehicleNumber", label: "Vehicle Number", type: "text", required: true },
    { key: "engineNumber", label: "Engine Number", type: "text", required: true },
    { key: "model", label: "Model", type: "text", required: true },
    { key: "registrationDate", label: "Registration Date", type: "date", required: true },
  ],
  life: [
    { key: "age", label: "Age", type: "number", required: true },
    { key: "income", label: "Annual Income", type: "number", required: true },
    { key: "occupation", label: "Occupation", type: "text", required: true },
    { key: "smoker", label: "Smoker", type: "select", required: true },
  ],
  travel: [
    { key: "destination", label: "Destination", type: "text", required: true },
    { key: "tripStartDate", label: "Trip Start Date", type: "date", required: true },
    { key: "tripEndDate", label: "Trip End Date", type: "date", required: true },
    { key: "passportNumber", label: "Passport Number", type: "text", required: false },
  ],
  home: [
    { key: "propertyAddress", label: "Property Address", type: "textarea", required: true },
    { key: "propertyType", label: "Property Type", type: "select", required: true },
    { key: "propertyValue", label: "Property Value", type: "number", required: true },
    { key: "ownershipType", label: "Ownership Type", type: "select", required: true },
  ],
  business: [
    { key: "businessName", label: "Business Name", type: "text", required: true },
    { key: "gstNumber", label: "GST Number", type: "text", required: true },
    { key: "industry", label: "Industry", type: "text", required: true },
    { key: "employeeCount", label: "Employee Count", type: "number", required: true },
  ],
};

// Insurance feature add-ons are shown in admin settings and can be applied to generated policies.
export const policyFeatureDefaults = {
  health: ["ICU Cover", "OPD Cover", "Dental Cover", "Maternity Cover"],
  vehicle: ["Zero Depreciation", "Roadside Assistance", "Engine Protection"],
  life: ["Critical Illness Rider", "Accidental Death Benefit", "Premium Waiver"],
  travel: ["Baggage Protection", "Trip Cancellation", "Emergency Medical Evacuation"],
  home: ["Content Cover", "Earthquake Cover", "Theft Protection"],
  business: ["Fire Cover", "Cyber Liability", "Employee Protection"],
};

// Returns static UI defaults for this frontend-only build.
export const readSystemSettings = () => {
  return {
    modules: {
      configuration: {
        ...systemConfigurationDefaults,
      },
      notifications: {
        templates: notificationTemplateDefaults,
        emailEnabled: true,
        smsEnabled: true,
      },
      payment: {
        gateways: paymentGatewayDefaults,
      },
      forms: {
        policyForms: policyFormDefaults,
      },
      features: {
        policyFeatures: policyFeatureDefaults,
      },
    },
  };
};

// No-op placeholder so admin UI controls remain interactive without persistence.
export const saveSystemSettings = () => {};

// Lightweight getter for customer pages that only need one switch or structured config.
export const getModuleSetting = (moduleId, settingKey, fallback) => {
  const settings = readSystemSettings();
  return settings.modules?.[moduleId]?.[settingKey] ?? fallback;
};

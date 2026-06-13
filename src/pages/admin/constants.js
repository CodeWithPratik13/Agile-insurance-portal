import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Edit3,
  FileText,
  Headphones,
  KeyRound,
  LayoutDashboard,
  LineChart,
  Lock,
  MessageSquare,
  Plus,
  ScrollText,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  XCircle,
  Smartphone,
} from "lucide-react";
import {
  notificationTemplateDefaults,
  paymentGatewayDefaults,
  policyFeatureDefaults,
  policyFormDefaults,
  systemConfigurationDefaults,
} from "../../utils/systemSettings";

export const defaultAdminProfiles = [
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

export const defaultAuditLogs = [
  { id: "LOG-001", action: "ui/bridges/deploy", username: "asha.admin@agileinsure.in", initials: "AM", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "LOG-002", action: "ui/assets/create", username: "rohit.manager@agileinsure.in", initials: "RK", createdAt: new Date(Date.now() - 14400000).toISOString() },
  { id: "LOG-003", action: "ui/documents/verify", username: "naina.claims@agileinsure.in", initials: "NS", createdAt: new Date(Date.now() - 72000000).toISOString() },
];

export const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Super Admin", "Insurance Manager", "Claims Officer", "Support Executive"] },
  { id: "users", label: "User Management", icon: Users, roles: ["Super Admin", "Insurance Manager"] },
  { id: "claims", label: "Claims Management", icon: ClipboardCheck, roles: ["Super Admin", "Claims Officer"] },
  { id: "requirements", label: "Requirements", icon: BadgeCheck, roles: ["Super Admin", "Insurance Manager"] },
  { id: "support", label: "Support Center", icon: Headphones, roles: ["Super Admin", "Support Executive"] },
  { id: "policies", label: "Policy Management", icon: FileText, roles: ["Super Admin", "Insurance Manager"] },
  { id: "documents", label: "Document Verification", icon: ShieldCheck, roles: ["Super Admin", "Claims Officer"] },
  { id: "reports", label: "Reports & Analytics", icon: BarChart3, roles: ["Super Admin", "Insurance Manager"] },
  { id: "profile", label: "Admin Profile", icon: UserCog, roles: ["Super Admin", "Insurance Manager", "Claims Officer", "Support Executive"] },
  { id: "auditlog", label: "Audit Log", icon: ScrollText, roles: ["Super Admin", "Insurance Manager", "Claims Officer", "Support Executive"] },
  { id: "settings", label: "System Settings", icon: Settings, roles: ["Super Admin"] },
];

export const metrics = [
  { label: "Total Users", value: "24,860", change: "+12.4%", icon: Users, tone: "bg-blue-600", page: "users" },
  { label: "Active Policies", value: "18,204", change: "+8.1%", icon: FileText, tone: "bg-emerald-600", page: "policies" },
  { label: "Pending Claims", value: "326", change: "42 urgent", icon: AlertTriangle, tone: "bg-amber-500", page: "claims" },
  { label: "Approved Claims", value: "4,812", change: "+15.7%", icon: CheckCircle2, tone: "bg-teal-600", page: "claims" },
  { label: "Rejected Claims", value: "284", change: "-2.3%", icon: XCircle, tone: "bg-rose-600", page: "claims" },
  { label: "Open Support Tickets", value: "149", change: "31 high", icon: MessageSquare, tone: "bg-violet-600", page: "support" },
  { label: "Revenue Generated", value: "INR 8.42 Cr", change: "+18.2%", icon: CreditCard, tone: "bg-indigo-600", page: "reports" },
];

export const users = [
  { id: "USR1001", name: "Priya Sharma", email: "priya@example.com", phone: "+91 98765 43210", policies: 3, status: "Active", city: "Pune" },
  { id: "USR1002", name: "Rahul Verma", email: "rahul@example.com", phone: "+91 99887 77665", policies: 1, status: "Active", city: "Delhi" },
  { id: "USR1003", name: "Ananya Iyer", email: "ananya@example.com", phone: "+91 91234 56780", policies: 4, status: "Inactive", city: "Bengaluru" },
  { id: "USR1004", name: "Kabir Singh", email: "kabir@example.com", phone: "+91 95555 44112", policies: 2, status: "Active", city: "Mumbai" },
];

export const claims = [
  { id: "CLM001", user: "John Mathew", policy: "Health", amount: "INR 50,000", status: "Pending", officer: "Riya S." },
  { id: "CLM002", user: "Aarav Mehta", policy: "Car", amount: "INR 1,24,500", status: "Under Review", officer: "Nikhil P." },
  { id: "CLM003", user: "Meera Rao", policy: "Life", amount: "INR 7,50,000", status: "Approved", officer: "Fatima K." },
  { id: "CLM004", user: "Sana Khan", policy: "Travel", amount: "INR 82,000", status: "Documents", officer: "Dev A." },
];

export const tickets = [
  { id: "TKT001", user: "User A", subject: "Claim Issue", priority: "High", status: "Open" },
  { id: "TKT002", user: "User B", subject: "Premium payment failed", priority: "Medium", status: "In Progress" },
  { id: "TKT003", user: "User C", subject: "Policy document missing", priority: "Low", status: "Waiting for User" },
  { id: "TKT004", user: "User D", subject: "Advisor callback request", priority: "High", status: "Open" },
];

export const requirements = [
  { user: "Kabir S.", age: 34, budget: "INR 18,000", coverage: "INR 15L", status: "Quote Ready" },
  { user: "Nisha P.", age: 42, budget: "INR 30,000", coverage: "INR 25L", status: "Review" },
  { user: "Aditya R.", age: 29, budget: "INR 12,000", coverage: "INR 10L", status: "Consultation" },
];

export const documents = [
  { type: "Aadhaar", owner: "Priya Sharma", status: "Approved" },
  { type: "PAN", owner: "Rahul Verma", status: "Pending" },
  { type: "Driving License", owner: "Aarav Mehta", status: "Pending" },
  { type: "Medical Reports", owner: "Meera Rao", status: "Re-upload" },
  { type: "Claim Documents", owner: "Sana Khan", status: "Verification" },
];

export const defaultPolicyPlans = [
  { name: "Health Secure Plus", type: "Health", coverage: "INR 25L", premium: "INR 1,850/mo", duration: "1 year", state: "Active" },
  { name: "Drive Shield Elite", type: "Motor", coverage: "IDV based", premium: "INR 9,600/yr", duration: "1 year", state: "Active" },
  { name: "Term Life Max", type: "Life", coverage: "INR 1 Cr", premium: "INR 1,120/mo", duration: "30 years", state: "Draft" },
  { name: "Travel Global Care", type: "Travel", coverage: "USD 100K", premium: "INR 2,400/trip", duration: "Trip", state: "Inactive" },
];

export const claimSteps = ["Submitted", "Under Review", "Document Verification", "Approved / Rejected", "Payment Processing", "Completed"];

export const pageTitles = {
  dashboard: "Admin Dashboard",
  users: "User Management",
  claims: "Claims Management",
  requirements: "Requirement Management",
  support: "Support Center",
  policies: "Policy Management",
  documents: "Document Verification",
  notifications: "Notification Center",
  reports: "Reports & Analytics",
  "report-detail": "Report Detail",
  profile: "Admin Profile",
  auditlog: "Audit Log",
  settings: "System Settings",
  "setting-detail": "System Setting",
};

export const adminSettingCards = [
  { id: "general", title: "General Setting", description: "Configure the fundamental information of the site.", icon: Settings },
  { id: "branding", title: "Logo and Favicon", description: "Upload your logo and favicon here.", icon: LayoutDashboard },
  { id: "configuration", title: "System Configuration", description: "Enable or disable core modules, portals, audit logging, and multi-hospital operations.", icon: UserCog },
  { id: "notifications", title: "Notification Setting", description: "Manage email/SMS switches and production notification templates.", icon: Bell },
  { id: "payment", title: "Payment Gateways", description: "Configure Razorpay, Stripe, PayPal, and Bank Transfer for checkout.", icon: CreditCard },
  { id: "withdrawals", title: "Withdrawals Methods", description: "Set up manual withdrawal methods for payout requests.", icon: KeyRound },
  { id: "forms", title: "Policy Forms", description: "Build dynamic Health and Vehicle policy creation forms.", icon: ClipboardCheck },
  { id: "features", title: "Manage Features", description: "Manage Health and Vehicle insurance add-ons.", icon: Edit3 },
  { id: "regulations", title: "Policy Regulations", description: "Define what will and will not be covered in plans.", icon: AlertTriangle },
  { id: "seo", title: "SEO Configuration", description: "Configure meta title, description, and keywords.", icon: LineChart },
  { id: "frontend", title: "Manage Frontend", description: "Control all frontend contents of the system.", icon: Smartphone },
  { id: "pages", title: "Manage Pages", description: "Control dynamic and static pages of the system.", icon: FileText },
  { id: "kyc", title: "KYC Setting", description: "Configure client information fields.", icon: ShieldCheck },
  { id: "social", title: "Social Login Setting", description: "Provide required social login information.", icon: Users },
  { id: "language", title: "Language", description: "Configure languages and keywords to localize the system.", icon: MessageSquare },
  { id: "extensions", title: "Extensions", description: "Manage extensions of the system.", icon: Plus },
  { id: "policyPages", title: "Policy Pages", description: "Configure policy and terms of the system.", icon: Lock },
  { id: "maintenance", title: "Maintenance Mode", description: "Enable or disable maintenance mode when required.", icon: Settings },
  { id: "cookie", title: "GDPR Cookie", description: "Set GDPR cookie policy for visitors.", icon: CheckCircle2 },
  { id: "css", title: "Custom CSS", description: "Write custom CSS for frontend styles.", icon: FileText },
  { id: "sitemap", title: "Sitemap XML", description: "Insert sitemap XML to enhance SEO performance.", icon: LayoutDashboard },
  { id: "robots", title: "Robots txt", description: "Insert robots.txt content for web crawlers.", icon: FileText },
];

export const settingFieldGroups = {
  general: [
    { name: "companyName", label: "Company Name", type: "text", defaultValue: "Agile Insurance" },
    { name: "supportEmail", label: "Support Email", type: "text", defaultValue: "support@agileinsure.in" },
    { name: "supportPhone", label: "Support Phone", type: "text", defaultValue: "+91 98765 43210" },
    { name: "serviceTaxRate", label: "Service Tax Rate (%)", type: "number", defaultValue: 18 },
  ],
  branding: [
    { name: "logo", label: "Logo", type: "file", accept: "image/*", defaultValue: "" },
    { name: "favicon", label: "Favicon", type: "file", accept: "image/*", defaultValue: "" },
    { name: "brandColor", label: "Brand Color", type: "color", defaultValue: "#2563eb" },
  ],
  configuration: [
    { name: "claimsModule", label: "Enable Claims Module", type: "boolean", defaultValue: systemConfigurationDefaults.claimsModule },
    { name: "quotesModule", label: "Enable Quotes Module", type: "boolean", defaultValue: systemConfigurationDefaults.quotesModule },
    { name: "policyRenewal", label: "Enable Policy Renewal", type: "boolean", defaultValue: systemConfigurationDefaults.policyRenewal },
    { name: "agentPortal", label: "Enable Agent Portal", type: "boolean", defaultValue: systemConfigurationDefaults.agentPortal },
    { name: "customerPortal", label: "Enable Customer Portal", type: "boolean", defaultValue: systemConfigurationDefaults.customerPortal },
    { name: "emailNotifications", label: "Enable Email Notifications", type: "boolean", defaultValue: systemConfigurationDefaults.emailNotifications },
    { name: "smsNotifications", label: "Enable SMS Notifications", type: "boolean", defaultValue: systemConfigurationDefaults.smsNotifications },
    { name: "auditLogging", label: "Enable Audit Logging", type: "boolean", defaultValue: systemConfigurationDefaults.auditLogging },
    { name: "multiHospitalSupport", label: "Enable Multi-Hospital Support", type: "boolean", defaultValue: systemConfigurationDefaults.multiHospitalSupport },
  ],
  notifications: [
    { name: "emailEnabled", label: "Email Notifications", type: "boolean", defaultValue: true },
    { name: "smsEnabled", label: "SMS Notifications", type: "boolean", defaultValue: true },
    { name: "renewalReminderDays", label: "Renewal Reminder Days", type: "number", defaultValue: 15 },
    { name: "templates", label: "Notification Templates", type: "templateList", defaultValue: notificationTemplateDefaults },
  ],
  payment: [
    { name: "gateways", label: "Gateway Configurations", type: "gatewayList", defaultValue: paymentGatewayDefaults },
    { name: "minimumPayment", label: "Minimum Payment", type: "number", defaultValue: 500 },
  ],
  withdrawals: [
    { name: "bankTransfer", label: "Bank Transfer", type: "boolean", defaultValue: true },
    { name: "upiPayout", label: "UPI Payout", type: "boolean", defaultValue: true },
    { name: "minimumWithdrawal", label: "Minimum Withdrawal", type: "number", defaultValue: 1000 },
    { name: "payoutNote", label: "Payout Instructions", type: "textarea", defaultValue: "Verify bank details before approving payouts." },
  ],
  forms: [
    { name: "policyForms", label: "Dynamic Policy Creation Forms", type: "policyFormBuilder", defaultValue: policyFormDefaults },
  ],
  features: [
    { name: "aiAssistant", label: "AI Assistant", type: "boolean", defaultValue: true },
    { name: "policyCompare", label: "Policy Compare", type: "boolean", defaultValue: true },
    { name: "claimTracking", label: "Claim Tracking", type: "boolean", defaultValue: true },
    { name: "policyFeatures", label: "Insurance Feature Add-ons", type: "featureMatrix", defaultValue: policyFeatureDefaults },
  ],
  regulations: [
    { name: "coveredItems", label: "Covered Items", type: "textarea", defaultValue: "Hospitalization, accident damage, policy benefits, verified expenses" },
    { name: "excludedItems", label: "Excluded Items", type: "textarea", defaultValue: "Fraudulent claims, expired policies, missing documents" },
    { name: "highValueReviewAmount", label: "High Value Review Amount", type: "number", defaultValue: 100000 },
  ],
  seo: [
    { name: "metaTitle", label: "Meta Title", type: "text", defaultValue: "Agile Insurance Portal" },
    { name: "metaDescription", label: "Meta Description", type: "textarea", defaultValue: "Compare, buy, and manage insurance policies online." },
    { name: "keywords", label: "Meta Keywords", type: "textarea", defaultValue: "insurance, claims, policy, health insurance, car insurance" },
  ],
  frontend: [
    { name: "heroTitle", label: "Home Hero Title", type: "text", defaultValue: "Smart Insurance for Every Need" },
    { name: "primaryCta", label: "Primary CTA", type: "text", defaultValue: "Explore Policies" },
    { name: "showTestimonials", label: "Show Testimonials", type: "boolean", defaultValue: true },
  ],
  pages: [
    { name: "aboutPage", label: "About Page", type: "boolean", defaultValue: true },
    { name: "contactPage", label: "Contact Page", type: "boolean", defaultValue: true },
    { name: "articlesPage", label: "Articles Page", type: "boolean", defaultValue: true },
    { name: "pageNotice", label: "Page Notice", type: "textarea", defaultValue: "Static pages are managed by the admin team." },
  ],
  kyc: [
    { name: "aadhaarRequired", label: "Aadhaar Required", type: "boolean", defaultValue: true },
    { name: "panRequired", label: "PAN Required", type: "boolean", defaultValue: true },
    { name: "selfieRequired", label: "Selfie Required", type: "boolean", defaultValue: false },
    { name: "autoRejectIncomplete", label: "Auto Reject Incomplete KYC", type: "boolean", defaultValue: false },
  ],
  social: [
    { name: "googleLogin", label: "Google Login", type: "boolean", defaultValue: true },
    { name: "facebookLogin", label: "Facebook Login", type: "boolean", defaultValue: false },
    { name: "clientId", label: "OAuth Client ID", type: "text", defaultValue: "" },
  ],
  language: [
    { name: "defaultLanguage", label: "Default Language", type: "select", defaultValue: "English", options: ["English", "Hindi", "Tamil", "Bengali"] },
    { name: "multiLanguage", label: "Enable Multi Language", type: "boolean", defaultValue: false },
    { name: "customLabels", label: "Custom Labels", type: "textarea", defaultValue: "claim=Claim\npolicy=Policy\nsupport=Support" },
  ],
  extensions: [
    { name: "analytics", label: "Analytics Extension", type: "boolean", defaultValue: true },
    { name: "chatbot", label: "Chatbot Extension", type: "boolean", defaultValue: true },
    { name: "documentScanner", label: "Document Scanner", type: "boolean", defaultValue: false },
  ],
  policyPages: [
    { name: "terms", label: "Terms and Conditions", type: "textarea", defaultValue: "Policy terms are subject to verification and approval." },
    { name: "privacy", label: "Privacy Policy", type: "textarea", defaultValue: "Customer data is stored securely for insurance operations." },
  ],
  maintenance: [
    { name: "enabled", label: "Maintenance Mode", type: "boolean", defaultValue: false },
    { name: "message", label: "Maintenance Message", type: "textarea", defaultValue: "The portal is temporarily under maintenance. Please check back soon." },
  ],
  cookie: [
    { name: "enabled", label: "GDPR Cookie Banner", type: "boolean", defaultValue: true },
    { name: "message", label: "Cookie Message", type: "textarea", defaultValue: "We use cookies to improve your insurance portal experience." },
  ],
  css: [
    { name: "customCss", label: "Custom CSS", type: "textarea", defaultValue: "body { scroll-behavior: smooth; }" },
  ],
  sitemap: [
    { name: "xml", label: "Sitemap XML", type: "textarea", defaultValue: "<urlset><url><loc>https://agileinsure.in/</loc></url></urlset>" },
  ],
  robots: [
    { name: "content", label: "Robots.txt Content", type: "textarea", defaultValue: "User-agent: *\nAllow: /\nSitemap: https://agileinsure.in/sitemap.xml" },
  ],
};

const TOKEN_KEY = "agile_insurance_api_token_v1";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Auth token helpers. Express backend can return this token from POST /api/auth/login or /api/auth/verify-otp.
export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

// Central endpoint map for the Node/Express team. Keep page components pointed at services/helpers, not hardcoded URLs.
export const API_ENDPOINTS = {
  auth: {
    register: "/api/auth/register",
    verifyOtp: "/api/auth/verify-otp",
    login: "/api/auth/login",
    google: "/api/auth/google",
    me: "/api/auth/me",
  },
  policies: "/api/policies",
  policyById: (id) => `/api/policies/${id}`,
  purchases: "/api/purchases",
  claims: "/api/claims",
  claimById: (id) => `/api/claims/${id}`,
  payments: "/api/payments",
  notifications: "/api/notifications",
  documents: "/api/documents",
  settings: "/api/admin/settings",
};

// Backend-ready fetch wrapper. Current screens still fall back to localStorage until API_BASE_URL is configured.
export const apiRequest = async (endpoint, options = {}) => {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured. Frontend is using local demo storage.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.message || payload?.error || "API request failed.");
  return payload;
};

export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });

export const fileToBase64 = async (file) => {
  const dataUrl = await fileToDataUrl(file);
  return dataUrl.split(",")[1] || "";
};

const readOpenAiText = (payload) => {
  if (payload?.output_text) return payload.output_text;
  const parts = payload?.output?.flatMap((item) => item?.content || []) || [];
  return parts.map((part) => part?.text || "").filter(Boolean).join("\n").trim();
};

// Browser OpenAI calls are useful for demos, but production apps should proxy this through a secure server.
export const openAiChat = async ({ message, history = [], contextLabel = "Agile AI", systemContext = null }) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Add VITE_OPENAI_API_KEY to your frontend environment to enable OpenAI chat.");
  }

  const model = import.meta.env.VITE_OPENAI_MODEL || "gpt-5.5";
  const conversation = history
    .slice(-8)
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
    .join("\n");
  const portalKnowledge = systemContext ? JSON.stringify(systemContext, null, 2) : "{}";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      instructions:
        [
          "You are Agile AI, the insurance assistant for the Agile Insurance / Agile Claim portal.",
          "Answer only questions related to this insurance system: policies, policy comparison, coverage, premiums, checkout, payments, claims, renewals, documents, KYC demo status, dashboard navigation, profile/security settings, and contact support.",
          "If the user asks about unrelated topics, refuse briefly: 'I can only help with Agile Insurance portal questions like policies, claims, payments, renewals, documents, or support.'",
          "Use the provided portal knowledge as your source of truth. Do not invent policy terms, prices, account records, payment status, or claim status not present in the context.",
          "For legal, medical, financial, or claim approval decisions, give general portal guidance and tell the user to contact support.",
          "Keep answers concise, practical, and step-by-step when explaining portal actions.",
        ].join(" "),
      input: [
        `Portal knowledge:\n${portalKnowledge}`,
        conversation ? `Conversation so far:\n${conversation}` : `Start a new ${contextLabel} conversation.`,
        `User message: ${message}`,
      ].join("\n\n"),
      max_output_tokens: 500,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message || "OpenAI chat request failed.");
  }

  return readOpenAiText(payload) || "I could not produce an answer. Please try again.";
};

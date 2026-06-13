import { useMemo, useState } from "react";
import { Bot, Headphones, HelpCircle, PhoneCall, ShieldCheck, Sparkles, Ticket, Volume2 } from "lucide-react";

// AI Support page suggestions, helper headings, emergency CTA text, and support cards are controlled here.
const DashboardAiSupport = () => {
  const [query, setQuery] = useState("");
  const suggestions = useMemo(
    () => [
      "My payment failed but money was debited. What should I do?",
      "What documents are needed for cashless claims?",
      "How do I upload KYC or policy documents?",
      "How can I compare plans and choose the best coverage?",
    ],
    [],
  );

  const askAssistant = (value) => {
    const cleanValue = value.trim();
    if (!cleanValue) return;
    window.dispatchEvent(new CustomEvent("agile-ai-prompt", { detail: { text: cleanValue } }));
    setQuery("");
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400" />
              AI support assistant - OpenAI - Portal-aware help
            </div>
            <h1 className="mt-6 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              AI Support
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Ask about insurance, claims, payment issues, documents, account access, or how to use the portal.
            </p>
          </div>
          <button
            onClick={() => askAssistant("I need emergency assistance. What should I do in this portal?")}
            className="rounded-2xl bg-rose-600 px-7 py-4 text-sm font-black text-white shadow-sm hover:opacity-95"
          >
            Emergency assistance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-slate-100">
            <HelpCircle size={18} className="text-blue-600 dark:text-blue-400" />
            Smart FAQ suggestions
          </div>
          <div className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Click a suggestion to ask the AI assistant.
          </div>
          <div className="mt-6 space-y-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => askAssistant(s)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-left text-sm font-semibold text-slate-700 shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-5 text-white shadow-[0_40px_120px_rgba(2,6,23,0.35)] dark:border-white/10 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white/70">Support channels</div>
              <div className="mt-2 text-2xl font-black tracking-tight">Enterprise-grade assistance</div>
              <div className="mt-2 text-sm font-semibold text-white/70">
                The AI can guide users through support channels, payment help, claims, renewals, and document tasks.
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-xs font-black">
              <Sparkles size={16} />
              Premium
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { t: "Voice support", icon: Volume2 },
              { t: "WhatsApp support", icon: PhoneCall },
              { t: "Live agent", icon: Headphones },
              { t: "Raise ticket", icon: Ticket },
            ].map((x) => {
              const Icon = x.icon;
              return (
                <button
                  key={x.t}
                  onClick={() => askAssistant(`Help me with ${x.t}. What are my options in this portal?`)}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
                      <Icon size={18} />
                    </span>
                    <div className="text-sm font-black">{x.t}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 text-sm font-black">
              <Bot size={18} />
              AI quick prompt
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") askAssistant(query);
                }}
                placeholder="Type a question to ask Agile AI..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-white/50"
              />
              <button
                onClick={() => askAssistant(query)}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-black text-white hover:opacity-95"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAiSupport;

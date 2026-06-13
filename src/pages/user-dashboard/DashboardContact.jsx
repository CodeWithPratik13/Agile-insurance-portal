import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  Send,
  ShieldCheck,
  Bot,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../../contexts/useAuth";

// Support chat storage key in localStorage for persistence — shared with AdminPage
const SUPPORT_CHAT_KEY = "agile_insurance_support_chats_v1";

// Utility to safely parse JSON from localStorage
const safeJsonParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Load all support chats from localStorage
const readChats = () => {
  const chats = safeJsonParse(localStorage.getItem(SUPPORT_CHAT_KEY), []);
  return Array.isArray(chats) ? chats : [];
};

// Save all support chats to localStorage
const saveChats = (chats) => {
  localStorage.setItem(SUPPORT_CHAT_KEY, JSON.stringify(chats));
};

// Contact information displayed on the contact page
const contactDetails = [
  {
    label: "Mobile number",
    value: "+91 79726 57424",
    helper: "Available for policy, claim, renewal, and account support.",
    icon: PhoneCall,
    href: "tel:+917972657424",
  },
  {
    label: "Email address",
    value: "contact@kshetrapati.com",
    helper: "Send documents, payment issues, or service requests anytime.",
    icon: Mail,
    href: "mailto:contact@kshetrapati.com",
  },
  {
    label: "WhatsApp support",
    value: "+91 79726 57424",
    helper: "Chat with support for quick claim, payment, and renewal updates.",
    icon: FaWhatsapp,
    href: "https://wa.me/917972657424?text=Hi%20Support%2C%20I%20need%20help%20with%20my%20insurance%20account.",
  },
];

// Quick reply suggestions shown below the chat input
const quickReplies = [
  "I need help with my policy",
  "How do I file a claim?",
  "My payment is not going through",
  "I want to renew my policy",
];

// Main contact dashboard component
const DashboardContact = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState(() => readChats());
  const [subject, setSubject] = useState("Policy support");
  const [message, setMessage] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);

  // Filter chats for current user thread
  const userThread = useMemo(
    () => chats.filter((chat) => chat.userEmail === user?.email),
    [chats, user?.email],
  );

  // Get the latest open or most recent chat for this user
  const activeChat = useMemo(() => {
    if (!userThread.length) return null;
    const open = userThread.find((chat) => chat.status !== "Resolved");
    return open || userThread[0];
  }, [userThread]);

  // Flatten all messages from the user's thread into a single timeline
  const allMessages = useMemo(() => {
    if (!activeChat) return [];
    return activeChat.messages;
  }, [activeChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [allMessages]);

  // Send message handler - creates new chat or adds to existing thread
  const sendMessage = () => {
    const text = message.trim();
    if (!text) return;

    const nextMessage = {
      id: `msg_${Date.now()}`,
      from: "user",
      sender: user?.fullName || "Customer",
      text,
      createdAt: new Date().toISOString(),
    };

    const existing = chats.find(
      (chat) => chat.userEmail === user?.email && chat.status !== "Resolved",
    );

    const nextChats = existing
      ? chats.map((chat) =>
          chat.id === existing.id
            ? {
                ...chat,
                subject,
                status: "Open",
                messages: [...chat.messages, nextMessage],
                updatedAt: new Date().toISOString(),
              }
            : chat,
        )
      : [
          {
            id: `chat_${Date.now()}`,
            userId: user?.id,
            userName: user?.fullName || "Customer",
            userEmail: user?.email || "guest@agile.insurance",
            subject,
            priority: "Medium",
            status: "Open",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [nextMessage],
          },
          ...chats,
        ];

    setChats(nextChats);
    saveChats(nextChats);
    setMessage("");
    setShowQuickReplies(false);
  };

  const handleQuickReply = (text) => {
    setMessage(text);
    setShowQuickReplies(false);
    // Auto-send after a short delay so user sees the text populate
    setTimeout(() => {
      setMessage(text);
    }, 0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400" />
              Customer support
            </div>
            <h1 className="mt-6 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Contact Us
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Reach Agile Claim support for policy purchases, active claims, renewals, payments, and account help.
            </p>
          </div>

          <a
            href="https://wa.me/917972657424?text=Hi%20Support%2C%20I%20need%20help%20with%20my%20insurance%20account."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-sm font-black text-white shadow-sm hover:opacity-95"
          >
            <FaWhatsapp size={18} />
            Start chat on WhatsApp
          </a>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {contactDetails.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("https://wa.me") ? "_blank" : undefined}
              rel={item.href.startsWith("https://wa.me") ? "noreferrer" : undefined}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 sm:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                  <Icon size={22} />
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {item.label}
                  </div>
                  <div className="mt-2 break-words text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
                    {item.value}
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">{item.helper}</p>
                </div>
              </div>
            </a>
          );
        })}
      </section>

      {/* Info Cards */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {[
          { title: "Working hours", value: "Mon-Sat, 9:00 AM - 7:00 PM", icon: Clock3 },
          { title: "Quick message", value: "Reply within 24 working hours", icon: MessageCircle },
          { title: "Office", value: "Office 101 & 102, Tower B1, Vishwakarma Business Centre, Wagholi, Pune - 412207", icon: MapPin },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5 sm:p-6"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-blue-600 shadow-sm dark:bg-white/10 dark:text-blue-300">
                  <Icon size={18} />
                </span>
                <div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{item.title}</div>
                  <div className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">{item.value}</div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Chat Section — Combined Chat Box */}
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5 overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
              <MessageCircle size={18} className="text-white" />
            </span>
            <div>
              <div className="text-sm font-black text-white">Chat with Admin Support Team</div>
              <div className="text-xs text-white/60">
                {activeChat?.status === "Resolved"
                  ? "This thread is resolved — start a new conversation"
                  : "We typically reply within 24 working hours"}
              </div>
            </div>
          </div>
          {activeChat && (
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
              #{activeChat.id?.slice(-6) || "New"}
            </span>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex flex-col" style={{ minHeight: "420px" }}>
          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5 sm:px-6" style={{ maxHeight: "380px" }}>
            {/* Subject selector above messages */}
            {activeChat && (
              <div className="rounded-2xl bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-500 dark:bg-white/5 dark:text-slate-300 flex items-center gap-2">
                <span className="font-black text-slate-700 dark:text-slate-200">Subject:</span>
                {activeChat.subject}
              </div>
            )}

            {!allMessages.length ? (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                  <Bot size={28} />
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">
                  Start a conversation
                </h3>
                <p className="mt-1 max-w-md text-sm font-medium text-slate-500 dark:text-slate-400">
                  Choose a quick reply below or type your own message to get help from our support team.
                </p>
              </div>
            ) : (
              allMessages.map((item, index) => {
                const isUser = item.from === "user";
                const showAvatar =
                  index === 0 || allMessages[index - 1]?.from !== item.from;
                return (
                  <div
                    key={item.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] ${
                        isUser
                          ? "order-1"
                          : "order-1"
                      }`}
                    >
                      {showAvatar && (
                        <div
                          className={`text-xs font-bold uppercase tracking-wide mb-1 ${
                            isUser ? "text-right text-slate-500" : "text-left text-blue-600"
                          }`}
                        >
                          {isUser ? "You" : item.sender || "Admin Support"}
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm font-semibold leading-relaxed ${
                          isUser
                            ? "bg-blue-600 text-white rounded-br-md"
                            : "bg-slate-100 text-slate-800 rounded-bl-md dark:bg-white/10 dark:text-slate-100"
                        }`}
                      >
                        {item.text}
                      </div>
                      <div
                        className={`mt-0.5 text-[10px] font-medium text-slate-400 ${
                          isUser ? "text-right" : "text-left"
                        }`}
                      >
                        {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {showQuickReplies && !allMessages.length && (
            <div className="border-t border-slate-100 px-5 py-3 sm:px-6 dark:border-white/10">
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-blue-300"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subject + Message Input Bar */}
          <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6 dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="w-full sm:w-44 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                {["Policy support", "Claim issue", "Payment issue", "Document verification", "Complaint"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <div className="flex flex-1 gap-2">
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 transition"
                  placeholder="Type your message and press Enter to send..."
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send message to support admin"
                >
                  <Send size={16} />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardContact;
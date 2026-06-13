import { CheckCircle2, Headphones, Send } from "lucide-react";
import { statusClass } from "./helpers";
import SectionTitle from "./SectionTitle";

const SupportSection = ({ supportChats, setSupportChats, selectedChat, setSelectedChat, adminReply, setAdminReply, selectedProfile, runAction, addAuditLogEntry }) => {

  const handleReplyToChat = () => {
    if (!selectedChat || !adminReply.trim()) return;

    const nextMessage = {
      id: `msg_${Date.now()}`,
      from: "admin",
      sender: selectedProfile.name,
      text: adminReply,
      createdAt: new Date().toISOString(),
    };

    const nextChats = supportChats.map((chat) =>
      chat.id === selectedChat.id
        ? { ...chat, messages: [...chat.messages, nextMessage], updatedAt: new Date().toISOString() }
        : chat,
    );

    setSupportChats(nextChats);
    setSelectedChat({ ...selectedChat, messages: [...selectedChat.messages, nextMessage] });
    setAdminReply("");
    addAuditLogEntry(`ui/support/reply -> Dispatched message feedback interaction thread to ${selectedChat.userName}`);
    runAction("Reply sent", `Admin response sent to ${selectedChat.userName}.`);
  };

  const resolveChat = () => {
    if (!selectedChat) return;
    const nextChats = supportChats.map((chat) =>
      chat.id === selectedChat.id ? { ...chat, status: "Resolved", updatedAt: new Date().toISOString() } : chat,
    );
    setSupportChats(nextChats);
    addAuditLogEntry(`ui/support/resolve -> Handled ticket solution verification closure for ${selectedChat.userName}`);
    setSelectedChat(null);
    runAction("Chat resolved", `Support ticket for ${selectedChat.userName} marked as resolved.`);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <SectionTitle icon={Headphones} title="Support Center - User Chats" />
      <div className="mt-5 grid gap-4 xl:grid-cols-[300px_1fr]">
        <div className="max-h-[600px] space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
          {supportChats.length === 0 ? (
            <div className="text-sm font-semibold text-slate-500">No support chats yet.</div>
          ) : (
            supportChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  runAction(`Viewing chat: ${chat.id}`, {
                    user: chat.userName,
                    email: chat.userEmail,
                    subject: chat.subject,
                    status: chat.status,
                    messages: `${chat.messages.length} messages`,
                  });
                }}
                className={`w-full rounded-lg border p-3 text-left transition ${selectedChat?.id === chat.id
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-blue-300"
                  }`}
              >
                <div className="text-sm font-bold text-slate-900">{chat.userName}</div>
                <div className="text-xs text-slate-500">{chat.subject}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`rounded px-2 py-1 text-xs font-bold ${statusClass(chat.status)}`}>
                    {chat.status}
                  </span>
                  <span className="text-xs text-slate-500">{chat.messages.length} msg</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="rounded-lg border border-slate-200">
          {!selectedChat ? (
            <div className="flex h-[600px] items-center justify-center text-slate-500">
              <p>Select a chat to view messages</p>
            </div>
          ) : (
            <div className="flex h-[600px] flex-col">
              <div className="border-b border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{selectedChat.userName}</div>
                    <div className="text-xs text-slate-500">{selectedChat.userEmail}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-600">{selectedChat.subject}</div>
                  </div>
                  <span className={`rounded-lg px-3 py-1 text-xs font-bold ${statusClass(selectedChat.status)}`}>
                    {selectedChat.status}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {selectedChat.messages.map((msg) => (
                  <div key={msg.id}>
                    <div className="text-xs font-bold uppercase text-slate-500">{msg.sender}</div>
                    <div
                      className={`mt-1 rounded-lg px-4 py-3 text-sm font-semibold ${msg.from === "admin"
                          ? "bg-blue-50 text-blue-900"
                          : "bg-slate-100 text-slate-700"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {selectedChat.status !== "Resolved" && (
                <div className="border-t border-slate-200 p-4 space-y-3">
                  <input
                    value={adminReply}
                    onChange={(event) => setAdminReply(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && handleReplyToChat()}
                    placeholder="Type your reply..."
                    className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleReplyToChat}
                      className="flex-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                    >
                      <Send size={16} />
                      Send Reply
                    </button>
                    <button
                      onClick={resolveChat}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
                    >
                      <CheckCircle2 size={16} />
                      Resolve
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;

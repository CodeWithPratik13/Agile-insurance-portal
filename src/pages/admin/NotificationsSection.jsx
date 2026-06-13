import { Bell, Send } from "lucide-react";
import SectionTitle from "./SectionTitle";

const NotificationsSection = ({ addAuditLogEntry, runAction }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <SectionTitle icon={Bell} title="Notification Center" />
    <div className="mt-5 grid gap-4 lg:grid-cols-2">
      {["Policy Issued", "Policy Approved", "Claim Submitted", "Claim Approved", "Claim Rejected", "Payment Received", "Renewal Reminder"].map((type) => (
        <button
          key={type}
          onClick={() => {
            addAuditLogEntry(`ui/notifications/template -> Selected notification template: ${type}`);
            runAction("Notification template", `${type} template is ready to edit or send from the selected channel.`);
          }}
          className="rounded-lg border border-slate-200 p-4 text-left font-black transition hover:border-blue-200 hover:bg-blue-50"
        >
          {type}
        </button>
      ))}
    </div>
    <div className="mt-5 flex flex-wrap gap-2">
      {["Email", "SMS", "Push Notifications"].map((channel) => (
        <button key={channel} onClick={() => runAction("Channel selected", `${channel} channel enabled.`)} className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">{channel}</button>
      ))}
      <button
        onClick={() => {
          addAuditLogEntry(`ui/notifications/send -> Queued notification broadcast from admin center`);
          runAction("Notification sent", "Selected notification has been queued for active users.");
        }}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-black text-white"
      >
        <Send size={15} />Send
      </button>
    </div>
  </section>
);

export default NotificationsSection;

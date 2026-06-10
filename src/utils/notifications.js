import { load, save, uid } from "./storage";

// Notification templates and writes for user-facing dashboard alerts live here.
const NOTIFICATION_KEY = "notifications";

// Adds a durable notification that can be shown in Dashboard > Notifications.
export const addUserNotification = ({
  userId = "",
  userEmail = "",
  type = "info",
  title,
  body,
  status = "Unread",
  referenceId = "",
}) => {
  const notifications = load(NOTIFICATION_KEY, []);
  const nextNotification = {
    id: uid("note"),
    userId,
    userEmail,
    type,
    title,
    body,
    status,
    referenceId,
    createdAt: new Date().toISOString(),
  };

  save(NOTIFICATION_KEY, [nextNotification, ...notifications]);
  return nextNotification;
};

// Reads notifications scoped to the current signed-in customer.
export const readUserNotifications = (user) => {
  const notifications = load(NOTIFICATION_KEY, []);
  if (!user?.id && !user?.email) return notifications;
  return notifications.filter((item) => {
    if (!item.userId && !item.userEmail) return true;
    return item.userId === user?.id || item.userEmail === user?.email;
  });
};

// Keeps admin decisions in sync with the customer claim store and pushes an alert.
export const notifyClaimDecision = ({ claimId, status, reason = "", adminName = "Claims team" }) => {
  const claims = load("claims", []);
  const claim = claims.find((item) => item.id === claimId);
  if (!claim) return null;

  const now = new Date().toISOString();
  const updatedClaim = {
    ...claim,
    status,
    progress: status === "Approved" || status === "Rejected" ? 7 : claim.progress,
    rejectionReason: status === "Rejected" ? reason : claim.rejectionReason,
    timeline: [
      ...(claim.timeline || []),
      { at: now, label: status === "Approved" ? "Claim approved by admin" : status === "Rejected" ? "Claim rejected by admin" : `Claim marked ${status}` },
    ],
  };

  save("claims", claims.map((item) => (item.id === claimId ? updatedClaim : item)));

  return addUserNotification({
    userId: claim.userId,
    userEmail: claim.email,
    type: status === "Approved" ? "claim-approved" : status === "Rejected" ? "claim-rejected" : "claim-update",
    title: status === "Approved" ? "Claim Approved" : status === "Rejected" ? "Claim Rejected" : "Claim Updated",
    body:
      status === "Approved"
        ? `Claim ${claimId} has been approved by ${adminName}. Payment processing will begin shortly.`
        : status === "Rejected"
          ? `Claim ${claimId} has been rejected. ${reason || "Please review the claim details and resubmit if needed."}`
          : `Claim ${claimId} is now ${status}.`,
    referenceId: claimId,
  });
};

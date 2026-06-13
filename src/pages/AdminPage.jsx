import { useMemo, useState } from "react";
import { Bell, CheckCircle2, Edit3, Eye, Menu, Search, Trash2, X } from "lucide-react";
import { notifyClaimDecision } from "../utils/notifications";
import { randomDigits } from "../utils/ids";
import { readSystemSettings, saveSystemSettings } from "../utils/systemSettings";
import { adminSettingCards, navItems, pageTitles, requirements, tickets, users, documents } from "./admin/constants";
import {
  fileToDataUrl,
  formatStructuredDetail,
  loadAdmins,
  loadAuditLogs,
  makeUiId,
  persistPolicyRows,
  readAdminClaims,
  readAdminPolicyRows,
  readRealUsers,
  readSupportChats,
  readUploadedDocuments,
  rowKeyFor,
  saveAdmins,
  saveAuditLogs,
} from "./admin/helpers";
import AdminLogin from "./admin/AdminLogin";
import AdminPageContent from "./admin/AdminPageContent";
import AdminSidebar from "./admin/AdminSidebar";
import ActionButton from "./admin/ActionButton";
import EditPanel from "./admin/EditPanel";
import RightPanel from "./admin/RightPanel";

const AdminPage = () => {
  const [adminProfiles, setAdminProfiles] = useState(() => loadAdmins());
  const [selectedProfile, setSelectedProfile] = useState(() => loadAdmins()[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [customerRows, setCustomerRows] = useState(() => {
    const realUsers = readRealUsers();
    return realUsers.length ? realUsers : users;
  });
  const [claimRows, setClaimRows] = useState(readAdminClaims);
  const [, setTicketRows] = useState(tickets);
  const [requirementRows, setRequirementRows] = useState(requirements);
  const [documentRows, setDocumentRows] = useState(() => {
    const uploadedDocs = readUploadedDocuments();
    return uploadedDocs.length ? [...uploadedDocs, ...documents] : documents;
  });
  const [planRows, setPlanRows] = useState(readAdminPolicyRows);
  const [auditLogs, setAuditLogs] = useState(() => loadAuditLogs());
  const [systemSettings, setSystemSettings] = useState(readSystemSettings);
  const [selectedSettingId, setSelectedSettingId] = useState("general");
  const [showAdminProfilePassword, setShowAdminProfilePassword] = useState(false);
  const [adminNameDraft, setAdminNameDraft] = useState(() => loadAdmins()[0]?.name || "");
  const [passwordDraft, setPasswordDraft] = useState({ old: "", next: "", confirm: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [supportChats, setSupportChats] = useState(() => readSupportChats());
  const [selectedChat, setSelectedChat] = useState(null);
  const [adminReply, setAdminReply] = useState("");
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentMarks, setDocumentMarks] = useState({});
  const [markupTool, setMarkupTool] = useState("pen");
  const [draftMark, setDraftMark] = useState(null);
  const [detail, setDetail] = useState({
    title: "Admin Activity",
    body: "Select a row or action to view operational context here.",
    photo: "",
  });

  const activeUsers = customerRows.filter((user) => user.status === "Active" || user.status === "Logged In").length;

  const addAuditLogEntry = (actionString) => {
    const nextLog = {
      id: makeUiId("LOG-", 4),
      action: actionString,
      username: selectedProfile?.email || "system-account",
      initials: selectedProfile?.initials || "SYS",
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((currentLogs) => {
      const updated = [nextLog, ...currentLogs];
      saveAuditLogs(updated);
      return updated;
    });
  };

  const allowedNav = useMemo(
    () => navItems.filter((item) => item.roles.includes(selectedProfile.role)),
    [selectedProfile.role],
  );

  const openPage = (page) => {
    setActivePage(page);
    setMobileOpen(false);
    setEditingRecord(null);
    setSelectedReport(null);
    setDetail({ title: pageTitles[page], body: `You opened ${pageTitles[page]} as ${selectedProfile.role}.`, photo: "" });
  };

  const runAction = (title, body, photo = "") => setDetail({ title, body: formatStructuredDetail(body), photo });

  const editFieldsByKind = {
    users: ["name", "email", "phone", "address", "policies", "status", "city"],
    claims: ["id", "user", "policy", "amount", "status", "officer", "description", "docName"],
    policies: ["name", "company", "categorySlug", "type", "coverage", "premiumYearly", "offer", "duration", "renewalDate", "themeColor", "state"],
    documents: ["type", "owner", "status", "note"],
    requirements: ["user", "age", "budget", "coverage", "status"],
    support: ["id", "user", "subject", "priority", "status"],
  };

  const updateRowsForKind = (kind, updater) => {
    const setter = {
      users: setCustomerRows,
      claims: setClaimRows,
      support: setTicketRows,
      requirements: setRequirementRows,
      documents: setDocumentRows,
      policies: setPlanRows,
    }[kind];
    if (!setter) return;
    setter((rows) => {
      const nextRows = typeof updater === "function" ? updater(rows) : updater;
      if (kind === "policies") persistPolicyRows(nextRows);
      return nextRows;
    });
  };

  const startEditRecord = (kind, target) => {
    setEditingRecord({ kind, key: rowKeyFor(target), draft: { ...target }, fields: editFieldsByKind[kind] || Object.keys(target) });
    runAction("Edit opened", `${selectedProfile.name} is editing ${rowKeyFor(target)}.`);
  };

  const saveEditedRecord = () => {
    if (!editingRecord) return;
    updateRowsForKind(editingRecord.kind, (rows) =>
      rows.map((row) => (rowKeyFor(row) === editingRecord.key ? { ...row, ...editingRecord.draft } : row)),
    );
    addAuditLogEntry(`ui/${editingRecord.kind}/edit -> Saved changes for ${editingRecord.key}`);
    runAction("Changes saved", `${editingRecord.key} was updated by ${selectedProfile.name}.`);
  };

  const sendEditedRecordToUser = () => {
    if (!editingRecord) return;
    saveEditedRecord();
    addAuditLogEntry(`ui/${editingRecord.kind}/send -> Sent edited details back to user for ${editingRecord.key}`);
    runAction("Sent to user", {
      record: editingRecord.key,
      type: editingRecord.kind,
      message: "Updated details have been sent back to the user for review.",
    });
  };

  const currentDocumentKey = selectedDocument ? `${selectedDocument.type}-${selectedDocument.owner}` : "";
  const currentDocumentMarks = documentMarks[currentDocumentKey] || [];

  const pointFromEvent = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };
  };

  const startMarkup = (event) => {
    if (!selectedDocument) return;
    const point = pointFromEvent(event);
    if (markupTool === "eraser") {
      setDocumentMarks((marks) => ({
        ...marks,
        [currentDocumentKey]: (marks[currentDocumentKey] || []).slice(0, -1),
      }));
      return;
    }
    setDraftMark({ id: `mark-${Date.now()}`, tool: markupTool, points: [point], color: markupTool === "circle" ? "#dc2626" : "#2563eb" });
  };

  const continueMarkup = (event) => {
    if (!draftMark || markupTool !== "pen") return;
    const point = pointFromEvent(event);
    setDraftMark((mark) => ({ ...mark, points: [...mark.points, point] }));
  };

  const finishMarkup = (event) => {
    if (!draftMark || !selectedDocument) return;
    const endPoint = pointFromEvent(event);
    const completedMark = draftMark.tool === "circle" ? { ...draftMark, points: [draftMark.points[0], endPoint] } : draftMark;
    setDocumentMarks((marks) => ({
      ...marks,
      [currentDocumentKey]: [...(marks[currentDocumentKey] || []), completedMark],
    }));
    setDraftMark(null);
  };

  const undoDocumentMark = () => {
    if (!selectedDocument) return;
    setDocumentMarks((marks) => ({
      ...marks,
      [currentDocumentKey]: (marks[currentDocumentKey] || []).slice(0, -1),
    }));
  };

  const sendDocumentCorrection = () => {
    if (!selectedDocument) return;
    setDocumentRows((rows) =>
      rows.map((doc) =>
        `${doc.type}-${doc.owner}` === currentDocumentKey
          ? { ...doc, status: "Re-upload Requested", note: "Marked corrections sent by admin." }
          : doc,
      ),
    );
    addAuditLogEntry(`ui/documents/markup/send -> Sent correction marks for ${currentDocumentKey}`);
    runAction("Document sent back", `${selectedDocument.owner} will see the marked corrections for ${selectedDocument.type}.`);
  };

  const refreshRealUsers = () => {
    const realUsers = readRealUsers();
    setCustomerRows(realUsers.length ? realUsers : users);
    runAction("Users refreshed", `${realUsers.length} real registered or logged-in users loaded from the app profile store.`);
  };

  const createCustomer = () => {
    const nextUser = {
      id: makeUiId("USR", 5),
      name: "New Customer",
      email: `customer${customerRows.length + 1}@agile.demo`,
      phone: "Not added",
      address: "Not added",
      policies: 0,
      status: "Active",
      city: "Not added",
    };
    setCustomerRows((rows) => [nextUser, ...rows]);
    setEditingRecord({ kind: "users", key: rowKeyFor(nextUser), draft: { ...nextUser }, fields: editFieldsByKind.users });
    addAuditLogEntry(`ui/users/create -> Added customer profile: ${nextUser.email}`);
    runAction("User created", `${nextUser.name} was added by ${selectedProfile.name}.`);
  };

  const createPlan = () => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextPlan = {
      id: makeUiId("admin-policy-", 8),
      name: `New Insurance Plan ${planRows.length + 1}`,
      company: "Agile Insurance",
      categorySlug: "health-insurance",
      type: "Health",
      coverage: "₹10,00,000",
      premium: "INR 11,988/yr",
      premiumYearly: 11988,
      offer: "Admin Offer",
      duration: "1 year",
      renewalDate: nextYear.toISOString().slice(0, 10),
      themeColor: "#2563eb",
      state: "Draft",
    };
    setPlanRows((rows) => [nextPlan, ...rows]);
    setEditingRecord({ kind: "policies", key: rowKeyFor(nextPlan), draft: { ...nextPlan }, fields: editFieldsByKind.policies });
    addAuditLogEntry(`ui/policies/create -> Initialized draft plan: ${nextPlan.name}`);
    runAction("Plan created", `${nextPlan.name} is ready for editing and approval.`);
  };

  const createClaim = () => {
    const year = new Date().getFullYear();
    const nextClaim = {
      id: `CLM-${year}-${randomDigits(8)}`,
      user: customerRows[0]?.name || "New Customer",
      email: customerRows[0]?.email || "not-provided@agile.demo",
      phone: customerRows[0]?.phone || "Not added",
      policy: "Health",
      amount: "INR 25,000",
      status: "Pending",
      officer: selectedProfile.name,
      description: "Claim created from admin portal.",
      docName: "Documents pending",
    };
    setClaimRows((rows) => [nextClaim, ...rows]);
    setEditingRecord({ kind: "claims", key: rowKeyFor(nextClaim), draft: { ...nextClaim }, fields: editFieldsByKind.claims });
    addAuditLogEntry(`ui/claims/create -> Opened claim sheet: ${nextClaim.id}`);
    runAction("Claim created", `${nextClaim.id} was created. Add or edit customer name, policy, amount, documents, and notes before sending.`);
  };

  const createRequirement = () => {
    const nextRequirement = {
      user: customerRows[0]?.name || "Customer",
      age: 30,
      budget: "INR 15,000",
      coverage: "INR 10L",
      status: "Review",
    };
    setRequirementRows((rows) => [nextRequirement, ...rows]);
    runAction("Requirement created", `A new policy requirement was created for ${nextRequirement.user}.`);
  };

  const updateAdminProfile = (changes) => {
    const nextAdmins = adminProfiles.map((admin) =>
      admin.email === selectedProfile.email ? { ...admin, ...changes } : admin,
    );
    const nextSelected = nextAdmins.find((admin) => admin.email === selectedProfile.email);
    setAdminProfiles(nextAdmins);
    setSelectedProfile(nextSelected);
    saveAdmins(nextAdmins);
    return nextSelected;
  };

  const saveAdminName = () => {
    const name = adminNameDraft.trim();
    if (!name) {
      runAction("Name required", "Admin name cannot be empty.");
      return;
    }
    const nextSelected = updateAdminProfile({
      name,
      initials: name
        .split(" ")
        .map((part) => part)
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    });
    addAuditLogEntry(`ui/profile/updateName -> Changed administrative label name to: ${nextSelected.name}`);
    runAction("Admin name updated", `Admin name changed to ${nextSelected.name}.`);
  };

  const saveAdminPassword = () => {
    if (passwordDraft.old !== selectedProfile.password) {
      setPasswordMessage("Old password is incorrect.");
      return;
    }
    if (passwordDraft.next.length < 6) {
      setPasswordMessage("New password must be at least 6 characters.");
      return;
    }
    if (passwordDraft.next !== passwordDraft.confirm) {
      setPasswordMessage("New password and confirm password do not match.");
      return;
    }
    updateAdminProfile({ password: passwordDraft.next });
    setPasswordDraft({ old: "", next: "", confirm: "" });
    setPasswordMessage("Password changed successfully.");
    addAuditLogEntry(`ui/profile/updatePassword -> Modified credentials passcode keys`);
    runAction("Admin password updated", `${selectedProfile.name} changed their password after old password verification.`);
  };

  const updateAdminPhoto = (file) => {
    fileToDataUrl(file, (profilePhoto) => {
      updateAdminProfile({ profilePhoto });
      addAuditLogEntry(`ui/profile/updatePhoto -> Modified account metadata visual layout profile avatar`);
      runAction("Admin photo updated", `${selectedProfile.name} uploaded a new profile photo.`);
    });
  };

  const mutateRows = (kind, target, action) => {
    const targetKey = target.id || target.name || target.user || target.type;
    const updater = (row) => {
      const rowKey = row.id || row.name || row.user || row.type;
      if (rowKey !== targetKey) return row;
      if (action === "approve") {
        if (kind === "claims") {
          notifyClaimDecision({ claimId: row.id, status: "Approved", adminName: selectedProfile.name });
          return { ...row, status: "Approved" };
        }
        if (kind === "documents") return { ...row, status: "Approved" };
        if (kind === "policies") return { ...row, state: "Active" };
        if (kind === "support") return { ...row, status: "Resolved" };
        return { ...row, status: "Active" };
      }
      return row;
    };
    const remove = (row) => (row.id || row.name || row.user || row.type) !== targetKey;
    const setter = {
      users: setCustomerRows,
      claims: setClaimRows,
      support: setTicketRows,
      requirements: setRequirementRows,
      documents: setDocumentRows,
      policies: setPlanRows,
    }[kind];

    setter((rows) => {
      const nextRows = action === "delete" ? rows.filter(remove) : rows.map(updater);
      if (kind === "policies") persistPolicyRows(nextRows);
      return nextRows;
    });
    addAuditLogEntry(`ui/${kind}/${action} -> Executed action on item reference key ID: ${targetKey}`);
    runAction(
      action === "delete" ? "Deleted" : "Approved",
      `${targetKey} was ${action === "delete" ? "removed" : "approved"} by ${selectedProfile.name}.`,
    );
  };

  const respondToClaim = (claim) => {
    const message = `Dear ${claim.user}, your ${claim.policy} claim ${claim.id} is under review. Please keep your policy number, hospital bills, identity proof, and bank details ready.`;
    setClaimRows((rows) => rows.map((row) => (row.id === claim.id ? { ...row, status: "Under Review", response: message } : row)));
    addAuditLogEntry(`ui/claims/respond -> Forwarded manual procedural response guidelines message to ${claim.id}`);
    runAction("Response sent to user", {
      claimId: claim.id,
      user: claim.user,
      response: message,
    });
  };

  const rejectClaimForMissingDetails = (claim) => {
    const missing = [];
    if (!claim.amount) missing.push("Claim amount");
    if (!claim.policy) missing.push("Policy type");
    if (claim.status === "Documents") missing.push("Required documents");
    const reason = missing.length ? `Missing details: ${missing.join(", ")}` : "Rejected after verification due to incomplete claim evidence";
    setClaimRows((rows) => rows.map((row) => (row.id === claim.id ? { ...row, status: "Rejected", rejectionReason: reason } : row)));
    notifyClaimDecision({ claimId: claim.id, status: "Rejected", reason, adminName: selectedProfile.name });
    addAuditLogEntry(`ui/claims/reject -> Issued fallback state negative evaluation on: ${claim.id}`);
    runAction("Claim rejected", {
      claimId: claim.id,
      user: claim.user,
      reason,
      responseToUser: "Your claim was rejected because required details are missing. Please resubmit with complete documents.",
    });
  };

  const getSettingValue = (settingId, field) => {
    const saved = systemSettings.modules?.[settingId]?.[field.name];
    return saved ?? field.defaultValue ?? "";
  };

  const updateSettingModule = (settingId, field, value) => {
    setSystemSettings((settings) => {
      const next = {
        ...settings,
        modules: {
          ...(settings.modules || {}),
          [settingId]: {
            ...(settings.modules?.[settingId] || {}),
            [field.name]: value,
          },
        },
      };
      saveSystemSettings(next);
      return next;
    });
    addAuditLogEntry(`ui/settings/update -> ${settingId}.${field.name}`);
    runAction("Setting applied", `${field.label} updated in real time.`);
  };

  const updateStructuredSetting = (settingId, field, updater, actionLabel = field.label) => {
    const current = getSettingValue(settingId, field);
    const nextValue = typeof updater === "function" ? updater(current) : updater;
    updateSettingModule(settingId, field, nextValue);
    runAction("Configuration updated", `${actionLabel} configuration has been saved locally.`);
  };

  const updateSettingFile = (settingId, field, file) => {
    if (!file) return;
    fileToDataUrl(file, (dataUrl) => updateSettingModule(settingId, field, dataUrl));
  };

  const openSettingDetail = (settingId) => {
    const card = adminSettingCards.find((item) => item.id === settingId) || adminSettingCards[0];
    setSelectedSettingId(card.id);
    setActivePage("setting-detail");
    setDetail({ title: card.title, body: card.description, photo: "" });
  };

  const actionButtons = (target, kind) => (
    <div className="flex gap-1">
      <ActionButton
        icon={Eye}
        label="View"
        onClick={() =>
          runAction(
            `Viewing ${target.id || target.name || target.user}`,
            kind === "users" ? {
              profile: target.name,
              email: target.email,
              phone: target.phone,
              city: target.city,
              address: target.address || "Not added",
              loginStatus: target.status,
              policiesPurchased: target.policies || 0,
              claimsSubmitted: claimRows.filter((claim) => claim.user === target.name || claim.email === target.email).length,
              claimSummary: claimRows.filter((claim) => claim.user === target.name || claim.email === target.email).map((claim) => `${claim.id} - ${claim.policy} - ${claim.status}`).join("; ") || "No claims found for this user",
              paymentsMade: 0,
              documentsUploaded: 0,
              documents: "No uploaded documents found",
              recentActivity: target.status === "Logged In" ? "Currently logged in to the user portal" : "Registered user profile available",
            } : target,
            kind === "users" ? target.profilePhoto : "",
          )
        }
      />
      <ActionButton icon={Edit3} label="Edit" onClick={() => startEditRecord(kind, target)} />
      <ActionButton icon={CheckCircle2} label="Approve" onClick={() => mutateRows(kind, target, "approve")} />
      <ActionButton icon={Trash2} label="Delete" onClick={() => mutateRows(kind, target, "delete")} />
    </div>
  );

  const openReportDetail = (report) => {
    setSelectedReport(report);
    setEditingRecord(null);
    setActivePage("report-detail");
    setDetail({ title: report, body: `${report} opened with current admin data.`, photo: "" });
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        adminProfiles={adminProfiles}
        selectedProfile={selectedProfile}
        setSelectedProfile={setSelectedProfile}
        onLogin={() => {
          setIsAuthenticated(true);
          setActivePage("dashboard");
          setAdminNameDraft(selectedProfile.name);
          addAuditLogEntry(`Authentication / Login successful as [${selectedProfile.role}]`);
          setDetail({ title: "Login successful", body: `${selectedProfile.name} signed in as ${selectedProfile.role}.`, photo: selectedProfile.profilePhoto || "" });
        }}
      />
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-100 text-slate-900">
      <div className="flex h-full min-h-0">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          allowedNav={allowedNav}
          activePage={activePage}
          selectedProfile={selectedProfile}
          openPage={openPage}
          onLogout={() => setIsAuthenticated(false)}
          onToggleCollapsed={() => setSidebarCollapsed((value) => !value)}
        />

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button className="absolute inset-0 bg-slate-950/50" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
            <div className="relative h-full">
              <AdminSidebar
                mobile
                allowedNav={allowedNav}
                activePage={activePage}
                selectedProfile={selectedProfile}
                openPage={openPage}
                onLogout={() => setIsAuthenticated(false)}
                onToggleCollapsed={() => setMobileOpen(false)}
              />
              <button className="absolute right-4 top-4 rounded-lg bg-white p-2 text-slate-700 shadow" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="shrink-0 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button className="rounded-lg border border-slate-200 p-2 lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
                  <Menu size={20} />
                </button>
                <div className="min-w-0">
                  <div className="truncate text-xs font-black uppercase tracking-wide text-slate-500">{pageTitles[activePage]}</div>
                  <div className="truncate text-lg font-black text-slate-950">{selectedProfile.role} Workspace</div>
                </div>
              </div>

              <div className="hidden min-w-0 flex-1 justify-center px-4 md:flex">
                <div className="relative w-full max-w-xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium outline-none focus:border-blue-500" placeholder="Search users, claims, tickets, policies..." />
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button onClick={() => openPage("notifications")} className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700" aria-label="Notifications">
                  <Bell size={18} />
                </button>
                <button onClick={() => openPage("profile")} className="hidden h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 sm:inline-flex">
                  {selectedProfile.profilePhoto ? (
                    <img src={selectedProfile.profilePhoto} alt={selectedProfile.name} className="h-8 w-8 rounded-lg object-cover" />
                  ) : (
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-xs font-black text-white">{selectedProfile.initials}</span>
                  )}
                  {selectedProfile.name.split(" ")[0]}
                </button>
              </div>
            </div>
          </header>

          <div className="grid min-h-0 flex-1 xl:grid-cols-[minmax(0,1fr)_340px]">
            <section className="scrollbar-none min-h-0 overflow-y-auto p-4 sm:p-6">
              <EditPanel editingRecord={editingRecord} setEditingRecord={setEditingRecord} saveEditedRecord={saveEditedRecord} sendEditedRecordToUser={sendEditedRecordToUser} />
              <AdminPageContent
                activePage={activePage}
                selectedProfile={selectedProfile}
                customerRows={customerRows}
                claimRows={claimRows}
                supportChats={supportChats}
                requirementRows={requirementRows}
                documentRows={documentRows}
                planRows={planRows}
                activeUsers={activeUsers}
                refreshRealUsers={refreshRealUsers}
                createCustomer={createCustomer}
                createClaim={createClaim}
                createRequirement={createRequirement}
                createPlan={createPlan}
                actionButtons={actionButtons}
                respondToClaim={respondToClaim}
                rejectClaimForMissingDetails={rejectClaimForMissingDetails}
                runAction={runAction}
                setSupportChats={setSupportChats}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                adminReply={adminReply}
                setAdminReply={setAdminReply}
                addAuditLogEntry={addAuditLogEntry}
                selectedDocument={selectedDocument}
                setSelectedDocument={setSelectedDocument}
                currentDocumentKey={currentDocumentKey}
                currentDocumentMarks={currentDocumentMarks}
                draftMark={draftMark}
                markupTool={markupTool}
                setMarkupTool={setMarkupTool}
                startMarkup={startMarkup}
                continueMarkup={continueMarkup}
                finishMarkup={finishMarkup}
                undoDocumentMark={undoDocumentMark}
                sendDocumentCorrection={sendDocumentCorrection}
                startEditRecord={startEditRecord}
                mutateRows={mutateRows}
                openReportDetail={openReportDetail}
                selectedReport={selectedReport}
                auditLogs={auditLogs}
                setAuditLogs={setAuditLogs}
                selectedSettingId={selectedSettingId}
                getSettingValue={getSettingValue}
                updateSettingModule={updateSettingModule}
                updateStructuredSetting={updateStructuredSetting}
                updateSettingFile={updateSettingFile}
                openPage={openPage}
                openSettingDetail={openSettingDetail}
                adminNameDraft={adminNameDraft}
                setAdminNameDraft={setAdminNameDraft}
                updateAdminPhoto={updateAdminPhoto}
                saveAdminName={saveAdminName}
                passwordDraft={passwordDraft}
                setPasswordDraft={setPasswordDraft}
                showAdminProfilePassword={showAdminProfilePassword}
                setShowAdminProfilePassword={setShowAdminProfilePassword}
                saveAdminPassword={saveAdminPassword}
                passwordMessage={passwordMessage}
              />
            </section>

            <RightPanel
              selectedProfile={selectedProfile}
              detail={detail}
              documentRows={documentRows}
              claimRows={claimRows}
              supportChats={supportChats}
              requirementRows={requirementRows}
              openPage={openPage}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;

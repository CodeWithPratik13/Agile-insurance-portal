import AuditLogSection from "./AuditLogSection";
import ClaimsSection from "./ClaimsSection";
import DashboardSection from "./DashboardSection";
import DocumentsSection from "./DocumentsSection";
import NotificationsSection from "./NotificationsSection";
import PoliciesSection from "./PoliciesSection";
import ProfileSection from "./ProfileSection";
import ReportDetailSection from "./ReportDetailSection";
import ReportsSection from "./ReportsSection";
import RequirementsSection from "./RequirementsSection";
import SettingDetailSection from "./SettingDetailSection";
import SettingsSection from "./SettingsSection";
import SupportSection from "./SupportSection";
import UsersSection from "./UsersSection";

const AdminPageContent = ({
  activePage,
  selectedProfile,
  customerRows,
  claimRows,
  supportChats,
  requirementRows,
  documentRows,
  planRows,
  activeUsers,
  refreshRealUsers,
  createCustomer,
  createClaim,
  createRequirement,
  createPlan,
  actionButtons,
  respondToClaim,
  rejectClaimForMissingDetails,
  runAction,
  setSupportChats,
  selectedChat,
  setSelectedChat,
  adminReply,
  setAdminReply,
  setSelectedDocument,
  selectedDocument,
  currentDocumentKey,
  currentDocumentMarks,
  draftMark,
  markupTool,
  setMarkupTool,
  startMarkup,
  continueMarkup,
  finishMarkup,
  undoDocumentMark,
  sendDocumentCorrection,
  startEditRecord,
  mutateRows,
  addAuditLogEntry,
  openReportDetail,
  selectedReport,
  auditLogs,
  setAuditLogs,
  selectedSettingId,
  getSettingValue,
  updateSettingModule,
  updateStructuredSetting,
  updateSettingFile,
  openPage,
  openSettingDetail,
  adminNameDraft,
  setAdminNameDraft,
  updateAdminPhoto,
  saveAdminName,
  passwordDraft,
  setPasswordDraft,
  showAdminProfilePassword,
  setShowAdminProfilePassword,
  saveAdminPassword,
  passwordMessage,
}) => {
  if (activePage === "dashboard") {
    return <DashboardSection customerRows={customerRows} claimRows={claimRows} planRows={planRows} supportChats={supportChats} selectedProfile={selectedProfile} openPage={openPage} />;
  }
  if (activePage === "users") {
    return <UsersSection activeUsers={activeUsers} refreshRealUsers={refreshRealUsers} createCustomer={createCustomer} actionButtons={actionButtons} customerRows={customerRows} />;
  }
  if (activePage === "claims") {
    return <ClaimsSection claimRows={claimRows} createClaim={createClaim} respondToClaim={respondToClaim} rejectClaimForMissingDetails={rejectClaimForMissingDetails} actionButtons={actionButtons} runAction={runAction} />;
  }
  if (activePage === "requirements") {
    return <RequirementsSection requirementRows={requirementRows} createRequirement={createRequirement} startEditRecord={startEditRecord} mutateRows={mutateRows} runAction={runAction} />;
  }
  if (activePage === "support") {
    return <SupportSection supportChats={supportChats} setSupportChats={setSupportChats} selectedChat={selectedChat} setSelectedChat={setSelectedChat} adminReply={adminReply} setAdminReply={setAdminReply} selectedProfile={selectedProfile} runAction={runAction} addAuditLogEntry={addAuditLogEntry} />;
  }
  if (activePage === "policies") {
    return <PoliciesSection planRows={planRows} createPlan={createPlan} actionButtons={actionButtons} />;
  }
  if (activePage === "documents") {
    return (
      <DocumentsSection
        documentRows={documentRows}
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
        runAction={runAction}
        startEditRecord={startEditRecord}
        mutateRows={mutateRows}
      />
    );
  }
  if (activePage === "notifications") {
    return <NotificationsSection addAuditLogEntry={addAuditLogEntry} runAction={runAction} />;
  }
  if (activePage === "reports") {
    return <ReportsSection openReportDetail={openReportDetail} runAction={runAction} />;
  }
  if (activePage === "profile") {
    return (
      <ProfileSection
        selectedProfile={selectedProfile}
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
    );
  }
  if (activePage === "auditlog") {
    return <AuditLogSection auditLogs={auditLogs} setAuditLogs={setAuditLogs} runAction={runAction} />;
  }
  if (activePage === "report-detail") {
    return <ReportDetailSection selectedReport={selectedReport} customerRows={customerRows} planRows={planRows} claimRows={claimRows} openPage={openPage} runAction={runAction} />;
  }
  if (activePage === "setting-detail") {
    return <SettingDetailSection selectedSettingId={selectedSettingId} getSettingValue={getSettingValue} updateSettingModule={updateSettingModule} updateStructuredSetting={updateStructuredSetting} updateSettingFile={updateSettingFile} openPage={openPage} />;
  }
  if (activePage === "settings") {
    return <SettingsSection openSettingDetail={openSettingDetail} />;
  }
  return null;
};

export default AdminPageContent;

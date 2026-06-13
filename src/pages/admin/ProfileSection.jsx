import { UserCog } from "lucide-react";
import SectionTitle from "./SectionTitle";

const ProfileSection = ({
  selectedProfile,
  adminNameDraft,
  setAdminNameDraft,
  updateAdminProfile,
  updateAdminPhoto,
  saveAdminName,
  passwordDraft,
  setPasswordDraft,
  showAdminProfilePassword,
  setShowAdminProfilePassword,
  saveAdminPassword,
  passwordMessage,
}) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <SectionTitle icon={UserCog} title="Admin Profile" />
    <div className="mt-5 grid gap-5 xl:grid-cols-[360px_1fr]">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        {selectedProfile.profilePhoto ? (
          <img src={selectedProfile.profilePhoto} alt={selectedProfile.name} className="h-20 w-20 rounded-lg object-cover" />
        ) : (
          <span className="grid h-20 w-20 place-items-center rounded-lg bg-blue-600 text-lg font-black text-white">{selectedProfile.initials}</span>
        )}
        <div className="mt-4 text-xl font-black text-slate-950">{selectedProfile.name}</div>
        <div className="mt-1 text-sm font-bold text-slate-500">{selectedProfile.role}</div>
        <div className="mt-4 rounded-lg bg-white p-3 text-sm font-semibold text-slate-600">{selectedProfile.access}</div>
        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
          Upload Photo
          <input type="file" accept="image/*" className="hidden" onChange={(event) => updateAdminPhoto(event.target.files?.[0])} />
        </label>
      </div>

      <div className="space-y-5">
        <div className="rounded-lg border border-slate-200 p-5">
          <div className="text-sm font-black text-slate-950">Edit Admin Details</div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">Admin Name</span>
              <input
                className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-500"
                value={adminNameDraft}
                onChange={(event) => setAdminNameDraft(event.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">Unique Admin ID</span>
              <input
                className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-500"
                value={selectedProfile.adminId}
                onChange={(event) => updateAdminProfile({ adminId: event.target.value })}
              />
            </label>
          </div>
          <button onClick={saveAdminName} className="mt-4 rounded-lg bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700">
            Save Profile
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 p-5">
          <div className="text-sm font-black text-slate-950">Change Password</div>
          <div className="mt-1 text-xs font-semibold text-slate-500">Enter old password, new password, and confirm password.</div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">Old Password</span>
              <input
                className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-500"
                type={showAdminProfilePassword ? "text" : "password"}
                value={passwordDraft.old}
                onChange={(event) => setPasswordDraft((draft) => ({ ...draft, old: event.target.value }))}
              />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">New Password</span>
              <input
                className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-500"
                type={showAdminProfilePassword ? "text" : "password"}
                value={passwordDraft.next}
                onChange={(event) => setPasswordDraft((draft) => ({ ...draft, next: event.target.value }))}
              />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">Confirm Password</span>
              <input
                className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-500"
                type={showAdminProfilePassword ? "text" : "password"}
                value={passwordDraft.confirm}
                onChange={(event) => setPasswordDraft((draft) => ({ ...draft, confirm: event.target.value }))}
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setShowAdminProfilePassword((value) => !value)} className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-black text-blue-700 hover:bg-blue-50">
              {showAdminProfilePassword ? "Hide Passwords" : "Show Passwords"}
            </button>
            <button onClick={saveAdminPassword} className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700">
              Change Password
            </button>
          </div>
          {passwordMessage && <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">{passwordMessage}</div>}
        </div>
      </div>
    </div>
  </section>
);

export default ProfileSection;

import { useState } from "react";
import { KeyRound, Lock, Mail, ShieldCheck, Smartphone } from "lucide-react";

const AdminLogin = ({ adminProfiles, selectedProfile, setSelectedProfile, onLogin }) => {
  const [otpOpen, setOtpOpen] = useState(false);
  const [adminId, setAdminId] = useState(selectedProfile.adminId);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const chooseProfile = (profile) => {
    setSelectedProfile(profile);
    setAdminId(profile.adminId);
    setPassword("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_440px]">
        <section className="flex flex-col justify-between bg-slate-950 p-6 text-white sm:p-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-black text-white">
              <ShieldCheck size={16} />
              Agile Insurance Admin
            </span>
            <h1 className="mt-8 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">Secure admin login for role-based operations</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300">
              Choose an admin profile, verify credentials, and open the workspace with role-matched pages and actions.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {adminProfiles.map((profile) => (
              <button
                key={profile.email}
                onClick={() => chooseProfile(profile)}
                className={`cursor-pointer rounded-lg border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${selectedProfile.email === profile.email ? "border-blue-400 bg-blue-500/15" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-sm font-black text-slate-950">{profile.initials}</span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-black">{profile.name}</div>
                    <div className="truncate text-xs font-semibold text-slate-300">{profile.role}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs font-semibold text-slate-300">{profile.access}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-blue-600 font-black text-white">{selectedProfile.initials}</span>
            <div>
              <div className="text-lg font-black text-slate-950">Admin Login</div>
              <div className="text-sm font-semibold text-slate-500">{selectedProfile.role}</div>
            </div>
          </div>

          <form
            className="mt-8 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!adminId.trim() || !password.trim()) {
                setError("Enter any admin ID/email and password to preview the admin UI.");
                return;
              }
              onLogin();
            }}
          >
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">Admin ID</span>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-bold outline-none focus:border-blue-500" value={adminId} onChange={(event) => setAdminId(event.target.value)} />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">Password</span>
              <div className="relative mt-2">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-16 text-sm font-bold outline-none focus:border-blue-500" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter admin password" />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-black text-blue-700 hover:bg-blue-50"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between gap-3 text-sm font-bold">
              <label className="inline-flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" defaultChecked />
                Remember me
              </label>
              <button type="button" className="text-blue-700 hover:text-blue-900">Forgot Password</button>
            </div>

            <button type="button" onClick={() => setOtpOpen((value) => !value)} className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-black text-slate-700">
              <span className="inline-flex items-center gap-2"><Smartphone size={18} />Two-Factor Authentication</span>
              <span className="text-blue-700">{otpOpen ? "Enabled" : "OTP"}</span>
            </button>

            {otpOpen && (
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">OTP Code</span>
                <input className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-black tracking-[0.4em] outline-none focus:border-blue-500" defaultValue="482910" maxLength={6} />
              </label>
            )}

            {error && <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">{error}</div>}

            <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-black text-white hover:bg-blue-700">
              <Lock size={18} />
              Login as {selectedProfile.role}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AdminLogin;

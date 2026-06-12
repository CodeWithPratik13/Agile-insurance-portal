import { useState } from "react";
import { AuthContext } from "./authContextInstance";

const buildFrontendUser = ({ fullName, email, phone = "", address = "", provider = "email" }) => ({
  id: `frontend-user-${Date.now()}`,
  fullName: fullName?.trim() || email?.split("@")[0] || "Frontend User",
  email: email?.trim().toLowerCase() || "user@example.com",
  phone: phone.trim(),
  address: address.trim(),
  provider,
  createdAt: new Date().toISOString(),
});

// UI-only auth provider. It keeps login state in React memory only.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bootstrapped] = useState(true);

  const startSession = (nextUser) => {
    setUser(nextUser);
    return nextUser;
  };

  const register = async ({ fullName, email, phone, address }) => {
    return startSession(buildFrontendUser({ fullName, email, phone, address }));
  };

  const verifyOtp = async ({ email }) => {
    return startSession(buildFrontendUser({ email }));
  };

  const login = async ({ email }) => {
    return startSession(buildFrontendUser({ email }));
  };

  const googleLogin = async () => {
    return startSession(
      buildFrontendUser({
        fullName: "Google Frontend User",
        email: "google-user@example.com",
        provider: "google",
      }),
    );
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    bootstrapped,
    register,
    verifyOtp,
    login,
    googleLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

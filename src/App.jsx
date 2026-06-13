import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";
import AuthPage from "./pages/AuthPage";
import CategoryPage from "./pages/CategoryPage";
import PolicyDetailsPage from "./pages/PolicyDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import AdminPage from "./pages/AdminPage";
import CalculatorPage from "./pages/CalculatorPage";
import InfoPage from "./pages/InfoPage";
import SystemConfigurationPage from "./pages/SystemConfigurationPage";
import WhyChoosePage from "./pages/WhyChoosePage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardOverview from "./pages/user-dashboard/DashboardOverview";
import DashboardPolicies from "./pages/user-dashboard/DashboardPolicies";
import DashboardClaims from "./pages/user-dashboard/DashboardClaims";
import DashboardPayments from "./pages/user-dashboard/DashboardPayments";
import DashboardRenewals from "./pages/user-dashboard/DashboardRenewals";
import DashboardDocuments from "./pages/user-dashboard/DashboardDocuments";
import DashboardContact from "./pages/user-dashboard/DashboardContact";
import DashboardNotifications from "./pages/user-dashboard/DashboardNotifications";
import DashboardProfile from "./pages/user-dashboard/DashboardProfile";
import DashboardSecurity from "./pages/user-dashboard/DashboardSecurity";
import NotFoundPage from "./pages/NotFoundPage";

// Main app routing configuration
// Routes are organized by layout type: public, auth-only, admin, and protected dashboard
const App = () => {
  return (
    <Routes>
      {/* Public routes - includes navbar, footer, and floating AI assistant */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/why-choose/:featureSlug" element={<WhyChoosePage />} />
        <Route path="/:categorySlug" element={<CategoryPage />} />
        <Route path="/policies/:policyId" element={<PolicyDetailsPage />} />
        <Route
          path="/checkout/:policyId"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccessPage />
            </ProtectedRoute>
          }
        />
        {/* Footer navigation information pages. Product slugs stay on CategoryPage so users see policy cards and filters. */}
        <Route path="/general-insurance" element={<InfoPage />} />
        <Route path="/investment" element={<InfoPage />} />
        <Route path="/other-insurance" element={<InfoPage />} />
        <Route path="/articles" element={<InfoPage />} />
        <Route path="/reviews" element={<InfoPage />} />
        <Route path="/companies" element={<InfoPage />} />
        <Route path="/newsroom" element={<InfoPage />} />
        <Route path="/awards" element={<InfoPage />} />
        <Route path="/about-us" element={<InfoPage />} />
        <Route path="/careers" element={<InfoPage />} />
        <Route path="/legal-policies" element={<InfoPage />} />
        <Route path="/contact" element={<InfoPage />} />
      </Route>

      {/* Auth routes - minimal layout (no navbar/footer) for focused authentication experience */}
      <Route element={<AuthLayout />}>
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      {/* Admin routes - specialized admin interface with role-based access */}
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/system-configuration" element={<SystemConfigurationPage />} />

      {/* Protected dashboard routes - requires authentication */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="policies" element={<DashboardPolicies />} />
        <Route path="claims" element={<DashboardClaims />} />
        <Route path="payments" element={<DashboardPayments />} />
        <Route path="renewals" element={<DashboardRenewals />} />
        <Route path="documents" element={<DashboardDocuments />} />
        <Route path="contact" element={<DashboardContact />} />
        <Route path="ai-support" element={<Navigate to="/dashboard/contact" replace />} />
        <Route path="notifications" element={<DashboardNotifications />} />
        <Route path="profile" element={<DashboardProfile />} />
        <Route path="security" element={<DashboardSecurity />} />
      </Route>

      {/* Fallback routes */}
      <Route path="/app" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;

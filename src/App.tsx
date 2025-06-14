
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { lazy, Suspense, useEffect } from "react";
import { NavigationManager, getRouteTitle } from "@/utils/navigationUtils";
import { ROUTES } from "@/utils/routeConstants";
import RouteGuard from "./components/RouteGuard";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import NavigationLoader from "./components/Navigation/NavigationLoader";
import BreadcrumbNavigation from "./components/Navigation/BreadcrumbNavigation";
import Enhanced404Page from "./pages/Enhanced404Page";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const SecuritySettings = lazy(() => import("./pages/SecuritySettings"));
const Profile = lazy(() => import("./pages/Profile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Billing = lazy(() => import("./pages/Billing"));
const SubscriptionManagement = lazy(() => import("./pages/SubscriptionManagement"));
const TextEditor = lazy(() => import("./pages/TextEditor"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const DataProtection = lazy(() => import("./pages/DataProtection"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const PricingPolicy = lazy(() => import("./pages/PricingPolicy"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const OtherPolicies = lazy(() => import("./pages/OtherPolicies"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Route wrapper component to handle navigation tracking and title updates
const RouteWrapper: React.FC<{ children: React.ReactNode; path: string }> = ({ children, path }) => {
  useEffect(() => {
    // Update page title
    const title = getRouteTitle(path);
    document.title = title;
    
    // Add to navigation history
    NavigationManager.addToHistory(path, title);
  }, [path]);

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <div className="w-full">
              <RouteErrorBoundary>
                <Suspense fallback={<NavigationLoader isLoading={true} />}>
                  <Routes>
                    {/* Redirect deprecated routes */}
                    <Route 
                      path={ROUTES.GRAMMAR_CHECKER} 
                      element={<Navigate to={ROUTES.APP} replace />} 
                    />
                    
                    {/* Public routes */}
                    <Route path={ROUTES.HOME} element={
                      <RouteWrapper path={ROUTES.HOME}>
                        <Home />
                      </RouteWrapper>
                    } />
                    <Route path={ROUTES.ABOUT} element={
                      <RouteWrapper path={ROUTES.ABOUT}>
                        <About />
                      </RouteWrapper>
                    } />
                    <Route path={ROUTES.CONTACT} element={
                      <RouteWrapper path={ROUTES.CONTACT}>
                        <Contact />
                      </RouteWrapper>
                    } />
                    <Route path={ROUTES.PRIVACY} element={
                      <RouteWrapper path={ROUTES.PRIVACY}>
                        <Privacy />
                      </RouteWrapper>
                    } />
                    <Route path={ROUTES.TERMS} element={
                      <RouteWrapper path={ROUTES.TERMS}>
                        <Terms />
                      </RouteWrapper>
                    } />
                    <Route path={ROUTES.PRICING} element={
                      <RouteWrapper path={ROUTES.PRICING}>
                        <Pricing />
                      </RouteWrapper>
                    } />
                    <Route path={ROUTES.DATA_PROTECTION} element={
                      <RouteWrapper path="/data-protection">
                        <DataProtection />
                      </RouteWrapper>
                    } />
                    <Route path={ROUTES.DISCLAIMER} element={
                      <RouteWrapper path="/disclaimer">
                        <Disclaimer />
                      </RouteWrapper>
                    } />
                    <Route path={ROUTES.REFUND_POLICY} element={
                      <RouteWrapper path="/refund-policy">
                        <RefundPolicy />
                      </RouteWrapper>
                    } />
                    <Route path={ROUTES.PRICING_POLICY} element={
                      <RouteWrapper path="/pricing-policy">
                        <PricingPolicy />
                      </RouteWrapper>
                    } />
                    <Route path={ROUTES.SHIPPING_POLICY} element={
                      <RouteWrapper path="/shipping-policy">
                        <ShippingPolicy />
                      </RouteWrapper>
                    } />
                    <Route path={ROUTES.OTHER_POLICIES} element={
                      <RouteWrapper path="/other-policies">
                        <OtherPolicies />
                      </RouteWrapper>
                    } />
                    
                    {/* Auth routes */}
                    <Route path={ROUTES.LOGIN} element={
                      <RouteWrapper path={ROUTES.LOGIN}>
                        <Login />
                      </RouteWrapper>
                    } />
                    <Route path={ROUTES.REGISTER} element={
                      <RouteWrapper path={ROUTES.REGISTER}>
                        <Register />
                      </RouteWrapper>
                    } />
                    <Route path={ROUTES.FORGOT_PASSWORD} element={
                      <RouteWrapper path={ROUTES.FORGOT_PASSWORD}>
                        <ForgotPassword />
                      </RouteWrapper>
                    } />
                    <Route path={ROUTES.RESET_PASSWORD} element={
                      <RouteWrapper path={ROUTES.RESET_PASSWORD}>
                        <ResetPassword />
                      </RouteWrapper>
                    } />
                    <Route path={ROUTES.VERIFY_EMAIL} element={
                      <RouteWrapper path={ROUTES.VERIFY_EMAIL}>
                        <VerifyEmail />
                      </RouteWrapper>
                    } />
                    
                    {/* Protected routes with guards */}
                    <Route path={ROUTES.APP} element={
                      <RouteGuard>
                        <RouteWrapper path={ROUTES.APP}>
                          <BreadcrumbNavigation />
                          <Index />
                        </RouteWrapper>
                      </RouteGuard>
                    } />
                    <Route path={ROUTES.DASHBOARD} element={
                      <RouteGuard>
                        <RouteWrapper path={ROUTES.DASHBOARD}>
                          <BreadcrumbNavigation />
                          <Dashboard />
                        </RouteWrapper>
                      </RouteGuard>
                    } />
                    <Route path={ROUTES.PROFILE} element={
                      <RouteGuard>
                        <RouteWrapper path={ROUTES.PROFILE}>
                          <BreadcrumbNavigation />
                          <Profile />
                        </RouteWrapper>
                      </RouteGuard>
                    } />
                    <Route path={ROUTES.SECURITY} element={
                      <RouteGuard>
                        <RouteWrapper path={ROUTES.SECURITY}>
                          <BreadcrumbNavigation />
                          <SecuritySettings />
                        </RouteWrapper>
                      </RouteGuard>
                    } />
                    <Route path={ROUTES.BILLING} element={
                      <RouteGuard>
                        <RouteWrapper path={ROUTES.BILLING}>
                          <BreadcrumbNavigation />
                          <Billing />
                        </RouteWrapper>
                      </RouteGuard>
                    } />
                    <Route path={ROUTES.SUBSCRIPTION} element={
                      <RouteGuard>
                        <RouteWrapper path={ROUTES.SUBSCRIPTION}>
                          <BreadcrumbNavigation />
                          <SubscriptionManagement />
                        </RouteWrapper>
                      </RouteGuard>
                    } />
                    <Route path={ROUTES.TEXT_EDITOR} element={
                      <RouteGuard>
                        <RouteWrapper path={ROUTES.TEXT_EDITOR}>
                          <BreadcrumbNavigation />
                          <TextEditor />
                        </RouteWrapper>
                      </RouteGuard>
                    } />
                    
                    {/* Admin routes with enhanced guards */}
                    <Route path={ROUTES.ADMIN} element={
                      <RouteGuard>
                        <RouteWrapper path={ROUTES.ADMIN}>
                          <BreadcrumbNavigation />
                          <Admin />
                        </RouteWrapper>
                      </RouteGuard>
                    } />
                    <Route path={ROUTES.ADMIN_USERS} element={
                      <RouteGuard>
                        <RouteWrapper path={ROUTES.ADMIN_USERS}>
                          <BreadcrumbNavigation />
                          <AdminUsers />
                        </RouteWrapper>
                      </RouteGuard>
                    } />
                    
                    {/* Enhanced 404 route */}
                    <Route path="*" element={<Enhanced404Page />} />
                  </Routes>
                </Suspense>
              </RouteErrorBoundary>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import RefundPolicy from "./pages/RefundPolicy";
import DataProtection from "./pages/DataProtection";
import OtherPolicies from "./pages/OtherPolicies";
import PricingPolicy from "./pages/PricingPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/Admin/Dashboard";
import ContactSubmissions from "./pages/Admin/ContactSubmissions";
import UserManagement from "./pages/Admin/UserManagement";
import Analytics from "./pages/Admin/Analytics";
import Subscriptions from "./pages/Admin/Subscriptions";
import Settings from "./pages/Admin/Settings";
import Billing from "@/pages/Billing";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClient>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/pricing-policy" element={<PricingPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/data-protection" element={<DataProtection />} />
              <Route path="/other-policies" element={<OtherPolicies />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/grammar-checker" 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <AdminRoute>
                    <Analytics />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/subscriptions" 
                element={
                  <AdminRoute>
                    <Subscriptions />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <AdminRoute>
                    <Settings />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/contacts" 
                element={
                  <AdminRoute>
                    <ContactSubmissions />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <AdminRoute>
                    <UserManagement />
                  </AdminRoute>
                } 
              />
              
              <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClient>
  );
}

export default App;

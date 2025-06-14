
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import SecuritySettings from "./pages/SecuritySettings";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Pricing from "./pages/Pricing";
import Billing from "./pages/Billing";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import TextEditor from "./pages/TextEditor";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";
import DataProtection from "./pages/DataProtection";
import Disclaimer from "./pages/Disclaimer";
import RefundPolicy from "./pages/RefundPolicy";
import PricingPolicy from "./pages/PricingPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import OtherPolicies from "./pages/OtherPolicies";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/data-protection" element={<DataProtection />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/pricing-policy" element={<PricingPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/other-policies" element={<OtherPolicies />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              
              {/* Protected routes */}
              <Route path="/app" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/security" element={<ProtectedRoute><SecuritySettings /></ProtectedRoute>} />
              <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
              <Route path="/subscription-management" element={<ProtectedRoute><SubscriptionManagement /></ProtectedRoute>} />
              <Route path="/text-editor" element={<ProtectedRoute><TextEditor /></ProtectedRoute>} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

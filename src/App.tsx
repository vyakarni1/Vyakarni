import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
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
import Billing from "@/pages/Billing";
import AdminRoute from "./components/AdminRoute";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import AdminDictionary from "./pages/AdminDictionary";
import AdminEmailManagement from "./pages/AdminEmailManagement";
import AdminBlog from "./pages/AdminBlog";
import AdminBlogCreate from "./pages/AdminBlogCreate";
import AdminBlogEdit from "./pages/AdminBlogEdit";
import AdminContacts from "./pages/AdminContacts";
import AdminInvoices from "./pages/AdminInvoices";
import AdminSettings from "./pages/AdminSettings";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminUserCorrections from "./pages/AdminUserCorrections";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import HindiGrammarCheckerGuide from "./pages/HindiGrammarCheckerGuide";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
               <Route path="/blog" element={<Blog />} />
               <Route path="/blog/:slug" element={<BlogPost />} />
               <Route path="/hindi-grammar-checker-complete-guide" element={<HindiGrammarCheckerGuide />} />
               
              {/* Grammar Checker Routes - both protected and alternative routes */}
              <Route 
                path="/hindi-grammar-checker-and-correction" 
                element={
                  <ProtectedRoute>
                    <Index />
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
              <Route 
                path="/vyakarni" 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              
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
              <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/dictionary" 
                element={
                  <AdminRoute>
                    <AdminDictionary />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/emails" 
                element={
                  <AdminRoute>
                    <AdminEmailManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/blog" 
                element={
                  <AdminRoute>
                    <AdminBlog />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/blog/create" 
                element={
                  <AdminRoute>
                    <AdminBlogCreate />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/blog/edit/:id" 
                element={
                  <AdminRoute>
                    <AdminBlogEdit />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/contacts" 
                element={
                  <AdminRoute>
                    <AdminContacts />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/invoices" 
                element={
                  <AdminRoute>
                    <AdminInvoices />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <AdminRoute>
                    <AdminSettings />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <AdminRoute>
                    <AdminAnalytics />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/corrections" 
                element={
                  <AdminRoute>
                    <AdminUserCorrections />
                  </AdminRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import GrammarChecker from './pages/GrammarChecker';
import StyleChecker from './pages/StyleChecker';
import WordCounter from './pages/WordCounter';
import ProtectedRoute from './components/ProtectedRoute';
import AccountSettings from './pages/AccountSettings';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import UserManagement from './pages/Admin/UserManagement';
import SubscriptionManagement from './pages/Admin/SubscriptionManagement';
import DictionaryManagement from './pages/Admin/DictionaryManagement';
import AnalyticsDashboard from './pages/Admin/AnalyticsDashboard';
import { Toaster } from "@/components/ui/toaster"

import AdminCleanup from "@/pages/AdminCleanup";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/grammar-checker" element={
            <ProtectedRoute>
              <GrammarChecker />
            </ProtectedRoute>
          } />
          <Route path="/style-checker" element={
            <ProtectedRoute>
              <StyleChecker />
            </ProtectedRoute>
          } />
          <Route path="/word-counter" element={
            <ProtectedRoute>
              <WordCounter />
            </ProtectedRoute>
          } />
          <Route path="/account-settings" element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/subscriptions" element={
            <ProtectedRoute>
              <AdminRoute>
                <SubscriptionManagement />
              </AdminRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/dictionary" element={
            <ProtectedRoute>
              <AdminRoute>
                <DictionaryManagement />
              </AdminRoute>
            </ProtectedRoute>
          } />
           <Route path="/admin/analytics" element={
            <ProtectedRoute>
              <AdminRoute>
                <AnalyticsDashboard />
              </AdminRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/cleanup" element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminCleanup />
              </AdminRoute>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;

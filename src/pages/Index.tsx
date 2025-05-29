
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import GrammarChecker from "@/components/GrammarChecker";
import { UsageLimitDisplay } from "@/components/UsageLimitDisplay";
import { useEffect } from "react";
import Layout from "@/components/Layout";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto py-4 sm:py-8">
          <UsageLimitDisplay />
          <GrammarChecker />
        </div>
      </div>
    </Layout>
  );
};

export default Index;

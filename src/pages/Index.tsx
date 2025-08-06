import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import GrammarChecker from "@/components/GrammarChecker";
import WordBalanceDisplay from "@/components/WordBalanceDisplay";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Helmet } from "react-helmet-async";

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
      <Helmet>
        <title>Hindi Grammar Checker and Correction - व्याकरण जाँच | Free Online Hindi Grammar Tool</title>
        <meta name="description" content="Free online Hindi Grammar Checker and Correction tool. Check and correct Hindi grammar, spelling, and punctuation errors instantly. Advanced व्याकरण जाँच for perfect Hindi writing." />
        <meta name="keywords" content="Hindi Grammar Checker, व्याकरण जाँच, Hindi correction, Hindi spelling checker, Hindi grammar tool, Hindi writing tool" />
        <meta property="og:title" content="Hindi Grammar Checker and Correction - व्याकरण जाँच" />
        <meta property="og:description" content="Free online Hindi Grammar Checker and Correction tool. Check and correct Hindi grammar, spelling, and punctuation errors instantly." />
        <meta name="twitter:title" content="Hindi Grammar Checker and Correction - व्याकरण जाँच" />
        <meta name="twitter:description" content="Free online Hindi Grammar Checker and Correction tool. Check and correct Hindi grammar, spelling, and punctuation errors instantly." />
        <link rel="canonical" href="https://yourdomain.com/hindi-grammar-checker-and-correction" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto py-4 sm:py-8">
          <WordBalanceDisplay />
          <GrammarChecker />
        </div>
      </div>
    </Layout>
  );
};

export default Index;

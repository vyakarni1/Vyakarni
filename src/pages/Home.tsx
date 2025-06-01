
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UnifiedNavigation from "@/components/UnifiedNavigation";
import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import HowItWorksSection from "@/components/Home/HowItWorksSection";
import Footer from "@/components/Footer";
import CounterSection from "@/components/CounterSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingPreviewSection from "@/components/PricingPreviewSection";
import FAQSection from "@/components/FAQSection";
import USPSection from "@/components/USPSection";
import CTABanner from "@/components/CTABanner";
import MarqueeBar from "@/components/MarqueeBar";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const error = searchParams.get('error');
    const errorCode = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');

    if (error && errorCode) {
      console.log('Auth error detected:', { error, errorCode, errorDescription });
      
      // Handle specific error cases
      if (errorCode === 'otp_expired') {
        toast.error("पासवर्ड रीसेट लिंक की समय सीमा समाप्त हो गई है", {
          description: "कृपया नया पासवर्ड रीसेट लिंक मांगें",
          action: {
            label: "नया लिंक मांगें",
            onClick: () => navigate('/forgot-password')
          },
          duration: 8000
        });
      } else if (error === 'access_denied') {
        toast.error("पासवर्ड रीसेट लिंक अमान्य है", {
          description: "यह लिंक गलत है या इसकी समय सीमा समाप्त हो गई है",
          action: {
            label: "नया लिंक मांगें",
            onClick: () => navigate('/forgot-password')
          },
          duration: 8000
        });
      } else {
        // Generic auth error
        toast.error("प्रमाणीकरण त्रुटि", {
          description: errorDescription || "कुछ गलत हुआ है, कृपया पुनः प्रयास करें",
          duration: 6000
        });
      }

      // Clean up URL parameters after showing the error
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('error');
      newSearchParams.delete('error_code');
      newSearchParams.delete('error_description');
      
      // Update URL without these parameters
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <UnifiedNavigation variant="home" />
      <MarqueeBar />
      <div className="pt-24">
        <HeroSection />
        <FeaturesSection />
        <USPSection />
        <CounterSection />
        <HowItWorksSection />
        <PricingPreviewSection />
        <TestimonialsSection />
        <FAQSection />
        <CTABanner />
        <Footer />
      </div>
    </div>
  );
};

export default Home;

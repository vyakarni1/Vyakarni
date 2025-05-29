
import Navigation from "@/components/Home/Navigation";
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

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <Navigation />
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
  );
};

export default Home;

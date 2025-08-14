
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import HindiTextAnimation from "@/components/HindiTextAnimation";

interface HeroSectionProps {
  content: {
    title: string;
    subtitle: string;
    description: string;
    subdescription: string;
    freeTrialText: string;
    quickResultsText: string;
    startButtonText: string;
  };
}

const HeroSection = ({ content }: HeroSectionProps) => {
  return (
    <section className="container mx-auto px-6 pt-20 pb-16 text-center relative">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-32 right-20 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-pulse delay-75"></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-cyan-200 rounded-full opacity-25 animate-pulse delay-150"></div>
      
      <div className="relative z-10 w-full mt-12">
        {/* Transparent Logo Container */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-transparent">
            <img 
              alt="व्याकरणी Logo - Online Hindi grammar checker and correction AI tool" 
              onError={e => {
                console.log('Hero logo failed to load');
                e.currentTarget.style.display = 'none';
              }} 
              className="w-full h-full object-contain" 
              src="/lovable-uploads/c3ed7ddf-6967-4d12-b28b-186bc3c15826.png" 
            />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-6 bg-gradient-blue-ocean bg-clip-text text-transparent animate-fade-in leading-tight">
          {content.title}
          <br />
          <span className="text-6xl">{content.subtitle}</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-75">
          {content.description}
          <br />
          {content.subdescription}
        </p>
        
        <div className="flex justify-center space-x-4 mb-8">
          <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <div className="h-4 w-4 bg-gradient-blue-ocean rounded-full"></div>
            <span className="text-sm text-gray-600">{content.freeTrialText}</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">{content.quickResultsText}</span>
          </div>
        </div>
        
        <Link to="/register" onClick={() => {
          if (typeof gtag_report_conversion !== 'undefined') {
            gtag_report_conversion();
          }
        }}>
          <Button size="lg" className="text-lg px-8 py-4 bg-gradient-blue-ocean hover:bg-gradient-blue-deep transform hover:scale-105 transition-all duration-300 shadow-xl group">
            {content.startButtonText}
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>
        
        {/* Hindi Text Animation Demo */}
        <div className="mt-16 relative">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl mx-auto transform hover:scale-105 transition-transform duration-500 border border-blue-100">
            <HindiTextAnimation />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

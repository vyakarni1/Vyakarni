
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import HindiTextAnimation from "@/components/HindiTextAnimation";

const HeroSection = () => {
  return (
    <section className="container mx-auto px-6 py-20 text-center relative min-h-screen flex items-center">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-32 right-20 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-pulse delay-75"></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-cyan-200 rounded-full opacity-25 animate-pulse delay-150"></div>
      
      <div className="relative z-10 w-full">
        {/* Transparent Logo Container */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-transparent">
            <img 
              alt="व्याकरणी Logo" 
              onError={e => {
                console.log('Hero logo failed to load');
                e.currentTarget.style.display = 'none';
              }} 
              src="/lovable-uploads/9899ecd1-1a2c-404a-bfd9-83a555e6cfc4.png" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-6 bg-gradient-blue-ocean bg-clip-text text-transparent animate-fade-in leading-tight">
          AI के साथ हिंदी लेखन
          <br />
          <span className="text-5xl">सुधारें</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-75">
          आधुनिक AI तकनीक का उपयोग कर अपने हिंदी पाठ को तुरंत सुधारें।
          <br />
          व्याकरण की त्रुटियों को <span className="font-semibold bg-gradient-blue-deep bg-clip-text text-transparent">एक क्लिक</span> में ठीक करें।
        </p>
        
        <div className="flex justify-center space-x-4 mb-8">
          <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <div className="h-4 w-4 bg-gradient-blue-ocean rounded-full"></div>
            <span className="text-sm text-gray-600">निःशुल्क परीक्षण</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">त्वरित परिणाम</span>
          </div>
        </div>
        
        <Link to="/register">
          <Button size="lg" className="text-lg px-8 py-4 bg-gradient-blue-ocean hover:bg-gradient-blue-deep transform hover:scale-105 transition-all duration-300 shadow-xl group">
            तत्काल आरम्भ करें
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

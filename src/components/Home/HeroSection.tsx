
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import ConchShell from "@/components/ui/ConchShell";

const HeroSection = () => {
  return (
    <section className="container mx-auto px-6 py-20 text-center relative">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse delay-75"></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-pink-200 rounded-full opacity-25 animate-pulse delay-150"></div>
      
      <div className="relative z-10">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <ConchShell className="h-16 w-16 animate-pulse" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in leading-tight">
          AI के साथ हिंदी लेखन
          <br />
          <span className="text-5xl">सुधारें</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-75">
          आधुनिक AI तकनीक का उपयोग कर अपने हिंदी पाठ को तुरंत सुधारें।
          <br />
          व्याकरण की त्रुटियों को <span className="font-semibold text-purple-600">एक क्लिक</span> में ठीक करें।
        </p>
        
        <div className="flex justify-center space-x-4 mb-8">
          <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <ConchShell className="h-4 w-4" />
            <span className="text-sm text-gray-600">निःशुल्क परीक्षण</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-600">त्वरित परिणाम</span>
          </div>
        </div>
        
        <Link to="/register">
          <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl group">
            प्रयोग करें एवं जाँचे
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>
        
        {/* Hero Image */}
        <div className="mt-16 relative">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl mx-auto transform hover:scale-105 transition-transform duration-500">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop" 
              alt="व्याकरणी का उपयोग करती महिला"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

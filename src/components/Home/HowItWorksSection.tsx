
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface HowItWorksSectionProps {
  content: {
    title: string;
    description: string;
    step1: {
      title: string;
      description: string;
    };
    step2: {
      title: string;
      description: string;
    };
    step3: {
      title: string;
      description: string;
    };
    buttonText: string;
  };
}

const HowItWorksSection = ({ content }: HowItWorksSectionProps) => {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-cyan-50 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{content.title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{content.description}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce"></div>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">{content.step1.title}</h3>
            <p className="text-gray-600 leading-relaxed">{content.step1.description}</p>
          </div>
          
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce delay-75"></div>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">{content.step2.title}</h3>
            <p className="text-gray-600 leading-relaxed">{content.step2.description}</p>
          </div>
          
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce delay-150"></div>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">{content.step3.title}</h3>
            <p className="text-gray-600 leading-relaxed">{content.step3.description}</p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link to="/register">
            <Button size="lg" className="bg-gradient-blue-primary hover:bg-gradient-blue-secondary text-white px-8 py-3 transform hover:scale-105 transition-all duration-300 shadow-lg">
              {content.buttonText}
              <Sparkles className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

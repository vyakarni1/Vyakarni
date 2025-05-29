import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
const HowItWorksSection = () => {
  return <section className="bg-gradient-to-r from-gray-50 to-blue-50 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">कैसे काम करता है</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            सिर्फ तीन आसान चरणों में अपने हिंदी टेक्स्ट को सुधारें
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce"></div>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">रजिस्टर करें</h3>
            <p className="text-gray-600 leading-relaxed">निशुल्क खता बनायें एवं तत्काल रूप से कार्य शुरू करें। कोई गुप्त शुल्क नहीं।</p>
          </div>
          
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce delay-75"></div>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">टेक्स्ट लिखें</h3>
            <p className="text-gray-600 leading-relaxed">अपने हिंदी पाठ की प्रविष्टि करें एवं तीव्र गति से सुधारा गया परिणाम प्राप्त करें।</p>
          </div>
          
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce delay-150"></div>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">सुधार पायें</h3>
            <p className="text-gray-600 leading-relaxed">व्याकरण, शब्द-चयन, विराम चिह्न वाक्य-विन्यास एवं भाषा-सौष्ठव को उन्नत करें।</p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link to="/register">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 transform hover:scale-105 transition-all duration-300 shadow-lg">
              अभी आज़माएं
              <Sparkles className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};
export default HowItWorksSection;
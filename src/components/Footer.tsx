
import { Link } from "react-router-dom";
import { Github, Twitter, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              व्याकरणी
            </div>
            <p className="text-gray-400 text-sm">
              हिंदी भाषा के लिए एक उन्नत व्याकरण जांच उपकरण
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-400 transition-all duration-200 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-purple-400 transition-all duration-200 hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-green-400 transition-all duration-200 hover:scale-110"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">त्वरित लिंक</h3>
            <div className="space-y-2">
              <Link 
                to="/about" 
                className="block text-gray-400 hover:text-white transition-colors duration-200 relative group"
              >
                हमारे बारे में
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/contact" 
                className="block text-gray-400 hover:text-white transition-colors duration-200 relative group"
              >
                संपर्क
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/grammar-checker" 
                className="block text-gray-400 hover:text-white transition-colors duration-200 relative group"
              >
                व्याकरण जांच
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Legal Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">कानूनी नीतियाँ</h3>
            <div className="space-y-2">
              <Link 
                to="/privacy" 
                className="block text-gray-400 hover:text-white transition-colors duration-200 relative group"
              >
                गोपनीयता नीति
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/terms" 
                className="block text-gray-400 hover:text-white transition-colors duration-200 relative group"
              >
                सेवा की शर्तें
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/disclaimer" 
                className="block text-gray-400 hover:text-white transition-colors duration-200 relative group"
              >
                अस्वीकरण
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/refund-policy" 
                className="block text-gray-400 hover:text-white transition-colors duration-200 relative group"
              >
                वापसी नीति
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/pricing-policy" 
                className="block text-gray-400 hover:text-white transition-colors duration-200 relative group"
              >
                मूल्य निर्धारण नीति
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Additional Policies & Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">अन्य नीतियाँ</h3>
            <div className="space-y-2">
              <Link 
                to="/data-protection" 
                className="block text-gray-400 hover:text-white transition-colors duration-200 relative group"
              >
                डेटा संरक्षण
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/shipping-policy" 
                className="block text-gray-400 hover:text-white transition-colors duration-200 relative group"
              >
                शिपिंग नीति
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/other-policies" 
                className="block text-gray-400 hover:text-white transition-colors duration-200 relative group"
              >
                अन्य नीतियाँ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            <div className="mt-4 text-gray-400 text-sm">
              <p>ईमेल: support@vyakarni.com</p>
              <p className="mt-1">समय: सोमवार - शुक्रवार</p>
              <p>9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 व्याकरणी. सभी अधिकार सुरक्षित।
          </p>
          <p className="text-gray-400 text-sm flex items-center">
            <Heart className="h-4 w-4 text-red-500 mr-1 animate-bounce-subtle" />
            के साथ भारत में बनाया गया
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import GlobalLanguageToggle from "@/components/GlobalLanguageToggle";

interface HeaderProps {
  variant?: "default" | "transparent";
}

const Header = ({ variant = "default" }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language } = useLanguage();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const headerClasses = variant === "transparent" 
    ? "bg-transparent" 
    : "bg-white/80 backdrop-blur-md shadow-sm border-b";

  const content = {
    english: {
      brand: "Vyakarni",
      about: "About Us",
      contact: "Contact",
      privacy: "Privacy",
      login: "Login",
      register: "Register"
    },
    hindi: {
      brand: "व्याकरणी",
      about: "हमारे बारे में",
      contact: "संपर्क",
      privacy: "गोपनीयता",
      login: "लॉगिन",
      register: "रजिस्टर करें"
    }
  };

  const currentContent = content[language];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClasses}`}>
      {/* Language Toggle */}
      <div className="absolute top-2 right-4 z-60">
        <GlobalLanguageToggle />
      </div>

      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 transition-all duration-200 hover:scale-105"
          >
            <img 
              src="/lovable-uploads/1bf69a70-2442-4bb2-8681-6877bdaeec2d.png" 
              alt={`${currentContent.brand} Logo`}
              className="h-8 w-8"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {currentContent.brand}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
            >
              {currentContent.about}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
            >
              {currentContent.contact}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/privacy" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
            >
              {currentContent.privacy}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <div className="flex space-x-3">
              <Link to="/login">
                <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105">
                  {currentContent.login}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="transition-all duration-200 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  {currentContent.register}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {currentContent.about}
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {currentContent.contact}
              </Link>
              <Link 
                to="/privacy" 
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {currentContent.privacy}
              </Link>
              <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full transition-all duration-200">
                    {currentContent.login}
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600">
                    {currentContent.register}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

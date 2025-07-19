
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import TranslationToggle from "./TranslationToggle";

interface MobileNavigationProps {
  user: any;
  profile: any;
  variant: "home" | "default";
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const MobileNavigation = ({ user, profile, variant, isOpen, onClose, onLogout }: MobileNavigationProps) => {
  const isHome = variant === "home";

  if (!isOpen) return null;

  const handleLinkClick = () => onClose();
  
  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="md:hidden py-4 animate-fade-in">
      <div className="flex flex-col space-y-3">
        {user ? (
          <>
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
              onClick={handleLinkClick}
            >
              <span data-translate data-original="डैशबोर्ड">डैशबोर्ड</span>
            </Link>
            <Link 
              to="/grammar-checker" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
              onClick={handleLinkClick}
            >
              <span data-translate data-original="व्याकरण जाँच">व्याकरण जाँच</span>
            </Link>
            <Link 
              to="/profile" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
              onClick={handleLinkClick}
            >
              <span data-translate data-original="प्रोफाइल">प्रोफाइल</span>
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
              onClick={handleLinkClick}
            >
              <span data-translate data-original="प्राइसिंग">प्राइसिंग</span>
            </Link>
            <TranslationToggle variant="mobile" />
            <div className="pt-3 border-t border-gray-200">
              <div className="px-3 py-2 text-sm text-gray-600">
                <span data-translate data-original="नमस्ते">नमस्ते</span>, {profile?.name || user.email?.split('@')[0]}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="w-full justify-start mt-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span data-translate data-original="लॉग आउट">लॉग आउट</span>
              </Button>
            </div>
          </>
        ) : (
          <>
            {!isHome && (
              <>
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
                  onClick={handleLinkClick}
                >
                  <span data-translate data-original="हमारे बारे में">हमारे बारे में</span>
                </Link>
                <Link 
                  to="/contact" 
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
                  onClick={handleLinkClick}
                >
                  <span data-translate data-original="संपर्क">संपर्क</span>
                </Link>
                <Link 
                  to="/pricing" 
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
                  onClick={handleLinkClick}
                >
                  <span data-translate data-original="प्राइसिंग">प्राइसिंग</span>
                </Link>
              </>
            )}
            <TranslationToggle variant="mobile" />
            <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
              <Link to="/login" onClick={handleLinkClick}>
                <Button variant="outline" size="sm" className="w-full transition-all duration-200">
                  <span data-translate data-original="लॉगिन">लॉगिन</span>
                </Button>
              </Link>
              <Link to="/register" onClick={handleLinkClick}>
                <Button size="sm" className="w-full transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600">
                  <span data-translate data-original="रजिस्टर करें">रजिस्टर करें</span>
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileNavigation;

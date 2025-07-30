
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

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
              डैशबोर्ड
            </Link>
            <Link 
              to="/grammar-checker" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
              onClick={handleLinkClick}
            >
              व्याकरण जाँच
            </Link>
            <Link 
              to="/profile" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
              onClick={handleLinkClick}
            >
              प्रोफाइल
            </Link>
            <Link 
              to="/billing" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
              onClick={handleLinkClick}
            >
              बिलिंग
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
              onClick={handleLinkClick}
            >
              प्राइसिंग
            </Link>
            <Link 
              to="/blog" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
              onClick={handleLinkClick}
            >
              ब्लॉग
            </Link>
            <div className="pt-3 border-t border-gray-200">
              <div className="px-3 py-2 text-sm text-gray-600">
                नमस्ते, {profile?.name || user.email?.split('@')[0]}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="w-full justify-start mt-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                लॉग आउट
              </Button>
            </div>
          </>
        ) : (
          <>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
              onClick={handleLinkClick}
            >
              हमारे बारे में
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
              onClick={handleLinkClick}
            >
              संपर्क
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
              onClick={handleLinkClick}
            >
              प्राइसिंग
            </Link>
            <Link 
              to="/blog" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
              onClick={handleLinkClick}
            >
              ब्लॉग
            </Link>
            <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
              <Link to="/login" onClick={handleLinkClick}>
                <Button variant="outline" size="sm" className="w-full transition-all duration-200">
                  लॉगिन
                </Button>
              </Link>
              <Link to="/register" onClick={handleLinkClick}>
                <Button size="sm" className="w-full transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600">
                  रजिस्टर करयें
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

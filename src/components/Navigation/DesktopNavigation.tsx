
import { Link } from "react-router-dom";
import AuthButtons from "./AuthButtons";
import NotificationDropdown from "./NotificationDropdown";
import TranslationToggle from "./TranslationToggle";

interface DesktopNavigationProps {
  user: any;
  profile: any;
  variant: "home" | "default";
  onLogout: () => void;
}

const DesktopNavigation = ({ user, profile, variant, onLogout }: DesktopNavigationProps) => {
  const isHome = variant === "home";

  return (
    <div className="hidden md:flex items-center space-x-8">
      {user ? (
        <>
          <Link 
            to="/dashboard" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
          >
            <span data-translate data-original="डैशबोर्ड">डैशबोर्ड</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/grammar-checker" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
          >
            <span data-translate data-original="व्याकरण जाँच">व्याकरण जाँच</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/profile" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
          >
            <span data-translate data-original="प्रोफाइल">प्रोफाइल</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/pricing" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
          >
            <span data-translate data-original="प्राइसिंग">प्राइसिंग</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <TranslationToggle variant="desktop" />
          <NotificationDropdown />
          <AuthButtons user={user} profile={profile} variant={variant} onLogout={onLogout} />
        </>
      ) : (
        <>
          {!isHome && (
            <>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
              >
                <span data-translate data-original="हमारे बारे में">हमारे बारे में</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
              >
                <span data-translate data-original="संपर्क">संपर्क</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/pricing" 
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
              >
                <span data-translate data-original="प्राइसिंग">प्राइसिंग</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </>
          )}
          <TranslationToggle variant="desktop" />
          <AuthButtons user={user} profile={profile} variant={variant} onLogout={onLogout} />
        </>
      )}
    </div>
  );
};

export default DesktopNavigation;


import { Link } from "react-router-dom";
import AuthButtons from "./AuthButtons";
import NotificationDropdown from "./NotificationDropdown";

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
            डैशबोर्ड
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/grammar-checker" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
          >
            व्याकरण जाँच
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/profile" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
          >
            प्रोफाइल
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/pricing" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
          >
            प्राइसिंग
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
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
                हमारे बारे में
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
              >
                संपर्क
                <span className="absolute -bottom-1 left-0 w-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/pricing" 
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
              >
                प्राइसिंग
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </>
          )}
          <AuthButtons user={user} profile={profile} variant={variant} onLogout={onLogout} />
        </>
      )}
    </div>
  );
};

export default DesktopNavigation;


import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

interface AuthButtonsProps {
  user: any;
  profile: any;
  variant: "home" | "default";
  onLogout: () => void;
}

const AuthButtons = ({ user, profile, variant, onLogout }: AuthButtonsProps) => {
  const { isAdmin } = useUserRole();
  const isHome = variant === "home";

  if (user) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600 truncate max-w-32 lg:max-w-none">
          नमस्ते, {profile?.name || user.email?.split('@')[0]}
        </span>
        {isAdmin && (
          <Link to="/admin">
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">एडमिन</span>
            </Button>
          </Link>
        )}
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-1" />
          लॉग आउट
        </Button>
      </div>
    );
  }

  return (
    <div className="flex space-x-3">
      <Link to="/login">
        <Button 
          variant="outline" 
          size="sm" 
          className={`transition-all duration-200 ${isHome ? 'hover:bg-blue-50 hover:border-blue-300 transition-all duration-300' : 'hover:scale-105'}`}
        >
          लॉगिन
        </Button>
      </Link>
      <Link to="/register" onClick={() => {
        if (typeof gtag_report_conversion !== 'undefined') {
          gtag_report_conversion();
        }
      }}>
        <Button 
          size="sm" 
          className={`transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 ${isHome ? 'transform hover:scale-105 transition-all duration-300 shadow-lg' : 'hover:scale-105'}`}
        >
          रजिस्टर करें
        </Button>
      </Link>
    </div>
  );
};

export default AuthButtons;

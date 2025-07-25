
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import NavigationLogo from "@/components/Navigation/NavigationLogo";
import DesktopNavigation from "@/components/Navigation/DesktopNavigation";
import MobileNavigation from "@/components/Navigation/MobileNavigation";

interface UnifiedNavigationProps {
  variant?: "home" | "default";
  className?: string;
}

const UnifiedNavigation = ({ variant = "default", className = "" }: UnifiedNavigationProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile } = useProfile(user?.id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("सफलतापूर्वक लॉग आउट हो गए!");
      navigate("/");
    } catch (error) {
      toast.error("लॉग आउट में त्रुटि");
    }
  };

  const isHome = variant === "home";
  
  // Fixed positioning for both variants to prevent hiding
  const headerClasses = "bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-200/30 fixed top-0 left-0 right-0 z-50 transition-all duration-300";

  const containerClasses = "container mx-auto px-6";
  const navClasses = "flex items-center justify-between h-16";

  return (
    <header className={`${headerClasses} ${className}`}>
      <div className={containerClasses}>
        <nav className={navClasses}>
          {/* Logo */}
          <NavigationLogo variant={variant} />

          {/* Desktop Navigation */}
          <DesktopNavigation 
            user={user}
            profile={profile}
            variant={variant}
            onLogout={handleLogout}
          />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label={isMobileMenuOpen ? "मेनू बंद करें" : "मेनू खोलें"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        <MobileNavigation
          user={user}
          profile={profile}
          variant={variant}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};

export default UnifiedNavigation;

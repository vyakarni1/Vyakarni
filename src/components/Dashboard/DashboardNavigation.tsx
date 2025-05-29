
import { Button } from "@/components/ui/button";
import { LogOut, User, Sparkles, Coins } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface DashboardNavigationProps {
  profile: any;
  userEmail: string;
  balance: number;
}

const DashboardNavigation = ({ profile, userEmail, balance }: DashboardNavigationProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("सफलतापूर्वक लॉग आउट हो गए!");
      navigate("/");
    } catch (error) {
      toast.error("लॉग आउट में त्रुटि");
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              व्याकरणी
            </div>
            <Sparkles className="h-6 w-6 text-purple-500" />
            <div className="hidden md:flex items-center ml-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-3 py-1">
              <Coins className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm font-medium text-gray-700">{balance} शब्द</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700 font-medium">{profile?.name || userEmail?.split('@')[0]}</span>
            </div>
            <Button variant="outline" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600 hover:border-red-200">
              <LogOut className="h-4 w-4 mr-2" />
              लॉग आउट
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavigation;

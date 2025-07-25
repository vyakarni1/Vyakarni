
import { TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardWelcomeProps {
  profile: any;
  userEmail: string;
  balance: number;
}

const DashboardWelcome = ({ profile, userEmail, balance }: DashboardWelcomeProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          डैशबोर्ड
        </h1>
        <TrendingUp className="h-8 w-8 text-blue-500" />
      </div>
      <p className="text-lg text-gray-600">आपके शब्द बैलेंस और उपयोग का विस्तृत अवलोकन</p>
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile?.avatar_url} alt="Profile" />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-bold">
              {(profile?.name || userEmail?.split('@')[0] || 'U')[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-blue-800">
            🎉 नमस्कार <span className="font-semibold">{profile?.name || userEmail?.split('@')[0]}</span>! 
            आपके पास <span className="font-bold">{balance} शब्द</span> उपलब्ध हैं।
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardWelcome;


import { Coins } from "lucide-react";

interface DashboardFooterStatsProps {
  balance: number;
}

const DashboardFooterStats = ({ balance }: DashboardFooterStatsProps) => {
  return (
    <div className="mt-12 text-center">
      <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
        <Coins className="h-5 w-5 text-blue-500" />
        <span className="text-gray-600">आपका बैलेंस:</span>
        <span className="font-bold text-blue-600 text-lg">
          {balance} शब्द
        </span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-600">हिंदी लेखन को बेहतर बनाने के लिए यहां हैं</span>
      </div>
    </div>
  );
};

export default DashboardFooterStats;

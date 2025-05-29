
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

const SystemInformation = () => {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-gray-600" />
          <span>सिस्टम जानकारी</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">एप्लिकेशन संस्करण</h4>
            <p className="text-2xl font-bold text-blue-600">v2.1.0</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">डेटाबेस आकार</h4>
            <p className="text-2xl font-bold text-green-600">2.4 GB</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">अंतिम बैकअप</h4>
            <p className="text-2xl font-bold text-purple-600">2 घंटे पहले</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemInformation;

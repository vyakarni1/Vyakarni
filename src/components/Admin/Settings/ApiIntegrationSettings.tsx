
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';

const ApiIntegrationSettings = () => {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5 text-purple-600" />
          <span>API और एकीकरण</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>OpenAI API स्थिति</Label>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">कनेक्टेड</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Razorpay पेमेंट स्थिति</Label>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">कॉन्फ़िगर्ड</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Supabase डेटाबेस</Label>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">कनेक्टेड</span>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          API कुंजी पुनर्जनन करें
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApiIntegrationSettings;

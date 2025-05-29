
import { Button } from '@/components/ui/button';
import { Save, RefreshCw, Loader2 } from 'lucide-react';

interface SettingsHeaderProps {
  hasChanges: boolean;
  isUpdating: boolean;
  onSave: () => void;
  onReset: () => void;
}

const SettingsHeader = ({ hasChanges, isUpdating, onSave, onReset }: SettingsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          सिस्टम सेटिंग्स
        </h1>
        <p className="text-gray-600 mt-1">
          एप्लिकेशन कॉन्फ़िगरेशन और सिस्टम प्राथमिकताएं
        </p>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button 
          variant="outline" 
          onClick={onReset}
          disabled={!hasChanges || isUpdating}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>रीसेट</span>
        </Button>
        <Button 
          onClick={onSave}
          disabled={!hasChanges || isUpdating}
          className="flex items-center space-x-2"
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>सेव करें</span>
        </Button>
      </div>
    </div>
  );
};

export default SettingsHeader;

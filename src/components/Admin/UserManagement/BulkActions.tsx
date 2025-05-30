
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Users, 
  Shield, 
  ShieldOff, 
  Trash2, 
  Mail,
  Download 
} from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onBulkAction: (action: string, value?: any) => void;
  isUpdating: boolean;
}

const BulkActions = ({ selectedCount, onBulkAction, isUpdating }: BulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center space-x-2">
        <Users className="h-5 w-5 text-blue-600" />
        <span className="font-medium text-blue-900">
          {selectedCount} उपयोगकर्ता चयनित
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAction('activate')}
          disabled={isUpdating}
          className="flex items-center space-x-1"
        >
          <Shield className="h-4 w-4" />
          <span>सक्रिय करें</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAction('suspend')}
          disabled={isUpdating}
          className="flex items-center space-x-1"
        >
          <ShieldOff className="h-4 w-4" />
          <span>निलंबित करें</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAction('email')}
          disabled={isUpdating}
          className="flex items-center space-x-1"
        >
          <Mail className="h-4 w-4" />
          <span>ईमेल भेजें</span>
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onBulkAction('delete')}
          disabled={isUpdating}
          className="flex items-center space-x-1"
        >
          <Trash2 className="h-4 w-4" />
          <span>हटाएं</span>
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;

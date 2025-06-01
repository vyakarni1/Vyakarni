
import { Button } from "@/components/ui/button";
import { X, AlertCircle } from "lucide-react";

interface PasswordChangeFormProps {
  onClose: () => void;
}

const PasswordChangeForm = ({ onClose }: PasswordChangeFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">पासवर्ड बदलें</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">पासवर्ड परिवर्तन उपलब्ध नहीं:</p>
            <p>पासवर्ड बदलने की सुविधा अस्थायी रूप से अक्षम है। कृपया समर्थन से संपर्क करें।</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          बंद करें
        </Button>
      </div>
    </div>
  );
};

export default PasswordChangeForm;

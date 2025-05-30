
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, X } from "lucide-react";

interface PasswordChangeFormProps {
  onClose: () => void;
}

const PasswordChangeForm = ({ onClose }: PasswordChangeFormProps) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      toast.error("नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते");
      return;
    }

    if (passwords.new.length < 6) {
      toast.error("पासवर्ड कम से कम 6 अक्षर का होना चाहिए");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });

      if (error) throw error;

      toast.success("पासवर्ड सफलतापूर्वक बदल दिया गया!");
      onClose();
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || "पासवर्ड बदलने में त्रुटि");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">पासवर्ड बदलें</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-password">नया पासवर्ड *</Label>
        <div className="relative">
          <Input
            id="new-password"
            type={showPasswords.new ? "text" : "password"}
            value={passwords.new}
            onChange={(e) => handlePasswordChange('new', e.target.value)}
            placeholder="नया पासवर्ड दर्ज करें"
            required
            minLength={6}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => togglePasswordVisibility('new')}
          >
            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">पासवर्ड की पुष्टि करें *</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showPasswords.confirm ? "text" : "password"}
            value={passwords.confirm}
            onChange={(e) => handlePasswordChange('confirm', e.target.value)}
            placeholder="पासवर्ड की पुष्टि करें"
            required
            minLength={6}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => togglePasswordVisibility('confirm')}
          >
            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "बदला जा रहा है..." : "पासवर्ड बदलें"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          रद्द करें
        </Button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;

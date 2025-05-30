
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, X, Check } from "lucide-react";
import { usePasswordChange } from "@/hooks/usePasswordChange";

interface PasswordChangeFormProps {
  onClose: () => void;
}

const PasswordChangeForm = ({ onClose }: PasswordChangeFormProps) => {
  const {
    passwords,
    showPasswords,
    errors,
    isLoading,
    updatePassword,
    togglePasswordVisibility,
    changePassword,
    reset
  } = usePasswordChange();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await changePassword();
    if (success) {
      reset();
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">पासवर्ड बदलें</h3>
        <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
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
            onChange={(e) => updatePassword('new', e.target.value)}
            placeholder="नया पासवर्ड दर्ज करें"
            required
            minLength={6}
            className={errors.new ? "border-red-500" : ""}
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
        {errors.new && <p className="text-xs text-red-500">{errors.new}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">पासवर्ड की पुष्टि करें *</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showPasswords.confirm ? "text" : "password"}
            value={passwords.confirm}
            onChange={(e) => updatePassword('confirm', e.target.value)}
            placeholder="पासवर्ड की पुष्टि करें"
            required
            minLength={6}
            className={errors.confirm ? "border-red-500" : ""}
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
        {errors.confirm && <p className="text-xs text-red-500">{errors.confirm}</p>}
      </div>

      {/* Password strength indicator */}
      {passwords.new && (
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">पासवर्ड की मजबूती:</Label>
          <div className="space-y-1">
            <div className={`flex items-center text-xs ${passwords.new.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
              <Check className="h-3 w-3 mr-1" />
              कम से कम 6 अक्षर
            </div>
            <div className={`flex items-center text-xs ${/[A-Z]/.test(passwords.new) ? 'text-green-600' : 'text-gray-400'}`}>
              <Check className="h-3 w-3 mr-1" />
              कम से कम एक बड़ा अक्षर
            </div>
            <div className={`flex items-center text-xs ${/[0-9]/.test(passwords.new) ? 'text-green-600' : 'text-gray-400'}`}>
              <Check className="h-3 w-3 mr-1" />
              कम से कम एक संख्या
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-4 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "बदला जा रहा है..." : "पासवर्ड बदलें"}
        </Button>
        <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
          रद्द करें
        </Button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;

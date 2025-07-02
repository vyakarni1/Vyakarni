
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Eye, EyeOff } from "lucide-react";
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">पासवर्ड बदलें</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">वर्तमान पासवर्ड</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              value={passwords.current}
              onChange={(e) => updatePassword('current', e.target.value)}
              placeholder="वर्तमान पासवर्ड डालें"
              required
              className={errors.current ? "border-red-500" : ""}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => togglePasswordVisibility('current')}
            >
              {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.current && <p className="text-xs text-red-500">{errors.current}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">नया पासवर्ड</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPasswords.new ? "text" : "password"}
              value={passwords.new}
              onChange={(e) => updatePassword('new', e.target.value)}
              placeholder="नया पासवर्ड डालें"
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
          <Label htmlFor="confirmPassword">पासवर्ड की पुष्टि करें</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              value={passwords.confirm}
              onChange={(e) => updatePassword('confirm', e.target.value)}
              placeholder="नया पासवर्ड दोबारा डालें"
              required
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

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            पासवर्ड कम से कम 6 अक्षर का होना चाहिए
          </p>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            रद्द करें
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "बदला जा रहा है..." : "पासवर्ड बदलें"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChangeForm;

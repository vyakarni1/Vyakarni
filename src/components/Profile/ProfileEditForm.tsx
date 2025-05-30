
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Lock, Trash2 } from "lucide-react";
import PasswordChangeForm from "./PasswordChangeForm";

interface ProfileEditFormProps {
  profile: any;
  onProfileUpdate: (profile: any) => void;
}

const ProfileEditForm = ({ profile, onProfileUpdate }: ProfileEditFormProps) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;

      onProfileUpdate(data);
      toast.success("प्रोफाइल सफलतापूर्वक अपडेट हो गई!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("प्रोफाइल अपडेट करने में त्रुटि");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">पूरा नाम *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="आपका पूरा नाम"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">फोन नंबर</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+91 9876543210"
              type="tel"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">बायो / परिचय</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="अपने बारे में कुछ बताएं..."
            className="min-h-[100px]"
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "सहेजा जा रहा है..." : "सहेजें"}
        </Button>
      </form>

      {/* Password Change Section */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Lock className="h-5 w-5 mr-2" />
            पासवर्ड बदलें
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showPasswordForm ? (
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordForm(true)}
              className="w-full md:w-auto"
            >
              पासवर्ड बदलें
            </Button>
          ) : (
            <div className="space-y-4">
              <PasswordChangeForm onClose={() => setShowPasswordForm(false)} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-red-600">
            <Trash2 className="h-5 w-5 mr-2" />
            खतरनाक क्षेत्र
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600 mb-4">
            खाता हटाने से आपका सारा डेटा स्थायी रूप से हट जाएगा। यह कार्य वापस नहीं किया जा सकता।
          </p>
          <Button variant="destructive" size="sm">
            खाता हटाएं
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileEditForm;

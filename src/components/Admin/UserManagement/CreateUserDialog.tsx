import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Crown, Shield } from "lucide-react";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

const CreateUserDialog = ({ open, onOpenChange, onUserCreated }: CreateUserDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'user' as 'user' | 'admin' | 'moderator',
    password: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    try {
      // Create the user via Supabase Auth Admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: {
          name: formData.name
        }
      });

      if (authError) {
        throw new Error(`Auth error: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('User creation failed - no user returned');
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: formData.email,
          name: formData.name
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't throw here as the user is already created
      }

      // Assign role if not default user role
      if (formData.role !== 'user') {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: formData.role
          });

        if (roleError) {
          console.error('Role assignment error:', roleError);
          toast({
            title: "चेतावनी",
            description: `उपयोगकर्ता बनाया गया लेकिन भूमिका असाइन नहीं हो सकी: ${roleError.message}`,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "सफलता",
        description: `${formData.role === 'admin' ? 'एडमिन' : formData.role === 'moderator' ? 'मॉडरेटर' : 'उपयोगकर्ता'} सफलतापूर्वक बनाया गया`,
      });

      // Reset form
      setFormData({
        email: '',
        name: '',
        role: 'user',
        password: ''
      });

      onUserCreated();
      onOpenChange(false);

    } catch (error) {
      console.error('User creation error:', error);
      toast({
        title: "त्रुटि",
        description: error instanceof Error ? error.message : "उपयोगकर्ता बनाने में त्रुटि",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>नया उपयोगकर्ता बनाएं</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.target as HTMLInputElement)?.type !== 'submit') {
            e.preventDefault();
          }
        }}>
          <div className="space-y-2">
            <Label htmlFor="email">ईमेल पता *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">नाम</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="उपयोगकर्ता का नाम"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">भूमिका *</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: 'user' | 'admin' | 'moderator') => 
                setFormData(prev => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>नियमित उपयोगकर्ता</span>
                  </div>
                </SelectItem>
                <SelectItem value="moderator">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>मॉडरेटर</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-4 w-4" />
                    <span>एडमिन</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">पासवर्ड *</Label>
            <div className="flex space-x-2">
              <Input
                id="password"
                type="text"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="कम से कम 6 अक्षर"
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="outline"
                onClick={generatePassword}
                disabled={isLoading}
              >
                जेनरेट
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              उपयोगकर्ता को यह पासवर्ड सुरक्षित रूप से भेजना सुनिश्चित करें
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              रद्द करें
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.email || !formData.password}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              उपयोगकर्ता बनाएं
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
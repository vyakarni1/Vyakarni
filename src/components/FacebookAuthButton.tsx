import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FacebookAuthButtonProps {
  mode: "login" | "register";
}

const FacebookAuthButton = ({ mode }: FacebookAuthButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFacebookAuth = async () => {
    setIsLoading(true);
    
    try {
      console.log('Starting Facebook OAuth flow for:', mode);
      
      // Always redirect to vyakarni.com for production
      const redirectTo = 'https://vyakarni.com/dashboard';
      
      console.log('Redirect URL:', redirectTo);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo,
        }
      });

      if (error) {
        console.error('Facebook OAuth error:', error);
        toast.error("Facebook प्रमाणीकरण में त्रुटि: " + error.message);
        return;
      }

      console.log('Facebook OAuth initiated successfully');
      // OAuth redirect will handle the rest
    } catch (error) {
      console.error('Unexpected Facebook OAuth error:', error);
      toast.error("Facebook प्रमाणीकरण में अप्रत्याशित त्रुटि हुई");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      type="button"
      variant="outline"
      onClick={handleFacebookAuth}
      disabled={isLoading}
      className="w-full transition-all duration-200 hover:scale-105 border-gray-300 hover:border-gray-400 animate-fade-in"
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
          Facebook से {mode === "login" ? "लॉगिन" : "रजिस्टर"} हो रहे हैं...
        </div>
      ) : (
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="#1877F2"
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
          Facebook से {mode === "login" ? "लॉगिन करें" : "रजिस्टर करें"}
        </div>
      )}
    </Button>
  );
};

export default FacebookAuthButton;
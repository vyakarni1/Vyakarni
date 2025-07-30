
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authUtils';
import { useWelcomeEmail } from '@/hooks/useWelcomeEmail';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { sendWelcomeEmail } = useWelcomeEmail();

  const signOut = async () => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      setUser(null);
      setSession(null);
      // Force redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          
          // Handle welcome email and profile creation for all users
          setTimeout(async () => {
            try {
              // Check if profile exists
              const { data: profile } = await supabase
                .from('profiles')
                .select('id, welcome_email_sent_at')
                .eq('id', session.user.id)
                .single();
              
              if (!profile) {
                console.log('Creating profile for new user');
                // Create profile if it doesn't exist
                const { error: insertError } = await supabase.from('profiles').insert({
                  id: session.user.id,
                  name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.user_metadata?.first_name,
                  email: session.user.email,
                });
                
                if (insertError) {
                  console.error('Error creating profile:', insertError);
                } else {
                  console.log('Profile created for new user');
                  // Send welcome email for new user
                  if (session.user.email) {
                    console.log('Sending welcome email for new user');
                    await sendWelcomeEmail(
                      session.user.id, 
                      session.user.email, 
                      session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'व्याकरणी यूज़र'
                    );
                  }
                }
              } else if (session.user.email_confirmed_at && !profile.welcome_email_sent_at) {
                // User exists but hasn't received welcome email yet and email is confirmed
                console.log('Sending welcome email for existing user with confirmed email');
                await sendWelcomeEmail(
                  session.user.id, 
                  session.user.email!, 
                  session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'व्याकरणी यूज़र'
                );
              }
            } catch (error) {
              console.error('Error handling user profile and welcome email:', error);
            }
          }, 100);
        } else {
          setSession(null);
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};


import { supabase } from "@/integrations/supabase/client";

// Password strength validation
export interface PasswordStrength {
  score: number; // 0-100
  feedback: string[];
  isValid: boolean;
}

export const validatePasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 25;
  } else {
    feedback.push("कम से कम 8 अक्षर होने चाहिए");
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 20;
  } else {
    feedback.push("कम से कम एक बड़ा अक्षर (A-Z) होना चाहिए");
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 20;
  } else {
    feedback.push("कम से कम एक छोटा अक्षर (a-z) होना चाहिए");
  }

  // Number check
  if (/\d/.test(password)) {
    score += 15;
  } else {
    feedback.push("कम से कम एक संख्या (0-9) होनी चाहिए");
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 20;
  } else {
    feedback.push("कम से कम एक विशेष चिह्न (!@#$%^&*) होना चाहिए");
  }

  return {
    score,
    feedback,
    isValid: score >= 80 && password.length >= 8
  };
};

// Device fingerprinting for security
export const getDeviceFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('Device fingerprint', 10, 10);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  return btoa(fingerprint).slice(0, 32);
};

// Session management
export const getSessionInfo = () => {
  return {
    deviceFingerprint: getDeviceFingerprint(),
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
};

// Enhanced auth state cleanup with better coverage
export const enhancedCleanupAuthState = () => {
  console.log('Enhanced auth state cleanup initiated...');
  
  // Clear all possible auth-related storage
  const storageKeys = [
    'supabase.auth.token',
    'supabase-auth-token',
    'sb-auth-token'
  ];
  
  storageKeys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  
  // Clear all keys that start with auth-related prefixes
  ['localStorage', 'sessionStorage'].forEach(storageType => {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    Object.keys(storage).forEach(key => {
      if (key.includes('supabase') || key.includes('sb-') || key.includes('auth')) {
        storage.removeItem(key);
      }
    });
  });
  
  console.log('Enhanced auth state cleanup completed');
};

// Rate limiting for login attempts
const LOGIN_ATTEMPTS_KEY = 'login_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const checkLoginRateLimit = (email: string): { allowed: boolean; remainingTime?: number } => {
  const attempts = JSON.parse(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '{}');
  const userAttempts = attempts[email];
  
  if (!userAttempts) {
    return { allowed: true };
  }
  
  const now = Date.now();
  const timeSinceLastAttempt = now - userAttempts.lastAttempt;
  
  if (timeSinceLastAttempt > LOCKOUT_DURATION) {
    // Reset attempts after lockout period
    delete attempts[email];
    localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
    return { allowed: true };
  }
  
  if (userAttempts.count >= MAX_ATTEMPTS) {
    const remainingTime = LOCKOUT_DURATION - timeSinceLastAttempt;
    return { allowed: false, remainingTime };
  }
  
  return { allowed: true };
};

export const recordLoginAttempt = (email: string, success: boolean) => {
  const attempts = JSON.parse(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '{}');
  
  if (success) {
    // Clear attempts on successful login
    delete attempts[email];
  } else {
    // Increment failed attempts
    attempts[email] = {
      count: (attempts[email]?.count || 0) + 1,
      lastAttempt: Date.now()
    };
  }
  
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
};

// Check if user email is verified
export const checkEmailVerification = async (user: any) => {
  if (!user) return false;
  
  // Check if email is confirmed
  if (!user.email_confirmed_at) {
    return false;
  }
  
  return true;
};

// Force logout from all devices
export const forceLogoutAllDevices = async () => {
  try {
    enhancedCleanupAuthState();
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) throw error;
    
    // Clear any remaining client state
    window.location.href = '/login';
    return { success: true };
  } catch (error) {
    console.error('Error during force logout:', error);
    return { success: false, error };
  }
};


export const cleanupAuthState = () => {
  console.log('Cleaning up auth state...');
  
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  }
  
  console.log('Auth state cleanup complete');
};

export const handleAuthRedirect = () => {
  const isProduction = window.location.hostname === 'vyakarni.com';
  const targetDomain = isProduction ? 'https://vyakarni.com' : window.location.origin;
  
  // If we're on the wrong domain after auth, redirect to the correct one
  if (!isProduction && window.location.hostname.includes('lovable.app')) {
    console.log('Redirecting from preview domain to production');
    window.location.href = 'https://vyakarni.com/dashboard';
    return true;
  }
  
  return false;
};


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

export const isProductionDomain = () => {
  return window.location.hostname === 'vyakarni.com';
};

export const getAppUrl = () => {
  // Always use production URL for auth redirects to ensure consistency
  return 'https://vyakarni.com';
};

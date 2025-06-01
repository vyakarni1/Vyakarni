
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

export const getPasswordResetUrl = () => {
  return `${getAppUrl()}/reset-password`;
};

export const parseResetPasswordParams = (searchParams: URLSearchParams) => {
  // Handle different URL parameter formats that Supabase might send
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const type = searchParams.get('type');
  const error = searchParams.get('error');
  const errorCode = searchParams.get('error_code');
  const errorDescription = searchParams.get('error_description');

  console.log('Reset password params:', {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    type,
    error,
    errorCode,
    errorDescription
  });

  return {
    accessToken,
    refreshToken,
    type,
    error,
    errorCode,
    errorDescription
  };
};

export const validateResetPasswordAccess = (params: ReturnType<typeof parseResetPasswordParams>) => {
  const { accessToken, refreshToken, type, error } = params;
  
  // If there's an error, return it
  if (error) {
    return { isValid: false, error };
  }
  
  // For password recovery, we need either tokens or type=recovery
  if (type === 'recovery' || (accessToken && refreshToken)) {
    return { isValid: true };
  }
  
  return { isValid: false, error: 'missing_tokens' };
};

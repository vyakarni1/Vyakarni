
export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  PRICING: '/pricing',
  DATA_PROTECTION: '/data-protection',
  DISCLAIMER: '/disclaimer',
  REFUND_POLICY: '/refund-policy',
  PRICING_POLICY: '/pricing-policy',
  SHIPPING_POLICY: '/shipping-policy',
  OTHER_POLICIES: '/other-policies',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  
  // Protected routes
  APP: '/app',
  GRAMMAR_CHECKER: '/grammar-checker', // Will redirect to /app
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SECURITY: '/security',
  BILLING: '/billing',
  SUBSCRIPTION: '/subscription-management',
  TEXT_EDITOR: '/text-editor',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
} as const;

export type RouteKey = keyof typeof ROUTES;

export interface RouteMetadata {
  title: string;
  description?: string;
  requiresAuth: boolean;
  requiresEmailVerification: boolean;
  requiredRoles?: string[];
  breadcrumbLabel: string;
  parent?: string;
  isDeprecated?: boolean;
  redirectTo?: string;
}

export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  [ROUTES.HOME]: {
    title: 'व्याकरणी - मुख्य पृष्ठ',
    description: 'हिंदी व्याकरण जांचकर्ता का मुख्य पृष्ठ',
    requiresAuth: false,
    requiresEmailVerification: false,
    breadcrumbLabel: 'मुख्य पृष्ठ',
  },
  [ROUTES.APP]: {
    title: 'व्याकरणी - व्याकरण जांचकर्ता',
    description: 'हिंदी व्याकरण और शैली जांचकर्ता',
    requiresAuth: true,
    requiresEmailVerification: true,
    breadcrumbLabel: 'व्याकरण जांचकर्ता',
  },
  [ROUTES.GRAMMAR_CHECKER]: {
    title: 'व्याकरणी - व्याकरण जांचकर्ता',
    description: 'हिंदी व्याकरण और शैली जांचकर्ता',
    requiresAuth: true,
    requiresEmailVerification: true,
    breadcrumbLabel: 'व्याकरण जांचकर्ता',
    isDeprecated: true,
    redirectTo: ROUTES.APP,
  },
  [ROUTES.DASHBOARD]: {
    title: 'व्याकरणी - डैशबोर्ड',
    description: 'उपयोगकर्ता डैशबोर्ड',
    requiresAuth: true,
    requiresEmailVerification: true,
    breadcrumbLabel: 'डैशबोर्ड',
  },
  [ROUTES.PROFILE]: {
    title: 'व्याकरणी - प्रोफाइल',
    description: 'उपयोगकर्ता प्रोफाइल सेटिंग्स',
    requiresAuth: true,
    requiresEmailVerification: true,
    breadcrumbLabel: 'प्रोफाइल',
  },
  [ROUTES.SECURITY]: {
    title: 'व्याकरणी - सुरक्षा सेटिंग्स',
    description: 'खाता सुरक्षा सेटिंग्स',
    requiresAuth: true,
    requiresEmailVerification: true,
    breadcrumbLabel: 'सुरक्षा',
  },
  [ROUTES.ADMIN]: {
    title: 'व्याकरणी - एडमिन पैनल',
    description: 'एडमिन डैशबोर्ड',
    requiresAuth: true,
    requiresEmailVerification: true,
    requiredRoles: ['admin'],
    breadcrumbLabel: 'एडमिन',
  },
  [ROUTES.ADMIN_USERS]: {
    title: 'व्याकरणी - उपयोगकर्ता प्रबंधन',
    description: 'उपयोगकर्ता प्रबंधन पैनल',
    requiresAuth: true,
    requiresEmailVerification: true,
    requiredRoles: ['admin'],
    breadcrumbLabel: 'उपयोगकर्ता प्रबंधन',
    parent: ROUTES.ADMIN,
  },
};

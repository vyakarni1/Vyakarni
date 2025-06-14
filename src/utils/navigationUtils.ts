
import { ROUTES, ROUTE_METADATA } from './routeConstants';

export interface NavigationHistoryItem {
  path: string;
  title: string;
  timestamp: number;
}

export class NavigationManager {
  private static history: NavigationHistoryItem[] = [];
  private static maxHistoryLength = 10;

  static addToHistory(path: string, title?: string) {
    const metadata = ROUTE_METADATA[path];
    const historyItem: NavigationHistoryItem = {
      path,
      title: title || metadata?.title || 'पृष्ठ',
      timestamp: Date.now(),
    };

    // Remove duplicate if exists
    this.history = this.history.filter(item => item.path !== path);
    
    // Add to beginning
    this.history.unshift(historyItem);
    
    // Limit history length
    if (this.history.length > this.maxHistoryLength) {
      this.history = this.history.slice(0, this.maxHistoryLength);
    }
  }

  static getHistory(): NavigationHistoryItem[] {
    return [...this.history];
  }

  static getPreviousPage(): NavigationHistoryItem | null {
    return this.history.length > 1 ? this.history[1] : null;
  }

  static canGoBack(): boolean {
    return this.history.length > 1;
  }

  static clearHistory() {
    this.history = [];
  }
}

export const generateBreadcrumbs = (currentPath: string) => {
  const breadcrumbs: Array<{ label: string; path: string; isActive: boolean }> = [];
  
  // Always add home
  breadcrumbs.push({
    label: 'मुख्य पृष्ठ',
    path: ROUTES.HOME,
    isActive: false,
  });

  const metadata = ROUTE_METADATA[currentPath];
  if (!metadata) return breadcrumbs;

  // Add parent if exists
  if (metadata.parent) {
    const parentMetadata = ROUTE_METADATA[metadata.parent];
    if (parentMetadata) {
      breadcrumbs.push({
        label: parentMetadata.breadcrumbLabel,
        path: metadata.parent,
        isActive: false,
      });
    }
  }

  // Add current page
  breadcrumbs.push({
    label: metadata.breadcrumbLabel,
    path: currentPath,
    isActive: true,
  });

  return breadcrumbs;
};

export const getRouteTitle = (path: string): string => {
  const metadata = ROUTE_METADATA[path];
  return metadata?.title || 'व्याकरणी';
};

export const shouldRedirect = (path: string): string | null => {
  const metadata = ROUTE_METADATA[path];
  if (metadata?.isDeprecated && metadata.redirectTo) {
    return metadata.redirectTo;
  }
  return null;
};

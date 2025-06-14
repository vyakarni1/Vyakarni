
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { NavigationManager } from '@/utils/navigationUtils';

interface BackButtonProps {
  fallbackPath?: string;
  className?: string;
}

const BackButton = ({ fallbackPath = '/dashboard', className = '' }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (NavigationManager.canGoBack()) {
      const previousPage = NavigationManager.getPreviousPage();
      if (previousPage) {
        navigate(previousPage.path);
        return;
      }
    }
    
    // Fallback to provided path or dashboard
    navigate(fallbackPath);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleBack}
      className={`transition-all duration-200 hover:scale-105 ${className}`}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      वापस जाएं
    </Button>
  );
};

export default BackButton;

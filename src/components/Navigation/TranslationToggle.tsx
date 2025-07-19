
import { Languages, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';

interface TranslationToggleProps {
  variant?: 'desktop' | 'mobile';
}

const TranslationToggle = ({ variant = 'desktop' }: TranslationToggleProps) => {
  const { isTranslated, isLoading, shouldTranslate, toggleTranslation } = useGoogleTranslate();

  if (!shouldTranslate) {
    return null;
  }

  const buttonContent = (
    <>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Languages className="h-4 w-4" />
      )}
      <span className={variant === 'mobile' ? 'ml-2' : 'ml-1 hidden sm:inline'}>
        {isTranslated ? 'English' : 'हिंदी'}
      </span>
    </>
  );

  if (variant === 'mobile') {
    return (
      <button
        onClick={toggleTranslation}
        disabled={isLoading}
        className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2 w-full text-left disabled:opacity-50"
      >
        {buttonContent}
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTranslation}
      disabled={isLoading}
      className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
    >
      {buttonContent}
    </Button>
  );
};

export default TranslationToggle;

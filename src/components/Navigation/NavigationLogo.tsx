
import { Link } from "react-router-dom";
import { logger } from "@/utils/logger";

interface NavigationLogoProps {
  variant: "home" | "default" | "transparent";
}

const NavigationLogo = ({ variant }: NavigationLogoProps) => {
  const logoClasses = "flex items-center space-x-2 transition-all duration-200 hover:scale-105";
  const logoImageClasses = "h-8 w-8";
  
  // Handle all variants including transparent
  const getLogoTextClasses = () => {
    if (variant === "home") {
      return "text-2xl font-bold bg-gradient-blue-ocean bg-clip-text text-transparent";
    }
    return "text-xl font-bold bg-gradient-blue-ocean bg-clip-text text-transparent";
  };

  const logoTextClasses = getLogoTextClasses();

  return (
    <div className="flex items-center space-x-3">
      <Link to="/" className={logoClasses}>
        <img 
          src="/lovable-uploads/feb8e6c8-b871-4f30-9ddd-2c20bb223a84.png" 
          alt="व्याकरणी Logo" 
          className={logoImageClasses}
          onError={(e) => {
            logger.warn('Navigation logo failed to load', undefined, 'NavigationLogo');
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className={logoTextClasses}>
          व्याकरणी
        </span>
      </Link>
    </div>
  );
};

export default NavigationLogo;

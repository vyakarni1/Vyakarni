
import { Link } from "react-router-dom";

interface NavigationLogoProps {
  variant: "home" | "default";
}

const NavigationLogo = ({ variant }: NavigationLogoProps) => {
  const logoClasses = "flex items-center space-x-2 transition-all duration-200 hover:scale-105";
  const logoImageClasses = "h-8 w-8";
  const logoTextClasses = variant === "home" 
    ? "text-2xl font-bold bg-gradient-blue-ocean bg-clip-text text-transparent"
    : "text-xl font-bold bg-gradient-blue-ocean bg-clip-text text-transparent";

  return (
    <div className="flex items-center space-x-3">
      <Link to="/" className={logoClasses}>
        <img 
          src="/lovable-uploads/529d215e-e930-4cd5-a0f2-17148e7066b1.png" 
          alt="व्याकरणी Logo" 
          className={logoImageClasses}
          onError={(e) => {
            console.log('Navigation logo failed to load');
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

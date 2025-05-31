
import { useScrollPosition } from "@/hooks/useScrollPosition";

const FloatingLogo = () => {
  const { isScrolled } = useScrollPosition();

  return (
    <div 
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-20 ${
        isScrolled ? 'opacity-0 scale-50 translate-y-[-300px] translate-x-[-200px]' : 'opacity-100 scale-100'
      }`}
    >
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-gradient-blue-ocean p-3 shadow-2xl animate-pulse">
          <img 
            src="/lovable-uploads/9bf89b26-f748-402b-9503-f5284c8be5c3.png" 
            alt="व्याकरणी Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-400 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default FloatingLogo;

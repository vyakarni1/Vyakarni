
import { useScrollPosition } from "@/hooks/useScrollPosition";

const FloatingLogo = () => {
  const { isScrolled } = useScrollPosition();

  return (
    <div 
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-30 transition-all duration-700 ${
        isScrolled ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
      }`}
      style={{
        transform: isScrolled ? 'translateY(-100px)' : 'translateY(0)',
      }}
    >
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-blue-ocean p-2 shadow-2xl animate-pulse">
          <img 
            src="/lovable-uploads/9bf89b26-f748-402b-9503-f5284c8be5c3.png" 
            alt="व्याकरणी Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default FloatingLogo;

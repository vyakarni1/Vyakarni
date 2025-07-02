
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/30 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/1bf69a70-2442-4bb2-8681-6877bdaeec2d.png" 
                alt="व्याकरणी Logo" 
                className="h-10 w-10 transition-transform duration-200 hover:scale-105"
              />
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
                व्याकरणी
              </div>
            </Link>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                लॉगिन
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                रजिस्टर करें
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

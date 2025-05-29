import React from 'react';
import { Target, Zap, Shield } from "lucide-react";
const Header = () => {
  return <div className="text-center py-6 sm:py-12 lg:py-20 px-3 sm:px-6 mt-4 sm:mt-0">
      <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
        <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg">
          <img alt="व्याकरणी Logo" className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" onError={e => {
          console.log('Logo failed to load in header');
          e.currentTarget.style.display = 'none';
        }} src="/lovable-uploads/8d095b4e-398d-4b46-b393-0f52f54b0181.png" />
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          व्याकरणी
        </h1>
      </div>
      <p className="text-sm sm:text-base lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-2 sm:px-4">
        AI की शक्ति से अपने हिंदी टेक्स्ट को पूर्ण और शुद्ध बनाएं
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6 lg:mt-8">
        <div className="flex items-center gap-2 text-slate-500">
          <Target className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
          <span className="text-xs sm:text-sm font-medium">99% सटीकता</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Zap className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
          <span className="text-xs sm:text-sm font-medium">तत्काल परिणाम</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Shield className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
          <span className="text-xs sm:text-sm font-medium">सुरक्षित</span>
        </div>
      </div>
    </div>;
};
export default Header;
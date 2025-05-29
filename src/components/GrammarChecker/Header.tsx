
import React from 'react';
import { Sparkles, Target, Zap, Shield } from "lucide-react";

const Header = () => {
  return (
    <div className="text-center py-12 sm:py-20 px-4 sm:px-6">
      <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
          <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          व्याकरणी
        </h1>
      </div>
      <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
        AI की शक्ति से अपने हिंदी टेक्स्ट को पूर्ण और शुद्ध बनाएं
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
        <div className="flex items-center gap-2 text-slate-500">
          <Target className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm font-medium">99% सटीकता</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm font-medium">तत्काल परिणाम</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm font-medium">सुरक्षित</span>
        </div>
      </div>
    </div>
  );
};

export default Header;

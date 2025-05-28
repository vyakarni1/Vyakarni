
import React from 'react';
import { Sparkles, Target, Zap, Shield } from "lucide-react";

const Header = () => {
  return (
    <div className="text-center py-20 px-6">
      <div className="inline-flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          व्याकरणी
        </h1>
      </div>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
        AI की शक्ति से अपने हिंदी टेक्स्ट को पूर्ण और शुद्ध बनाएं
      </p>
      <div className="flex items-center justify-center gap-6 mt-8">
        <div className="flex items-center gap-2 text-slate-500">
          <Target className="h-5 w-5" />
          <span className="text-sm font-medium">99% सटीकता</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Zap className="h-5 w-5" />
          <span className="text-sm font-medium">तत्काल परिणाम</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Shield className="h-5 w-5" />
          <span className="text-sm font-medium">सुरक्षित</span>
        </div>
      </div>
    </div>
  );
};

export default Header;

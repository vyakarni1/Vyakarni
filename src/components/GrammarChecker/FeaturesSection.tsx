
import React from 'react';
import { Card } from "@/components/ui/card";
import { Zap, Crown, BookOpen } from "lucide-react";

const FeaturesSection = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8 mt-20">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 border-2 text-center p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Zap className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-4">तत्काल सुधार</h3>
        <p className="text-slate-600 text-lg leading-relaxed">
          एक क्लिक में व्याकरण सुधारें और परिणाम तुरंत देखें
        </p>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100 border-2 text-center p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="bg-gradient-to-br from-purple-500 to-violet-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Crown className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-4">AI संचालित</h3>
        <p className="text-slate-600 text-lg leading-relaxed">
          उन्नत कृत्रिम बुद्धिमत्ता से सटीक व्याकरण सुधार
        </p>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 border-2 text-center p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <BookOpen className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-4">विस्तृत विश्लेषण</h3>
        <p className="text-slate-600 text-lg leading-relaxed">
          प्रत्येक सुधार की पूर्ण व्याख्या और कारण देखें
        </p>
      </Card>
    </div>
  );
};
{/* Disclaimer Line */}
      <div className="mt-16 text-center">
        <div className="inline-block px-8 py-4 bg-gradient-to-r from-slate-50/80 to-gray-50/80 backdrop-blur-sm border border-slate-200/50 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300">
          <p className="text-slate-600 text-sm leading-relaxed max-w-4xl">
            यद्यपि व्याकरणी उच्च सटीकता प्रदान करने का प्रयास करता है, तथापि इसमें यदा-कदा त्रुटियाँ संभव हैं। अंतिम प्रयोग से पूर्व प्राप्त परिणाम की समीक्षा करना अनुशंसित है।
          </p>
        </div>
      </div>
  );
};
export default FeaturesSection;

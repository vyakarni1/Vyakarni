
import { Shield, Zap, Users, Award, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const USPSection = () => {
  const usps = [
    {
      icon: Zap,
      title: '5 से 10 सेकेंड में परिणाम',
      description: 'विश्व में सबसे तीव्र भाषा सुधार एवं परिष्करण।',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Shield,
      title: '100% सुरक्षित डाटा',
      description: 'पूर्णतः एन्क्रिप्टेड डेटा, कोई संग्रहण नहीं।',
      gradient: 'from-green-400 to-blue-500'
    },
    {
      icon: Award,
      title: '99% सटीकता',
      description: 'AI की शक्ति से 99% सटीक लेख एवं व्याकरण सुधार।',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      icon: Users,
      title: '10,000+ संतुष्ट प्रयोगकर्ता',
      description: 'छात्रों, शिक्षकों, लेखकों तथा व्यावसायिक उपयोगकर्ताओं के मध्य स्वीकृत।',
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      icon: Clock,
      title: '24/7 उपलब्ध',
      description: 'सदैव उपलब्ध भाषा सहायक, कहीं भी-कभी भी।',
      gradient: 'from-teal-400 to-cyan-500'
    },
    {
      icon: CheckCircle,
      title: 'निःशुल्क प्रारंभ',
      description: 'कोई क्रेडिट कार्ड नहीं, आज ही निःशुल्क प्रयोग आरम्भ करें।',
      gradient: 'from-emerald-400 to-teal-500'
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-300 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-300 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-300 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            व्याकरणी को क्यों चुनें?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">हमारे अनोखे लाभ जो हमें विशेष रूप से स्वीकार्य बनाते हैं।</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {usps.map((usp, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gray-100 to-transparent opacity-50"></div>
              
              <CardContent className="p-8 relative">
                <div className="mb-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${usp.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <usp.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {usp.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {usp.description}
                </p>
                
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-full h-1 bg-gradient-to-r ${usp.gradient} rounded-full`}></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default USPSection;

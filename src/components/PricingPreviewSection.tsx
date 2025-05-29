
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, Crown } from 'lucide-react';

const PricingPreviewSection = () => {
  const plans = [
    {
      name: 'मुफ्त',
      price: '₹0',
      period: '/महीना',
      description: 'शुरुआत के लिए बेहतरीन',
      features: ['दैनिक 50 जांच', 'बुनियादी व्याकरण सुधार', 'ईमेल सपोर्ट'],
      icon: CheckCircle,
      popular: false,
      buttonText: 'मुफ्त शुरू करें',
      gradient: 'from-gray-500 to-gray-600'
    },
    {
      name: 'प्रो',
      price: '₹299',
      period: '/महीना',
      description: 'व्यक्तिगत उपयोग के लिए',
      features: ['असीमित जांच', 'उन्नत व्याकरण सुधार', 'तुरंत सहायता', 'PDF निर्यात'],
      icon: Zap,
      popular: true,
      buttonText: 'प्रो चुनें',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      name: 'बिजनेस',
      price: '₹999',
      period: '/महीना',
      description: 'टीमों और व्यवसायों के लिए',
      features: ['सभी प्रो फीचर्स', 'टीम मैनेजमेंट', 'प्राथमिकता सपोर्ट', 'कस्टम इंटीग्रेशन'],
      icon: Crown,
      popular: false,
      buttonText: 'बिजनेस चुनें',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">सभी के लिए उपयुक्त प्लान</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            अपनी जरूरतों के अनुसार सबसे अच्छा प्लान चुनें और आज ही शुरू करें
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                plan.popular ? 'border-2 border-blue-500 scale-105' : 'border border-gray-200'
              } overflow-hidden`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    सबसे लोकप्रिय
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <div className="mb-4 flex justify-center">
                  <div className={`p-3 bg-gradient-to-r ${plan.gradient} rounded-full text-white`}>
                    <plan.icon className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">{plan.name}</CardTitle>
                <p className="text-gray-600">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' 
                      : 'bg-gray-800 hover:bg-gray-900'
                  } text-white font-semibold py-3 transform hover:scale-105 transition-all duration-300`}
                  asChild
                >
                  <Link to="/register">
                    {plan.buttonText}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/pricing">
            <Button variant="outline" size="lg" className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
              सभी प्लान देखें
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingPreviewSection;

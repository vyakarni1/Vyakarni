
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, Star, Crown } from 'lucide-react';

const PricingPreviewSection = () => {
  const plans = [
    {
      name: 'Free',
      nameHindi: 'मुफ्त',
      price: '₹0',
      period: '/महीना',
      description: 'वर्तमान प्लान',
      features: [
        'व्याकरण सुधार',
        'वर्तनी जांच', 
        'मूल सुधार'
      ],
      limits: {
        'प्रति सुधार शब्द सीमा:': '100',
        'मासिक सुधार:': '5'
      },
      icon: Zap,
      popular: false,
      buttonText: 'वर्तमान प्लान',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      borderColor: 'border-green-500',
      headerColor: 'bg-green-500'
    },
    {
      name: 'Pro',
      nameHindi: 'प्रो',
      price: '₹499',
      period: '/महीना',
      description: 'सबसे लोकप्रिय',
      features: [
        'असीमित सुधार',
        'तेजी सुधार',
        'उन्नत व्याकरण',
        'प्राथमिकता सहायता'
      ],
      limits: {
        'प्रति सुधार शब्द सीमा:': '1000',
        'मासिक सुधार:': 'असीमित'
      },
      icon: Star,
      popular: true,
      buttonText: 'अपग्रेड करें',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      borderColor: 'border-blue-500',
      headerColor: 'bg-blue-600'
    },
    {
      name: 'Team',
      nameHindi: 'टीम',
      price: '₹999',
      period: '/महीना',
      description: '',
      features: [
        'सभी Pro सुविधाएं',
        'टीम सहयोग',
        'उपयोग एनालिटिक्स',
        'समर्पित सहायता'
      ],
      limits: {
        'प्रति सुधार शब्द सीमा:': '2000',
        'मासिक सुधार:': 'असीमित',
        'टीम सदस्य:': '5'
      },
      icon: Crown,
      popular: false,
      buttonText: 'अपग्रेड करें',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      borderColor: 'border-purple-500',
      headerColor: 'bg-purple-600'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
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
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${plan.borderColor} border-2 bg-white`}
            >
              {/* Header with plan name */}
              {plan.description && (
                <div className={`${plan.headerColor} text-white text-center py-3 text-sm font-medium`}>
                  {plan.description}
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`p-3 ${plan.headerColor} rounded-full text-white`}>
                    <plan.icon className="h-6 w-6" />
                  </div>
                </div>
                
                {/* Plan name and price */}
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 px-6 pb-6">
                {/* Limits */}
                <div className="space-y-3 mb-6">
                  {Object.entries(plan.limits).map(([key, value], limitIndex) => (
                    <div key={limitIndex} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{key}</span>
                      <span className="font-semibold text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Button */}
                <Button 
                  className={`w-full ${plan.buttonColor} text-white font-medium py-3 transition-all duration-300`}
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

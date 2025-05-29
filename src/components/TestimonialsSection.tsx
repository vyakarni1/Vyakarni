
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'राज कुमार',
      role: 'पत्रकार',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      content: 'व्याकरणी ने मेरी लेखन गुणवत्ता को काफी बेहतर बनाया है। अब मैं बिना किसी चिंता के हिंदी में लिख सकता हूं।',
      rating: 5
    },
    {
      name: 'प्रिया शर्मा',
      role: 'शिक्षिका',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?w=100&h=100&fit=crop&crop=face',
      content: 'मेरे छात्रों के लिए यह एक बेहतरीन टूल है। वे अपनी हिंदी व्याकरण की त्रुटियों को आसानी से सुधार सकते हैं।',
      rating: 5
    },
    {
      name: 'अमित वर्मा',
      role: 'ब्लॉगर',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      content: 'AI की शक्ति से चलने वाला यह टूल अविश्वसनीय है। मेरे ब्लॉग पोस्ट अब पहले से कहीं ज्यादा बेहतर हैं।',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">उपयोगकर्ता की राय</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            देखें कि हमारे उपयोगकर्ता व्याकरणी के बारे में क्या कहते हैं
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-100 to-transparent opacity-50"></div>
              <CardContent className="p-8 relative">
                <div className="mb-6">
                  <Quote className="h-8 w-8 text-blue-500 opacity-50" />
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold text-lg mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

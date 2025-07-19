
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'शिल्पा कायस्था',
      role: 'प्राध्यापिका',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?w=100&h=100&fit=crop&crop=face',
      content: 'व्याकरणी ने मेरी लेखन गुणवत्ता को बहुत उन्नत बनाया है। अब मैं हिंदी में लिखने के पूर्व कुछ सोचती नहीं हूँ, क्योंकि व्याकरणी मेरी सहायक है।',
      rating: 5
    },
    {
      name: 'शशांक सिंह',
      role: 'छात्र',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?w=100&h=100&fit=crop&crop=face',
      content: 'एक छात्र के रूप में मुझे सबसे बड़ी सुविधा यह है कि यह मेरे लिये सदैव उपलब्ध है और यही बात मेरे विश्वास में वृद्धि करती है।',
      rating: 5
    },
    {
      name: 'आदर्श निगम',
      role: 'कंसलटेंट',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      content: 'एक व्यवसायिक प्रयोगकर्ता हेतु व्याकरणी अत्यंत लाभदायी है। यह सुधार कार्य तो करता ही है, किन्तु मुख्य बात यह है कि इसे कहीं भी और कभी भी त्वरित आवश्यकताओं हेतु प्रयोग कर सकते हैं।',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4" data-translate>उपयोगकर्ताओं के विचार</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-translate>
            देखिये कि हमारे उपयोगकर्ता व्याकरणी के विषय में क्या कह रहे हैं।
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
                
                <p className="text-gray-700 mb-6 leading-relaxed italic" data-translate>
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
                    <div className="font-semibold text-gray-800" data-translate>{testimonial.name}</div>
                    <div className="text-sm text-gray-500" data-translate>{testimonial.role}</div>
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

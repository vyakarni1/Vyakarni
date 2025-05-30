
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'व्याकरणी कैसे काम करता है?',
      answer: 'व्याकरणी OpenAI की शक्तिशाली GPT तकनीक का उपयोग करके आपके हिंदी टेक्स्ट को स्कैन करता है और व्याकरण, वर्तनी, और विराम चिह्न की त्रुटियों को पहचानकर सुधारता है।'
    },
    {
      question: 'क्या यह वास्तव में मुफ्त है?',
      answer: 'हां! हमारा बेसिक प्लान पूरी तरह मुफ्त है जिसमें आप दैनिक 50 जांच कर सकते हैं। अधिक फीचर्स के लिए आप प्रो प्लान का चुनाव कर सकते हैं।'
    },
    {
      question: 'क्या मेरा डेटा सुरक्षित है?',
      answer: 'बिल्कुल! हम आपकी गोपनीयता को बहुत गंभीरता से लेते हैं। आपका टेक्स्ट एन्क्रिप्टेड तरीके से प्रोसेस होता है और हम इसे स्टोर नहीं करते।'
    },
    {
      question: 'क्या यह सभी प्रकार के हिंदी टेक्स्ट के साथ काम करता है?',
      answer: 'हां, व्याकरणी औपचारिक लेखन, कहानियां, ब्लॉग पोस्ट, ईमेल और अन्य सभी प्रकार के हिंदी टेक्स्ट के साथ काम करता है।'
    },
    {
      question: 'मुझे परिणाम मिलने में कितना समय लगता है?',
      answer: 'व्याकरणी बहुत तेज है! अधिकतर मामलों में आपको 5 सेकेंड के अंदर परिणाम मिल जाते हैं।'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">प्रायः पूछे जाने वाले प्रश्न</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            व्याकरणी के सन्दर्भ में प्रश्नोत्तरी
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
            >
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-blue-50 transition-colors duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-blue-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                    )}
                  </div>
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-6 animate-fade-in">
                    <div className="border-t pt-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

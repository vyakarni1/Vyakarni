
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'व्याकरणी कैसे कार्य करता है?',
      answer: 'व्याकरणी आधुनिकतम शक्तिशाली AI तकनीक का प्रयोग कर आपके हिंदी पाठ का परीक्षण करता है। इसके उपरांत यह अपने विशिष्ट शब्दकोष तथा AI की तकनीक के माध्यम से व्याकरण की अशुद्धियों को दूर कर आपके वाक्य-विन्यास, शब्द-चयन, विराम चिह्नों तथा भाषा सौष्ठव का निरीक्षण कर उसमे यथा-आवश्यक परिवर्तन एवं संशोधन कर आपको परिणाम प्रदान करता है।'
    },
    {
      question: 'क्या यह निःशुल्क है?',
      answer: 'जी हाँ, हमारा टेस्ट प्लान आपके पाँच सौ शब्दों तक के हिंदी पाठ को जाँचने हेतु पूर्णत: निःशुल्क है। यदि आप हमारे परिणामों से सन्तुष हैं तो आप हमारे मूल्य-आधारित प्लान का विश्लेषण कर अपने लिये एक उपयुक्त प्लान का चुनाव कर सकते हैं।'
    },
    {
      question: 'क्या मेरा डेटा सुरक्षित है?',
      answer: 'आपके द्वारा प्रदान किया गया प्रत्येक विवरण हमारी, गोपनीयता नीति तथा डेटा संरक्षण नीति के अंतर्गत आता है। यह पूर्णतः सुरक्षित है क्योंकि हम इनका व्यापर नहीं करते हैं। इस विषय में अधिक सूचना आप https://vyakarni.com/data-protection तथा https://vyakarni.com/privacy के लिंक्स पर जा कर प्राप्त कर सकते हैं।'
    },
    {
      question: 'क्या यह सभी प्रकार के हिंदी पाठों पर प्रभावी है?',
      answer: 'जी हाँ, व्याकरणी सभी प्रकार के औपचारिक लेखन, कहानियों, ब्लॉग पोस्ट लेखन, ईमेल, सोशल मीडिया पोस्ट और अन्य सभी प्रकार के हिंदी पाठों के सुधार का कार्य करता है।'
    },
    {
      question: 'मैं व्याकरणी से कितने समय में परिणाम प्राप्त कर सकता हूँ?',
      answer: 'व्याकरणी की कार्य-निष्पादन की गति अत्यंत तीव्र है। अधिकतर परीक्षणों में यह 5 से 10 सेकंड में परिणाम प्रदान कर देता है।'
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

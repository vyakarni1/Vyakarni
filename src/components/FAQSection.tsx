
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQSectionProps {
  content: {
    title: string;
    description: string;  
  };
  language: "english" | "hindi";
}

const FAQSection = ({ content, language }: FAQSectionProps) => {
  const faqs = language === "english" ? [
    {
      question: "What is Vyakarni?",
      answer: "Vyakarni is an AI-powered Hindi grammar checker that helps you improve your Hindi writing by providing instant corrections and suggestions."
    },
    {
      question: "How does Vyakarni work?",
      answer: "Simply paste your Hindi text into our editor, and Vyakarni will automatically detect grammar errors, suggest improvements, and provide one-click corrections."
    },
    {
      question: "Is Vyakarni free to use?",
      answer: "Yes, Vyakarni offers a free plan with basic features. We also have premium plans for users who need more advanced features and higher usage limits."
    },
    {
      question: "What types of errors does Vyakarni detect?",
      answer: "Vyakarni can detect and correct grammar errors, spelling mistakes, punctuation issues, and suggest better word choices for your Hindi text."
    },
    {
      question: "Can I use Vyakarni on mobile devices?",
      answer: "Yes, Vyakarni is fully responsive and works seamlessly on mobile phones, tablets, and desktop computers."
    },
    {
      question: "How accurate is Vyakarni?",
      answer: "Vyakarni boasts 99% accuracy in Hindi grammar checking, powered by advanced AI models specifically trained for Hindi language processing."
    }
  ] : [
    {
      question: "व्याकरणी क्या है?",
      answer: "व्याकरणी एक AI-संचालित हिंदी व्याकरण जाँच सेवा है जो तत्काल सुधार और सुझाव प्रदान करके आपकी हिंदी लेखन को उत्कृष्ट बनाने में सहायता करता है।"
    },
    {
      question: "व्याकरणी कैसे काम करता है?",
      answer: "बस अपना हिंदी पाठ हमारे संपादक में पेस्ट करें। इसके उपरांत व्याकरणी स्वचालित रूप से व्याकरण त्रुटियों का पता लगायेगा, सुधार सुझायेगा और एक-क्लिक सुधार प्रदान करेगा।"
    },
    {
      question: "क्या व्याकरणी उपयोग करना निःशुल्क है?",
      answer: "हाँ, व्याकरणी मूलभूत सुविधाओं के साथ एक निःशुल्क योजना प्रदान करता है। हमारे पास उन उपयोगकर्ताओं के लिये प्रीमियम योजनाएं भी हैं जिन्हें अधिक उन्नत सुविधाओं और उच्च उपयोग सीमा की आवश्यकता है।"
    },
    {
      question: "व्याकरणी किस प्रकार की त्रुटियों का पता लगाता है?",
      answer: "व्याकरणी व्याकरण त्रुटियों, वर्तनी की अशुद्धियों, विराम चिह्न की समस्याओं का पता लगा सकता है और उन्हें ठीक कर सकता है, तथा आपके हिंदी पाठ के लिये बेहतर शब्द चुनने का सुझाव दे सकता है।"
    },
    {
      question: "क्या मैं मोबाइल डिवाइस पर व्याकरणी का उपयोग कर सकता हूँ?",
      answer: "जी हाँ, व्याकरणी पूर्णतः रेस्पॉन्सिव है और मोबाइल फोन, टैबलेट और डेस्कटॉप कंप्यूटर पर निर्बाध रूप से काम करता है।"
    },
    {
      question: "व्याकरणी कितना सटीक है?",
      answer: "व्याकरणी हिंदी व्याकरण जाँच में 99% सटीकता का दावा करता है, जो विशेष रूप से हिंदी भाषा प्रसंस्करण के लिये प्रशिक्षित उन्नत AI मॉडल द्वारा संचालित है।"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{content.title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{content.description}</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import UnifiedNavigation from "@/components/UnifiedNavigation";
import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import HowItWorksSection from "@/components/Home/HowItWorksSection";
import Footer from "@/components/Footer";
import CounterSection from "@/components/CounterSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingPreviewSection from "@/components/PricingPreviewSection";
import FAQSection from "@/components/FAQSection";
import USPSection from "@/components/USPSection";
import CTABanner from "@/components/CTABanner";
import MarqueeBar from "@/components/MarqueeBar";
const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"english" | "hindi">("hindi");
  const hindiContent = {
    hero: {
      title: "AI के साथ हिंदी लेखन",
      subtitle: "सुधारें",
      description: "आधुनिक AI तकनीक का उपयोग कर अपने हिंदी पाठ को तुरंत सुधारें।",
      subdescription: "व्याकरण की त्रुटियों को एक क्लिक में ठीक करें।",
      freeTrialText: "निःशुल्क परीक्षण",
      quickResultsText: "त्वरित परिणाम",
      startButtonText: "तत्काल आरम्भ करें"
    },
    features: {
      title: "व्याकरणी की विशेषतायें",
      description: "हमारी AI-संचालित तकनीक के साथ अपनी हिंदी लेखन क्षमता को श्रेष्ठतर बनायें।",
      feature1: {
        title: "तत्काल सुधार",
        description: "एक क्लिक में व्याकरण की त्रुटियों को त्वरित रूप से दूर करें।"
      },
      feature2: {
        title: "AI संचालित",
        description: "AI की शक्तिशाली तकनीक से संचालित। अत्याधुनिक AI मॉडल का उपयोग।"
      },
      feature3: {
        title: "निपुण विशेषज्ञ",
        description: "हिंदी व्याकरण में विशेष रूप से प्रशिक्षित। देवनागरी लिपि में पूर्णतः पारंगत।"
      },
      feature4: {
        title: "सभी डिवाइस पर उपलब्ध",
        description: "मोबाइल, टैबलेट या कंप्यूटर - कहीं भी, कभी भी उपयोग करें।"
      }
    },
    howItWorks: {
      title: "व्याकरणी कैसे कार्य करता है?",
      description: "मात्र तीन सरल चरणों में अपने हिंदी पाठ को सुधारें।",
      step1: {
        title: "वेबसाइट पर रजिस्टर करें",
        description: "निःशुल्क खाता बनायें एवं अविलम्ब कार्य आरम्भ करें। कोई गुप्त शुल्क नहीं। किसी क्रेडिट कार्ड की कोई आवश्यकता नहीं। "
      },
      step2: {
        title: "अपना पाठ लिखें",
        description: "अपने हिंदी पाठ की प्रविष्टि करें एवं तीव्र गति से सुधारा गया परिणाम प्राप्त करें।"
      },
      step3: {
        title: "परिणाम प्राप्त करें",
        description: "व्याकरण, शब्द-चयन, विराम चिह्न, वाक्य-विन्यास एवं भाषा-सौष्ठव को उन्नत करें।"
      },
      buttonText: "अभी प्रयोग करें"
    },
    usp: {
      title: "व्याकरणी को क्यों चुनें?",
      description: "हमारे अनोखे लाभ जो हमें विशेष रूप से स्वीकार्य बनाते हैं।"
    },
    counter: {
      title: "हमारी उपलब्धियाँ",
      description: "आँकड़े जो हमारी उपलब्धियों को दर्शाते हैं।"
    },
    pricing: {
      title: "शब्द क्रेडिट प्लान",
      description: "एक बार खरीदें और 180 दिनों तक निर्बाध उपयोग करें।",
      subtitle: "तत्काल सुलभ प्रयोग • उच्च गुणवत्ता परिणाम • त्वरित प्रगति अनुगमन"
    },
    testimonials: {
      title: "उपयोगकर्ताओं के विचार",
      description: "देखिये कि हमारे उपयोगकर्ता व्याकरणी के विषय में क्या कह रहे हैं।"
    },
    faq: {
      title: "प्रायः पूछे जाने वाले प्रश्न",
      description: "व्याकरणी के सन्दर्भ में प्रश्नोत्तरी"
    },
    cta: {
      title: "आज ही अपनी हिंदी लेखन में",
      subtitle: "त्वरित सुधार लायें!",
      description: "व्याकरणी के साथ हिंदी लेखन सुधार का आरम्भ करें और देखें कि कैसे AI आपकी लेखन गुणवत्ता को एक नवीन उच्चतर स्तर पर ले जा सकती है।",
      startButton: "निःशुल्क आरम्भ करें",
      joinButton: "व्याकरणी अभियान में जुड़ें",
      freeSignup: "निःशुल्क साइन अप",
      noCreditCard: "कोई क्रेडिट कार्ड नहीं",
      instantStart: "तत्काल प्रारंभ",
      missionText: "व्याकरणी हमारे लिये एक अभियान है। एक ऐसा अभियान जिसके माध्यम से हम लोगों को हिंदी भाषा में दक्ष बनाने का प्रयास करेंगे। 'सर्वजन हिताय' की मूल भावना के साथ प्रारंभ किया गया यह अभियान सर्वजन के सहयोग की अनुपस्थिति में पूर्ण न हो सकेगा। व्याकरणी के इस महा-अभियान से किसी भी रूप में जुड़ने के लिये आप हमें हमारे ई-मेल support@vyakarni.com पर संपर्क कर सकते हैं।"
    },
    marquee: "☆ श्रेष्ठतम परिणामों के लिये गूगल क्रोम के Version 137.0.7151.56 (Latest Build) (64-bit) का प्रयोग करें ☆ Beta Version V-1.0"
  };
  const englishContent = {
    hero: {
      title: "Improve Hindi Writing",
      subtitle: "with AI",
      description: "Instantly improve your Hindi text using modern AI technology.",
      subdescription: "Fix grammar errors with one click.",
      freeTrialText: "Free Trial",
      quickResultsText: "Quick Results",
      startButtonText: "Get Started Now"
    },
    features: {
      title: "Vyakarni Features",
      description: "Enhance your Hindi writing skills with our AI-powered technology.",
      feature1: {
        title: "Instant Correction",
        description: "Quickly fix grammar errors with one click."
      },
      feature2: {
        title: "AI Powered",
        description: "Powered by advanced AI technology. Uses state-of-the-art AI models."
      },
      feature3: {
        title: "Expert Specialist",
        description: "Specially trained in Hindi grammar. Fully proficient in Devanagari script."
      },
      feature4: {
        title: "Available on All Devices",
        description: "Use anywhere, anytime - mobile, tablet, or computer."
      }
    },
    howItWorks: {
      title: "How Does Vyakarni Work?",
      description: "Improve your Hindi text in just three simple steps.",
      step1: {
        title: "Register on Website",
        description: "Create a free account and start immediately. No hidden charges."
      },
      step2: {
        title: "Write Your Text",
        description: "Enter your Hindi text and get improved results at high speed."
      },
      step3: {
        title: "Get Results",
        description: "Improve grammar, word choice, punctuation, sentence structure, and language elegance."
      },
      buttonText: "Try Now"
    },
    usp: {
      title: "Why Choose Vyakarni?",
      description: "Our unique advantages that make us specially acceptable."
    },
    counter: {
      title: "Our Achievements",
      description: "Statistics that reflect our accomplishments."
    },
    pricing: {
      title: "Word Credit Plans",
      description: "Buy once and use permanently.",
      subtitle: "One-time payment • No expiry • Permanent access"
    },
    testimonials: {
      title: "User Reviews",
      description: "See what our users are saying about Vyakarni."
    },
    faq: {
      title: "Frequently Asked Questions",
      description: "Q&A about Vyakarni"
    },
    cta: {
      title: "Bring instant improvement to",
      subtitle: "your Hindi writing today!",
      description: "Start improving your Hindi writing with Vyakarni and see how AI can take your writing quality to a new higher level.",
      startButton: "Start Free",
      joinButton: "Join Vyakarni Mission",
      freeSignup: "Free signup",
      noCreditCard: "No credit card",
      instantStart: "Instant start",
      missionText: "Vyakarni is a mission for us. A mission through which we will strive to make people proficient in the Hindi language. This mission started with the basic spirit of 'Sarvajanahitaya' cannot be completed without the cooperation of everyone. To join this great mission of Vyakarni in any form, you can contact us at our email support@vyakarni.com."
    },
    marquee: "☆ Use Google Chrome Version 137.0.7151.56 (Latest Build) (64-bit) for best results ☆ Beta Version V-1.0"
  };
  const currentContent = language === "english" ? englishContent : hindiContent;
  useEffect(() => {
    const error = searchParams.get('error');
    const errorCode = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');
    if (error && errorCode) {
      console.log('Auth error detected:', {
        error,
        errorCode,
        errorDescription
      });
      if (errorCode === 'otp_expired') {
        toast.error(language === "english" ? "Password reset link has expired" : "पासवर्ड रीसेट लिंक की समय सीमा समाप्त हो गयी है", {
          description: language === "english" ? "Please request a new password reset link" : "कृपया नया पासवर्ड रीसेट लिंक माँगें",
          action: {
            label: language === "english" ? "Request New Link" : "नया लिंक माँगे",
            onClick: () => navigate('/forgot-password')
          },
          duration: 8000
        });
      } else if (error === 'access_denied') {
        toast.error(language === "english" ? "Password reset link is invalid" : "पासवर्ड रीसेट लिंक अमान्य है", {
          description: language === "english" ? "This link is incorrect or has expired" : "यह लिंक गलत है या इसकी समय सीमा समाप्त हो गयी है",
          action: {
            label: language === "english" ? "Request New Link" : "नया लिंक माँगे",
            onClick: () => navigate('/forgot-password')
          },
          duration: 8000
        });
      } else {
        toast.error(language === "english" ? "Authentication Error" : "प्रमाणीकरण त्रुटि", {
          description: errorDescription || (language === "english" ? "Something went wrong, please try again" : "कुछ गलत हुआ है, कृपया पुनः प्रयास करें"),
          duration: 6000
        });
      }
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('error');
      newSearchParams.delete('error_code');
      newSearchParams.delete('error_description');
      setSearchParams(newSearchParams, {
        replace: true
      });
    }
  }, [searchParams, setSearchParams, navigate, language]);
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <UnifiedNavigation variant="home" />
      
      
      {/* Language Toggle */}
      

      <div className="pt-24">
        <HeroSection content={currentContent.hero} />
        <FeaturesSection content={currentContent.features} />
        <USPSection content={currentContent.usp} language={language} />
        <CounterSection content={currentContent.counter} language={language} />
        <HowItWorksSection content={currentContent.howItWorks} />
        <PricingPreviewSection content={currentContent.pricing} language={language} />
        <TestimonialsSection content={currentContent.testimonials} language={language} />
        <FAQSection content={currentContent.faq} language={language} />
        <CTABanner content={currentContent.cta} />
        <Footer />
      </div>
    </div>;
};
export default Home;
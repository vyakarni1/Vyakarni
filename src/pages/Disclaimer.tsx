import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Layout from "@/components/Layout";

const Disclaimer = () => {
  const [language, setLanguage] = useState<"english" | "hindi">("english");

  const englishContent = {
    title: "Disclaimer",
    subtitle: "Important information about our services",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          Last Updated: 28.05.2025
        </div>
        
        <div className="text-gray-600 leading-relaxed">
          The purpose of this website www.vyakarni.com, Hindi writing assistant app ("App") and the Hindi writing assistant services (Services") ("Vyakarni," "we," "our") is to provide helpful suggestions for writing in Hindi. Please read this disclaimer carefully. By using Vyakarni, you agree to all the terms of this disclaimer.
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. General Information Only</h2>
          <p className="text-gray-600 leading-relaxed">
            Vyakarni is a language assistance tool that offers suggestions for improving grammar, spelling, sentence structure, style enhancement and word choice in Hindi sentences. The suggestions provided are for informational purposes only and should not be used as the final basis for legal, educational or professional decisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. No Guarantee</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We do not guarantee that:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>All grammatical or language errors will be fully corrected,</li>
            <li>Suggestions will be 100% accurate or appropriate,</li>
            <li>Results will suit every user's language style or needs.</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            Our services are provided "as-is" and "as available." We do not warrant suitability or accuracy for any particular purpose.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. User Responsibility</h2>
          <p className="text-gray-600 leading-relaxed">
            Using the suggestions given by Vyakarni is entirely the user's responsibility. Users should ensure that the final writing is appropriate for their purpose, audience and context. We will not be liable for any damage, loss or disputes arising from the use of our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Technical Limitations</h2>
          <p className="text-gray-600 leading-relaxed">
            Vyakarni is an artificial intelligence (AI)-based system and is not a full substitute for a human grammar expert. Errors may occur in complex contexts, literary styles or regional dialect usage. Please review your writing before making final decisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Third-Party Services</h2>
          <p className="text-gray-600 leading-relaxed">
            Vyakarni uses third-party platforms (such as OpenAI, Railway, Razorpay, Google Cloud etc.) for some services. We are not responsible for the security, availability or accuracy of these services. Their terms and conditions govern their use.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Right to Change</h2>
          <p className="text-gray-600 leading-relaxed">
            Vyakarni reserves the right to update this disclaimer at any time without prior notice. Updated disclaimers will be published on the website and will be effective for use. Please check this page periodically.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            If you have any questions or concerns regarding this disclaimer, please contact us at:
          </p>
          <div className="text-gray-600">
            📧 support@vyakarni.com<br />
            📍 SNS Innovation Labs Pvt. Ltd., Noida, Uttar Pradesh, India
          </div>
        </section>
      </div>
    )
  };

  const hindiContent = {
    title: "अस्वीकरण",
    subtitle: "हमारी सेवाओं के बारे में महत्वपूर्ण जानकारी",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          अंतिम अद्यतन: २८.०५.२०२५
        </div>
        
        <div className="text-gray-600 leading-relaxed">
          इस वेबसाइट www.vyakarni.com, हिंदी लेखन सहायक एप ("एप") और हिंदी लेखन सहायक सेवाओं ("सेवायें") ("Vyakarni", "हम", "हमारा") का उद्देश्य हिंदी लेखन में सहायक सुझाव प्रदान करना है। कृपया इस अस्वीकरण को ध्यानपूर्वक पढ़ें। व्याकरणी (Vyakarni) का उपयोग करके आप इस अस्वीकरण के सभी नियमों के प्रति अपनी सहमती प्रदान करते हैं।
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. सामान्य सूचना मात्र</h2>
          <p className="text-gray-600 leading-relaxed">
            व्याकरणी (Vyakarni) एक भाषा सहायक उपकरण है जो हिंदी वाक्यों में व्याकरण, वर्तनी, वाक्य संरचना, भाषा परिष्करण एवं शब्द चयन में सुधार के सुझाव प्रदान करता है। प्रस्तुत सुधार सुझाव केवल सूचना के उद्देश्य से होते हैं और इनका कानूनी, शैक्षणिक या व्यावसायिक निर्णयों में अंतिम आधार के रूप में प्रयोग नहीं किया जाना चाहिये।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. कोई गारंटी नहीं</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            हम यह गारंटी नहीं देते हैं कि:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>सभी व्याकरण या भाषा त्रुटियों का पूरी तरह से समाधान होगा,</li>
            <li>सुझाव 100% सटीक या उपयुक्त होंगे,</li>
            <li>परिणाम हर उपयोगकर्ता की भाषा शैली या आवश्यकता के अनुसार होंगे।</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            हमारी सेवायें "जैसी हैं" (as-is) और "उपलब्धता के आधार पर" (as available) प्रदान की जाती हैं। हम किसी विशेष उद्देश्य हेतु उपयुक्तता या सटीकता की कोई गारंटी नहीं देते।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. उपयोगकर्ता का उत्तरदायित्व</h2>
          <p className="text-gray-600 leading-relaxed">
            व्याकरणी (Vyakarni) द्वारा दिये गये सुझावों का उपयोग करना पूर्णतः उपयोगकर्ता का उत्तरदायित्व है। उपयोगकर्ता को यह सुनिश्चित करना चाहिये कि अंतिम लेखन उनके उद्देश्य, श्रोताओं, पाठकों, दर्शकों और संदर्भ के अनुसार उचित है। हम किसी प्रकार की क्षति, हानि या विवाद के लिये उत्तरदायी नहीं होंगे, जो हमारी सेवाओं के प्रयोग से उत्पन्न हुआ हो।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. तकनीकी सीमायें</h2>
          <p className="text-gray-600 leading-relaxed">
            व्याकरणी (Vyakarni) कृत्रिम बुद्धिमत्ता (AI) आधारित प्रणाली है और यह मानवीय व्याकरण विशेषज्ञ का पूर्ण विकल्प नहीं है। कुछ जटिल संदर्भ, साहित्यिक शैली या स्थानीय बोली आधारित प्रयोगों में त्रुटियां संभव हैं। कृपया अंतिम निर्णय से पहले लेख की समीक्षा करें।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. तृतीय पक्ष सेवायें</h2>
          <p className="text-gray-600 leading-relaxed">
            व्याकरणी (Vyakarni) कुछ सेवाओं के लिये तृतीय पक्ष के प्लेटफ़ॉर्म्स (जैसे OpenAI, Railway, RazorPay आदि) का उपयोग करता है। हम इन सेवाओं की सुरक्षा, उपलब्धता या सटीकता के लिये उत्तरदायी नहीं हैं। उनके नियम एवं शर्तें उनके द्वारा नियंत्रित होते हैं।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. परिवर्तन का अधिकार</h2>
          <p className="text-gray-600 leading-relaxed">
            व्याकरणी (Vyakarni) इस अस्वीकरण को बिना पूर्व सूचना के किसी भी समय अपडेट अथवा परिवर्तित करने का अधिकार सुरक्षित रखता है। अद्यतन अस्वीकरण वेबसाइट पर प्रकाशित किया जायेगा और उपयोग के लिये प्रभावी होगा। कृपया समय-समय पर इस पृष्ठ को जाँचते रहें।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. संपर्क करें</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            यदि आपके पास इस अस्वीकरण से संबंधित कोई प्रश्न या चिंता है, तो कृपया हमसे संपर्क करें:
          </p>
          <div className="text-gray-600 mb-4">
            📧 support@vyakarni.com<br />
            📍 SNS Innovation Labs Pvt. Ltd., नॉएडा, उत्तर प्रदेश, भारत
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              📌 नोट: यह अस्वीकरण आपकी सुविधा के लिये हिंदी में दी गई है। यदि कानूनी व्याख्या या विवाद की स्थिति उत्पन्न होती है, तो अंग्रेज़ी संस्करण मान्य माना जायेगा।
            </p>
          </div>
        </section>
      </div>
    )
  };

  const currentContent = language === "english" ? englishContent : hindiContent;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {currentContent.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {currentContent.subtitle}
            </p>
            
            {/* Language Toggle */}
            <div className="flex justify-center mb-8">
              <ToggleGroup
                type="single"
                value={language}
                onValueChange={(value: "english" | "hindi") => value && setLanguage(value)}
                className="bg-white border rounded-lg p-1"
              >
                <ToggleGroupItem
                  value="english"
                  className="px-4 py-2 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
                >
                  English
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="hindi"
                  className="px-4 py-2 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
                >
                  हिंदी
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <Card>
            <CardContent className="p-8 prose prose-lg max-w-none">
              {currentContent.content}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Disclaimer;

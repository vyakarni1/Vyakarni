
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Layout from "@/components/Layout";

const ShippingPolicy = () => {
  const [language, setLanguage] = useState<"english" | "hindi">("english");

  const englishContent = {
    title: "Shipping Policy",
    subtitle: "Digital service delivery and account activation process",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          Date: 28.05.2025
        </div>
        
        <div className="text-gray-600 leading-relaxed">
          Since Vyakarni provides digital services, no physical shipping is required. This policy explains how you will receive access to your purchased subscription plan.
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. Digital Service Delivery</h2>
          <p className="text-gray-600 leading-relaxed">
            Vyakarni is a digital Hindi grammar checking platform. All our services are delivered electronically through our web application. There are no physical products to ship, and therefore no shipping charges apply.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Account Activation Process</h2>
          <p className="text-gray-600 leading-relaxed">
            Upon successful payment confirmation, you will be automatically enrolled in your purchased subscription plan. A confirmation email will be sent to your registered email address containing instructions for creating your login credentials (username and password).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Access Timeline</h2>
          <p className="text-gray-600 leading-relaxed">
            Once your login is set up, you will gain immediate access to our platform. This process typically completes within minutes of payment confirmation. Please ensure you provide the correct email address during purchase to avoid any delays.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Troubleshooting Access Issues</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            If you do not receive the confirmation email within 24 hours, please contact our support team:
          </p>
          <div className="text-gray-600">
            📧 support@vyakarni.com<br />
            📍 SNS Innovation Labs Pvt. Ltd., Noida, Uttar Pradesh, India
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Important Notes</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Check your spam/junk folder if you don't receive the confirmation email</li>
            <li>Ensure your email address is entered correctly during registration</li>
            <li>Our support team is available Monday to Friday, 9:00 AM - 6:00 PM IST</li>
            <li>Keep your login credentials secure and do not share them with others</li>
          </ul>
        </section>
      </div>
    )
  };

  const hindiContent = {
    title: "शिपिंग नीति",
    subtitle: "डिजिटल सेवा वितरण और खाता सक्रियण प्रक्रिया",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          तारीख: २८.०५.२०२५
        </div>
        
        <div className="text-gray-600 leading-relaxed">
          चूँकि व्याकरणी एक डिजिटल सेवा प्रदान करता है, इसलिये किसी भी प्रकार की भौतिक शिपिंग की आवश्यकता नहीं होती। आपके भुगतान की सफल प्राप्ति के उपरांत, आपको आपके द्वारा खरीदे गये प्लान में नामांकित कर दिया जायेगा।
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. डिजिटल सेवा वितरण</h2>
          <p className="text-gray-600 leading-relaxed">
            व्याकरणी एक डिजिटल हिंदी व्याकरण जांच प्लेटफॉर्म है। हमारी सभी सेवाएं हमारे वेब एप्लिकेशन के माध्यम से इलेक्ट्रॉनिक रूप से प्रदान की जाती हैं। शिप करने के लिए कोई भौतिक उत्पाद नहीं हैं, और इसलिए कोई शिपिंग शुल्क लागू नहीं होता।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. खाता सक्रियण प्रक्रिया</h2>
          <p className="text-gray-600 leading-relaxed">
            आपके पंजीकृत ईमेल पते पर एक पुष्टिकरण ईमेल भेजा जायेगा, जिसमें लॉगिन क्रेडेंशियल्स (यूज़रनेम और पासवर्ड) बनाने के निर्देश होंगे।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. पहुंच समयसीमा</h2>
          <p className="text-gray-600 leading-relaxed">
            एक बार जब आपका लॉगिन सेट हो जाता है, तो आपको हमारे प्लेटफ़ॉर्म तक पहुँच मिल जायेगी। यह प्रक्रिया आमतौर पर भुगतान की पुष्टि के कुछ ही मिनटों में पूरी हो जाती है। कृपया सुनिश्चित करें कि खरीदारी के समय आपने सही ईमेल पता दर्ज किया है ताकि किसी भी तरह की देरी से बचा जा सके।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. पहुंच समस्याओं का समाधान</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            यदि आपको 24 घंटे के भीतर पुष्टिकरण ईमेल प्राप्त नहीं होता है, तो कृपया हमारी सपोर्ट टीम से संपर्क करें:
          </p>
          <div className="text-gray-600 mb-4">
            📧 support@vyakarni.com<br />
            📍 SNS Innovation Labs Pvt. Ltd., नॉएडा, उत्तर प्रदेश, भारत
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. महत्वपूर्ण नोट्स</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>यदि आपको पुष्टिकरण ईमेल प्राप्त नहीं होता है तो अपना स्पैम/जंक फ़ोल्डर जांचें</li>
            <li>पंजीकरण के दौरान सुनिश्चित करें कि आपका ईमेल पता सही तरीके से दर्ज किया गया है</li>
            <li>हमारी सपोर्ट टीम सोमवार से शुक्रवार, सुबह 9:00 बजे से शाम 6:00 बजे तक उपलब्ध है</li>
            <li>अपने लॉगिन क्रेडेंशियल्स को सुरक्षित रखें और उन्हें दूसरों के साथ साझा न करें</li>
          </ul>
          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <p className="text-sm text-blue-800">
              📌 नोट: यह दस्तावेज़ आपकी सुविधा के लिये हिंदी में प्रस्तुत किया गया है। यदि किसी कानूनी व्याख्या या विवाद की स्थिति उत्पन्न होती है, तो अंग्रेज़ी संस्करण को प्राथमिकता दी जायेगी।
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

export default ShippingPolicy;

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Layout from "@/components/Layout";

const RefundPolicy = () => {
  const [language, setLanguage] = useState<"english" | "hindi">("english");

  const englishContent = {
    title: "Refund Policy",
    subtitle: "Guidelines for refunds on our services",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          Last Updated: 28.05.2025
        </div>
        
        <div className="text-gray-600 leading-relaxed">
          This Refund Policy applies to all services offered by Vyakarni and SNS Innovation Labs Pvt. Ltd. Please read this policy carefully before using our services.
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. Eligibility for Refunds</h2>
          <p className="text-gray-600 leading-relaxed">
            Refunds are considered under the following circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Service Unavailability: If the service is unavailable for more than 7 consecutive days due to technical issues on our end.</li>
            <li>Incorrect Charge: If you were incorrectly charged due to a system error.</li>
            <li>Plan Downgrade: If you downgrade your subscription plan within 14 days of purchase, you may be eligible for a partial refund.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Non-Refundable Cases</h2>
          <p className="text-gray-600 leading-relaxed">
            Refunds will not be issued in the following cases:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Usage: Refunds are not provided based on the extent of service usage.</li>
            <li>Dissatisfaction: If you are dissatisfied with the service's features or suggestions.</li>
            <li>Violation of Terms: If your account is terminated due to a violation of our Terms of Service.</li>
            <li>Delay in Usage: If you did not use the service during your subscription period.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Refund Request Procedure</h2>
          <p className="text-gray-600 leading-relaxed">
            To request a refund, please follow these steps:
          </p>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>Contact Support: Email us at support@vyakarni.com with your refund request.</li>
            <li>Provide Details: Include your account details, the reason for the refund request, and any supporting documentation.</li>
            <li>Review Process: Our team will review your request within 7 business days.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Refund Processing Time</h2>
          <p className="text-gray-600 leading-relaxed">
            If your refund request is approved, the refund will be processed within 14 business days. The refund will be issued to the original payment method.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Changes to the Refund Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting on our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            If you have any questions or concerns regarding this Refund Policy, please contact us at:
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
    title: "वापसी नीति",
    subtitle: "हमारी सेवाओं पर धन वापसी के दिशानिर्देश",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          अंतिम अद्यतन: २८.०५.२०२५
        </div>
        
        <div className="text-gray-600 leading-relaxed">
          यह वापसी नीति व्याकरणी (Vyakarni) और SNS Innovation Labs Pvt. Ltd. द्वारा दी जाने वाली सभी सेवाओं पर लागू होती है। हमारी सेवाओं का उपयोग करने से पहले कृपया इस नीति को ध्यान से पढ़ें।
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. धन वापसी के लिए पात्रता</h2>
          <p className="text-gray-600 leading-relaxed">
            धन वापसी पर निम्नलिखित परिस्थितियों में विचार किया जाता है:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>सेवा अनुपलब्धता: यदि हमारी ओर से तकनीकी समस्याओं के कारण सेवा लगातार 7 दिनों से अधिक समय तक अनुपलब्ध रहती है।</li>
            <li>गलत शुल्क: यदि सिस्टम त्रुटि के कारण आपसे गलत शुल्क लिया गया था।</li>
            <li>योजना डाउनग्रेड: यदि आप खरीद के 14 दिनों के भीतर अपनी सदस्यता योजना को डाउनग्रेड करते हैं, तो आप आंशिक धन वापसी के लिए पात्र हो सकते हैं।</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. गैर-वापसी योग्य मामले</h2>
          <p className="text-gray-600 leading-relaxed">
            निम्नलिखित मामलों में धन वापसी जारी नहीं की जाएगी:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>उपयोग: सेवा उपयोग की सीमा के आधार पर धन वापसी प्रदान नहीं की जाती है।</li>
            <li>असंतुष्टि: यदि आप सेवा की सुविधाओं या सुझावों से असंतुष्ट हैं।</li>
            <li>शर्तों का उल्लंघन: यदि हमारी सेवा की शर्तों के उल्लंघन के कारण आपका खाता समाप्त कर दिया जाता है।</li>
            <li>उपयोग में देरी: यदि आपने अपनी सदस्यता अवधि के दौरान सेवा का उपयोग नहीं किया।</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. धन वापसी अनुरोध प्रक्रिया</h2>
          <p className="text-gray-600 leading-relaxed">
            धन वापसी का अनुरोध करने के लिए, कृपया इन चरणों का पालन करें:
          </p>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>समर्थन से संपर्क करें: अपने धन वापसी अनुरोध के साथ हमें support@vyakarni.com पर ईमेल करें।</li>
            <li>विवरण प्रदान करें: अपने खाते का विवरण, धन वापसी अनुरोध का कारण और कोई भी सहायक दस्तावेज शामिल करें।</li>
            <li>समीक्षा प्रक्रिया: हमारी टीम 7 व्यावसायिक दिनों के भीतर आपके अनुरोध की समीक्षा करेगी।</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. धन वापसी प्रसंस्करण समय</h2>
          <p className="text-gray-600 leading-relaxed">
            यदि आपका धन वापसी अनुरोध स्वीकृत हो जाता है, तो धन वापसी 14 व्यावसायिक दिनों के भीतर संसाधित हो जाएगी। धन वापसी मूल भुगतान विधि में जारी की जाएगी।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. धन वापसी नीति में परिवर्तन</h2>
          <p className="text-gray-600 leading-relaxed">
            हम किसी भी समय इस धन वापसी नीति को संशोधित करने का अधिकार सुरक्षित रखते हैं। परिवर्तन हमारी वेबसाइट पर पोस्ट करने के तुरंत बाद प्रभावी होंगे।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. संपर्क करें</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            यदि आपके पास इस धन वापसी नीति के बारे में कोई प्रश्न या चिंता है, तो कृपया हमसे संपर्क करें:
          </p>
          <div className="text-gray-600 mb-4">
            📧 support@vyakarni.com<br />
            📍 SNS Innovation Labs Pvt. Ltd., नॉएडा, उत्तर प्रदेश, भारत
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
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

export default RefundPolicy;

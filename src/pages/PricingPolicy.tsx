
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Layout from "@/components/Layout";

const PricingPolicy = () => {
  const [language, setLanguage] = useState<"english" | "hindi">("english");

  const englishContent = {
    title: "Pricing Policy",
    subtitle: "Our transparent pricing structure and billing terms",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          Date: 28.05.2025
        </div>
        
        <div className="text-gray-600 leading-relaxed">
          This Pricing Policy explains how Vyakarni and SNS Innovation Labs Pvt. Ltd. structures its pricing, billing, and payment terms for our Hindi grammar checking services.
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. Subscription Plans</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Vyakarni offers multiple subscription tiers to meet different user needs:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Free Plan: Limited usage with basic grammar checking features</li>
            <li>Premium Plans: Enhanced features with higher usage limits</li>
            <li>Enterprise Plans: Custom solutions for organizations and businesses</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Pricing Structure</h2>
          <p className="text-gray-600 leading-relaxed">
            Our pricing is transparent and clearly displayed on our pricing page. All prices are listed in Indian Rupees (INR) and include applicable taxes. We reserve the right to modify our pricing with 30 days advance notice to existing subscribers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Billing Cycles</h2>
          <p className="text-gray-600 leading-relaxed">
            Subscriptions are billed according to the selected plan duration (monthly, quarterly, or annually). Billing occurs automatically on the subscription renewal date. Failed payments may result in service suspension until payment is resolved.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Payment Methods</h2>
          <p className="text-gray-600 leading-relaxed">
            We accept various payment methods including credit cards, debit cards, UPI, net banking, and digital wallets. All payments are processed securely through our trusted payment partners.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Taxes and Fees</h2>
          <p className="text-gray-600 leading-relaxed">
            All applicable taxes (including GST) are calculated and added to the subscription cost at checkout. The final amount payable will be clearly displayed before payment confirmation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Refunds and Cancellations</h2>
          <p className="text-gray-600 leading-relaxed">
            Refund requests are handled according to our Refund Policy. Subscriptions can be cancelled at any time, with access continuing until the end of the current billing period.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Contact Information</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            For billing inquiries or pricing questions, please contact:
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
    title: "मूल्य निर्धारण नीति",
    subtitle: "हमारी पारदर्शी मूल्य संरचना और बिलिंग शर्तें",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          तारीख: २८.०५.२०२५
        </div>
        
        <div className="text-gray-600 leading-relaxed">
          यह मूल्य निर्धारण नीति बताती है कि व्याकरणी (Vyakarni) और SNS Innovation Labs Pvt. Ltd. अपनी हिंदी व्याकरण जांच सेवाओं के लिए मूल्य निर्धारण, बिलिंग और भुगतान की शर्तों को कैसे संरचित करते हैं।
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. सब्सक्रिप्शन योजनाएं</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            व्याकरणी विभिन्न उपयोगकर्ता आवश्यकताओं को पूरा करने के लिए कई सब्सक्रिप्शन स्तर प्रदान करता है:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>निःशुल्क योजना: बुनियादी व्याकरण जांच सुविधाओं के साथ सीमित उपयोग</li>
            <li>प्रीमियम योजनाएं: उच्च उपयोग सीमा के साथ बेहतर सुविधाएं</li>
            <li>एंटरप्राइज़ योजनाएं: संगठनों और व्यवसायों के लिए कस्टम समाधान</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. मूल्य संरचना</h2>
          <p className="text-gray-600 leading-relaxed">
            हमारी मूल्य निर्धारण पारदर्शी है और हमारे प्राइसिंग पेज पर स्पष्ट रूप से प्रदर्शित की गई है। सभी कीमतें भारतीय रुपये (INR) में सूचीबद्ध हैं और इसमें लागू कर शामिल हैं। हम मौजूदा ग्राहकों को 30 दिन की अग्रिम सूचना के साथ अपने मूल्य निर्धारण को संशोधित करने का अधिकार सुरक्षित रखते हैं।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. बिलिंग चक्र</h2>
          <p className="text-gray-600 leading-relaxed">
            सब्सक्रिप्शन चयनित योजना अवधि (मासिक, तिमाही, या वार्षिक) के अनुसार बिल किए जाते हैं। बिलिंग सब्सक्रिप्शन नवीनीकरण की तारीख पर स्वचालित रूप से होती है। भुगतान विफल होने पर भुगतान हल होने तक सेवा निलंबित हो सकती है।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. भुगतान के तरीके</h2>
          <p className="text-gray-600 leading-relaxed">
            हम क्रेडिट कार्ड, डेबिट कार्ड, UPI, नेट बैंकिंग और डिजिटल वॉलेट सहित विभिन्न भुगतान विधियों को स्वीकार करते हैं। सभी भुगतान हमारे विश्वसनीय भुगतान साझेदारों के माध्यम से सुरक्षित रूप से संसाधित किए जाते हैं।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. कर और शुल्क</h2>
          <p className="text-gray-600 leading-relaxed">
            सभी लागू कर (GST सहित) की गणना की जाती है और चेकआउट पर सब्सक्रिप्शन लागत में जोड़े जाते हैं। भुगतान पुष्टि से पहले अंतिम देय राशि स्पष्ट रूप से प्रदर्शित की जाएगी।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. रिफंड और रद्दीकरण</h2>
          <p className="text-gray-600 leading-relaxed">
            रिफंड अनुरोधों को हमारी रिफंड नीति के अनुसार संभाला जाता है। सब्सक्रिप्शन को किसी भी समय रद्द किया जा सकता है, वर्तमान बिलिंग अवधि के अंत तक पहुंच जारी रहती है।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. संपर्क जानकारी</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            बिलिंग पूछताछ या मूल्य निर्धारण प्रश्नों के लिए, कृपया संपर्क करें:
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

export default PricingPolicy;

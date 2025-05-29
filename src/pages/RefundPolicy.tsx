
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const RefundPolicy = () => {
  const [language, setLanguage] = useState<"english" | "hindi">("english");

  const englishContent = {
    title: "Refund & Cancellation Policy",
    subtitle: "Understanding our refund and cancellation terms",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          Last Updated: 28.05.2025
        </div>
        
        <div className="text-gray-600 leading-relaxed">
          Vyakarni, operated by SNS Innovation Labs Pvt. Ltd., is a digital service providing AI-based assistance for Hindi writing improvement. Our policy is based on transparency and user satisfaction. Please read the following terms carefully.
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. Nature of Digital Services</h2>
          <p className="text-gray-600 leading-relaxed">
            Vyakarni is a digital subscription-based service. Once you make a payment for the service, your subscription is activated immediately and you gain access to the services. Therefore, refunds like those for traditional products are generally not possible.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Cancellation Policy</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">(a) Monthly / Annual Subscriptions:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>You may cancel your subscription at any time before the next billing cycle.</li>
                <li>After cancellation, your service will continue until the end of the paid period, but no further payments will be taken.</li>
                <li>Cancellation requests can be made via account settings or by emailing us at: support@vyakarni.com</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">(b) Auto-Renewal:</h3>
              <p className="text-gray-600 leading-relaxed ml-4">
                Subscriptions may renew automatically unless you manually cancel. Please cancel in time if you do not wish to continue the service for the next period.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Refund Policy</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Due to the nature of digital services, we generally do not provide refunds. However, refunds may be considered in the following cases:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>If the service was unusable due to technical reasons proven to be on our side</li>
            <li>If payment was made but the service was not activated</li>
            <li>If the user accidentally made duplicate payments for the same service</li>
          </ul>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2">To request a refund:</h4>
            <p className="text-sm text-gray-700 mb-2">
              Please email us within 24 hours including the following details:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
              <li>Date of payment and a screenshot</li>
              <li>Registered email ID</li>
              <li>A brief description of the issue</li>
            </ul>
            <p className="text-sm text-gray-700 mt-2">
              📧 Send email to: support@vyakarni.com
            </p>
            <p className="text-sm text-gray-700">
              We endeavour to respond within 5–7 business days.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Payment Gateway Issues</h2>
          <p className="text-gray-600 leading-relaxed">
            Vyakarni accepts payments via third-party payment gateways (such as Razorpay, Stripe, etc.). If your payment was deducted but the service was not activated, please inform us first. Final resolution of gateway-related disputes lies with the payment gateway provider.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Rights Reserved</h2>
          <p className="text-gray-600 leading-relaxed">
            Vyakarni by SNS Innovations Labs Private Limited reserves the full right to accept or reject any refund or cancellation request. Such decisions will be made based on technical verification, usage records and company policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            If you have any questions related to this policy, please contact us:
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
    title: "वापसी और निरस्त/रद्द करने की नीति",
    subtitle: "हमारी वापसी और रद्दीकरण शर्तों को समझें",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          अंतिम अद्यतन: २८.०५.२०२५
        </div>
        
        <div className="text-gray-600 leading-relaxed">
          व्याकरणी (Vyakarni), SNS Innovation Labs Pvt. Ltd. द्वारा संचालित एक डिजिटल सेवा है, जो हिंदी लेखन सुधार के लिये एआई आधारित सहायता प्रदान करती है। हमारी नीति पारदर्शिता और उपयोगकर्ता संतुष्टि पर आधारित है। कृपया निम्नलिखित नियमों को ध्यानपूर्वक पढ़ें।
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. डिजिटल सेवाओं की प्रकृति</h2>
          <p className="text-gray-600 leading-relaxed">
            व्याकरणी (Vyakarni) एक डिजिटल सदस्यता आधारित सेवा है। एक बार जब आप सेवा के लिये भुगतान करते हैं, तो आपकी सदस्यता तुरंत सक्रिय हो जाती है और सेवाओं तक आपकी पहुंच आरंभ हो जाती है। इस कारण हमारी डिजिटल सेवाओं में पारंपरिक उत्पादों की तरह वापसी (return) संभव नहीं होती है।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. निरस्त/रद्द करने की नीति</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">निरस्तीकरण:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>आप अपनी सदस्यता किसी भी समय भविष्य के बिलिंग चक्र से पहले रद्द कर सकते हैं।</li>
                <li>निरस्ती करण के बाद, आपकी सेवा उस भुगतान अवधि की समाप्ति तक जारी रहेगी, लेकिन अगला भुगतान नहीं लिया जायेगा।</li>
                <li>निरस्त करने का अनुरोध [account settings] द्वारा या हमें इस पते पर ईमेल करके किया जा सकता है: support@vyakarni.com</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">स्वतः नवीनीकरण:</h3>
              <p className="text-gray-600 leading-relaxed ml-4">
                सदस्यता स्वतः नवीनीकृत हो सकती है जब तक कि आप उसे मैन्युअली निरस्त/रद्द न करें। कृपया समय पर निरस्तीकरण/रद्दीकरण करें यदि आप अगली अवधि के लिये सेवा जारी नहीं रखना चाहते।
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. वापसी नीति</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            हम डिजिटल सेवाओं की प्रकृति के कारण सामान्यतः कोई वापसी नहीं प्रदान करते हैं। हालांकि, निम्नलिखित परिस्थितियों में वापसी पर विचार किया जा सकता है:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>अगर तकनीकी कारणों से सेवा का उपयोग संभव नहीं रहा और यह हमारी ओर से साबित हुआ</li>
            <li>यदि भुगतान किया गया लेकिन सेवा सक्रिय नहीं हुई</li>
            <li>यदि उपयोगकर्ता ने गलती से एक ही सेवा के लिये दोहरा भुगतान कर दिया हो</li>
          </ul>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2">वापसी का अनुरोध करने के लिये:</h4>
            <p className="text-sm text-gray-700 mb-2">
              कृपया २४ घंटों के भीतर निम्न विवरण के साथ ईमेल करें:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
              <li>भुगतान की तारीख और स्क्रीनशॉट</li>
              <li>पंजीकृत ईमेल आईडी</li>
              <li>समस्या का संक्षिप्त विवरण</li>
            </ul>
            <p className="text-sm text-gray-700 mt-2">
              📧 ईमेल भेजें: support@vyakarni.com
            </p>
            <p className="text-sm text-gray-700">
              हम 5-7 कार्यदिवसों में उत्तर देने का प्रयास करते हैं।
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. भुगतान गेटवे से संबंधित मुद्दे</h2>
          <p className="text-gray-600 leading-relaxed">
            व्याकरणी (Vyakarni) थर्ड पार्टी पेमेंट गेटवे (जैसे Razorpay, Stripe आदि) के माध्यम से भुगतान स्वीकार करता है। यदि आपका भुगतान कट गया है लेकिन सेवा सक्रिय नहीं हुई, तो कृपया पहले हमें सूचित करें। गेटवे संबंधित विवादों में अंतिम समाधान की जिम्मेदारी गेटवे प्रदाता की होगी।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. अधिकार सुरक्षित</h2>
          <p className="text-gray-600 leading-relaxed">
            व्याकरणी (Vyakarni) किसी भी वापसी या रद्दीकरण अनुरोध को स्वीकार या अस्वीकार करने का पूर्ण अधिकार सुरक्षित रखता है। यह निर्णय तकनीकी सत्यापन, उपयोग रिकॉर्ड और कंपनी की नीति के अनुसार लिया जायेगा।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. संपर्क करें</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            यदि आपकी नीति से संबंधित कोई प्रश्न हैं, तो कृपया हमसे संपर्क करें:
          </p>
          <div className="text-gray-600 mb-4">
            📧 support@vyakarni.com<br />
            📍 SNS Innovation Labs Pvt. Ltd., नॉएडा, उत्तर प्रदेश, भारत
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              📌 नोट: यह नीति हिंदी में दी गई है ताकि हमारे उपयोगकर्ताओं को आसानी से समझ आ सके। यदि किसी कानूनी व्याख्या की आवश्यकता हो, तो अंग्रेज़ी संस्करण मान्य होगा।
            </p>
          </div>
        </section>
      </div>
    )
  };

  const currentContent = language === "english" ? englishContent : hindiContent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              व्याकरणी
            </Link>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="outline">लॉगिन</Button>
              </Link>
              <Link to="/register">
                <Button>रजिस्टर करें</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
  );
};

export default RefundPolicy;

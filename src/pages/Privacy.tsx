import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Layout from "@/components/Layout";

const Privacy = () => {
  const [language, setLanguage] = useState<"english" | "hindi">("english");

  const englishContent = {
    title: "Privacy Policy",
    subtitle: "How we collect, use, and protect your information",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          Effective Date: 28.05.2025
        </div>
        
        <div className="text-gray-600 leading-relaxed">
          SNS Innovation Labs Private Limited ("we," "Vyakarni," "the company") through this Privacy Policy wishes to inform you how we collect, use, share and protect your personal information when you use our website www.vyakarni.com ("Website"), our Hindi writing assistant app ("App") and our Hindi writing assistant services ("Services").
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. What information do we collect?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            When you use Vyakarni, we may collect the following types of information:
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">(a) Personal Information:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Name</li>
                <li>Email address</li>
                <li>Contact details</li>
                <li>Login or account-related information</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">(b) Usage Data:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Which services you used</li>
                <li>Time and duration</li>
                <li>Hindi sentences you submit (only for processing purposes)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">(c) Device and Browser Information:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Device type and operating system</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. How is the information used?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We use your information for the following purposes:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>To provide and improve services</li>
            <li>To process improvement requests</li>
            <li>To provide user support</li>
            <li>To maintain system security</li>
            <li>To send you service-related updates or announcements</li>
            <li>To ensure legal compliance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Do we share your information?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We do not sell your personal information to third parties. We may share information only under the following circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>With trusted technical service providers (such as hosting or payment gateways) who provide services on our behalf</li>
            <li>When required by law or government order</li>
            <li>To enforce our Terms of Service</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            The information shared by us is minimal and purpose-specific.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. How is information secured?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We adopt appropriate technical and organisational measures to secure your information, such as:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>SSL encryption</li>
            <li>Secure server hosting</li>
            <li>Access control and authentication</li>
            <li>API keys stored securely only on the server</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            However, 100% security on the internet cannot be guaranteed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Cookies and tracking technologies</h2>
          <p className="text-gray-600 leading-relaxed">
            We may use cookies to remember your browsing preferences and improve your user experience. You may reject cookies via your browser, but this may affect the functionality of some features.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Your rights regarding your information</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            You have the following rights:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>To request a copy of your personal data and not the text etc. that you submit for processing and correction my out website or app.</li>
            <li>To request updating or deletion of your data</li>
            <li>To request removal of your account from services</li>
            <li>To unsubscribe from marketing emails</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            To exercise any of these rights, please contact us at support@vyakarni.com.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Children's privacy</h2>
          <p className="text-gray-600 leading-relaxed">
            Vyakarni does not knowingly collect information from children under the age of 18. If you suspect that we have information about a child, please contact us and we will take necessary steps to remove it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. Changes to the policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be published on the website and the update date will be reflected in this document. Please review it regularly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">9. Contact us</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            If you have any questions, suggestions or complaints regarding this policy, please contact:
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
    title: "गोपनीयता नीति",
    subtitle: "हम आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित करते हैं",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          प्रभावी तिथि: २८.०५.२०२५
        </div>
        
        <div className="text-gray-600 leading-relaxed">
          SNS Innovation Labs Private Limited ("हम", "Vyakarni", "कंपनी") इस गोपनीयता नीति के माध्यम से यह बताना चाहता है कि हम आपकी व्यक्तिगत जानकारी को कैसे एकत्र करते हैं, उपयोग करते हैं, साझा करते हैं और सुरक्षित रखते हैं, जब आप हमारी वेबसाइट www.vyakarni.com ("वेबसाइट"), हिंदी लेखन सहायक एप ("एप") और हिंदी लेखन सहायक सेवाओं ("सेवायें") का उपयोग करते हैं।
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. हम कौन सी जानकारी एकत्र करते हैं?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            जब आप व्याकरणी (Vyakarni) का उपयोग करते हैं, तो हम निम्नलिखित प्रकार की जानकारी एकत्र कर सकते हैं:
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">निजी सूचनायें:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>नाम</li>
                <li>ईमेल पता</li>
                <li>संपर्क विवरण</li>
                <li>लॉगिन या अकाउंट संबंधी जानकारी</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">प्रयोग संबंधी सूचनायें/डाटा (Usage Data):</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>आपने कौन सी सेवायें उपयोग कीं</li>
                <li>समय और अवधि</li>
                <li>आपके द्वारा सबमिट की गई हिंदी पंक्तियाँ (केवल प्रोसेसिंग के उद्देश्य से)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">डिवाइस और ब्राउज़र संबंधी सूचनायें:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>IP पता</li>
                <li>ब्राउज़र का प्रकार</li>
                <li>डिवाइस का प्रकार और ऑपरेटिंग सिस्टम</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. जानकारी का उपयोग कैसे किया जाता है?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            हम आपकी जानकारी का उपयोग निम्नलिखित उद्देश्यों के लिये करते हैं:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>सेवायें प्रदान करना और सुधारना</li>
            <li>सुधार अनुरोधों को प्रोसेस करना</li>
            <li>उपयोगकर्ता सहायता (support) प्रदान करना</li>
            <li>सिस्टम सुरक्षा बनाये रखना</li>
            <li>आपको सेवा से संबंधित अपडेट या घोषणायें भेजना</li>
            <li>कानूनी अनुपालन सुनिश्चित करना</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. क्या हम आपकी जानकारी साझा करते हैं?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            हम आपकी व्यक्तिगत जानकारी को किसी भी तीसरे पक्ष को बेचते नहीं हैं। हम केवल निम्न परिस्थितियों में ही जानकारी साझा कर सकते हैं:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>भरोसेमंद तकनीकी सेवा प्रदाताओं (जैसे होस्टिंग या पेमेंट गेटवे) के साथ, जो हमारी ओर से सेवायें प्रदान करते हैं</li>
            <li>जब ऐसा करना कानून या सरकारी आदेश के अंतर्गत आवश्यक हो</li>
            <li>जब यह हमारी सेवा की शर्तों को लागू करने के लिये हो</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            हमारी ओर से साझा की जाने वाली जानकारी न्यूनतम और उद्देश्य-निर्धारित होती है।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. जानकारी की सुरक्षा कैसे की जाती है?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            हम आपकी जानकारी की सुरक्षा के लिये उचित तकनीकी और संगठनात्मक उपाय अपनाते हैं, जैसे:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>SSL एन्क्रिप्शन</li>
            <li>सुरक्षित सर्वर होस्टिंग</li>
            <li>एक्सेस कंट्रोल और ऑथेंटिकेशन</li>
            <li>एपीआई कुंजी केवल सर्वर पर सुरक्षित रूप से संग्रहित रहती है</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            हालांकि, यह समझना आवश्यक है कि इंटरनेट पर 100% सुरक्षा की गारंटी नहीं दी जा सकती।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. कुकीज़ और ट्रैकिंग टेक्नोलॉजी</h2>
          <p className="text-gray-600 leading-relaxed">
            हम आपकी ब्राउज़िंग प्राथमिकताओं को याद रखने और उपयोग अनुभव को बेहतर बनाने के लिये कुकीज़ (cookies) का उपयोग कर सकते हैं। आप अपने ब्राउज़र से कुकीज़ को अस्वीकार कर सकते हैं, लेकिन इससे कुछ सुविधाओं का अनुभव प्रभावित हो सकता है।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. आपकी जानकारी पर आपके अधिकार</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            आपके पास निम्नलिखित अधिकार हैं:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>अपने डेटा की प्रतिलिपि माँगना जो कि आपकी निजी सूचनाओं से सम्बंधित हों न कि हिंदी लेखों के वे इनपुट जो आपने भाषा सुधार अथवा प्रसंस्करण हेतु दिये हों</li>
            <li>अपने डेटा को अपडेट या हटवाने का अनुरोध करना</li>
            <li>सेवाओं से अपना खाता हटवाने का अनुरोध करना</li>
            <li>मार्केटिंग ईमेल से 'unsubscribe' करना</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            इनमें से किसी भी अधिकार का प्रयोग करने के लिये कृपया हमें support@vyakarni.com पर संपर्क करें।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. बच्चों की गोपनीयता</h2>
          <p className="text-gray-600 leading-relaxed">
            व्याकरणी (Vyakarni) जानबूझकर 18 वर्ष से कम आयु के बच्चों से जानकारी एकत्र नहीं करता। यदि आपको संदेह हो कि किसी बच्चे की जानकारी हमारे पास है, तो कृपया हमसे संपर्क करें और हम उसे हटाने के लिये आवश्यक कदम उठायेंगे।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. नीति में परिवर्तन</h2>
          <p className="text-gray-600 leading-relaxed">
            हम समय-समय पर इस गोपनीयता नीति को परिवर्तित और अपडेट कर सकते हैं। कोई भी संशोधन वेबसाइट पर प्रकाशित किया जायेगा और अपडेट होने की तिथि इस दस्तावेज़ में दर्शाई जायेगी। कृपया नियमित रूप से इसे पढ़ते रहें।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">9. संपर्क करें</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            यदि आपके पास इस नीति से संबंधित कोई प्रश्न, सुझाव या शिकायत है, तो कृपया संपर्क करें:
          </p>
          <div className="text-gray-600 mb-4">
            📧 support@vyakarni.com<br />
            📍 SNS Innovation Labs Pvt. Ltd., नॉएडा, उत्तर प्रदेश, भारत
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              📌 नोट: यह गोपनीयता नीति आपकी सुविधा के लिये हिंदी में दी गई है। यदि कानूनी व्याख्या या विवाद की स्थिति उत्पन्न होती है, तो अंग्रेज़ी संस्करण मान्य माना जायेगा।
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

export default Privacy;

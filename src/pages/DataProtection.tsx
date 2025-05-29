
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const DataProtection = () => {
  const [language, setLanguage] = useState<"english" | "hindi">("english");

  const englishContent = {
    title: "Data Protection and Retention Policy",
    subtitle: "How we protect and manage your data",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          Last Updated: 28.05.2025
        </div>
        
        <div className="text-gray-600 leading-relaxed">
          Vyakarni and SNS Innovation Labs Pvt. Ltd. takes your privacy and the protection of your personal data very seriously. This policy explains how long we retain your information and the measures we take to keep it secure.
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. Purpose of Data Retention</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We retain your personal information and usage data only for the purposes for which it was collected, such as:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Providing and improving your service</li>
            <li>Customer support and issue resolution</li>
            <li>Legal and regulatory compliance</li>
            <li>Service usage analysis and performance enhancement</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Types of Data Collected</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We may collect the following information you provide:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Registration details (such as name, email address)</li>
            <li>Usage logs and activity records</li>
            <li>Payment information (remains with payment gateway service provider) (securely stored, only necessary data stored, read payment gateway providers' policy)</li>
            <li>Contact and support requests</li>
            <li>Other optional information you provide</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Data Retention Period</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We retain your information only as long as necessary:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>While your user account is active and for service usage purposes</li>
            <li>For the minimum period required by legal or regulatory obligations</li>
            <li>For the duration necessary to resolve service-related disputes or claims</li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            If your service ends or you delete your account, we will take appropriate steps to securely delete or anonymise your personal data, unless legal reasons require us to retain it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Data Security Measures</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We implement the following technical and organisational measures to protect your data:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Data encryption and secure servers</li>
            <li>Access controls and authentication</li>
            <li>Regular security reviews and updates</li>
            <li>Privacy training for employees</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            You have the following rights:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>To request access to your personal information</li>
            <li>To request correction of inaccurate or irrelevant information</li>
            <li>To request deletion or deactivation of your data (subject to legal restrictions)</li>
            <li>To withdraw your consent for data processing</li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            If you wish to exercise your data rights, please contact us at: support@vyakarni.com
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Changes to the Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            This policy may be updated from time to time. Any changes will be posted on the website. Please check this page periodically.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Contact Information</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            If you have any questions about this policy or your data, please contact:
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
    title: "डेटा संरक्षण और संग्रहन नीति",
    subtitle: "हम आपके डेटा की सुरक्षा और प्रबंधन कैसे करते हैं",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          अंतिम अद्यतन: २८.०५.२०२५
        </div>
        
        <div className="text-gray-600 leading-relaxed">
          व्याकरणी (Vyakarni) एंड SNS Innovation Labs Pvt. Ltd. आपकी गोपनीयता और व्यक्तिगत डेटा की सुरक्षा को अत्यंत गंभीरता से लेता है। यह नीति बताती है कि हम आपकी जानकारी को कितने समय तक रखते हैं और इसे सुरक्षित रखने के लिये हम क्या उपाय करते हैं।
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. डेटा संग्रहण का उद्देश्य</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            हम आपकी व्यक्तिगत जानकारी और उपयोग डेटा को केवल उन उद्देश्यों के लिये संग्रहित करते हैं जिनके लिये इसे प्राप्त किया गया है, जैसे कि:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>आपको सेवा प्रदान करना और उसे सुधारना</li>
            <li>ग्राहक सहायता और समस्या समाधान</li>
            <li>कानूनी और नियामक अनुपालन</li>
            <li>सेवा उपयोग का विश्लेषण और प्रदर्शन वृद्धि</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. डेटा किस प्रकार संग्रहित किया जाता है</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            हम आपके द्वारा प्रदान की गई निम्नलिखित जानकारी संग्रहित कर सकते हैं:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>पंजीकरण विवरण (जैसे नाम, ईमेल पता)</li>
            <li>उपयोग लॉग और गतिविधि रिकॉर्ड</li>
            <li>भुगतान जानकारी (यह पेमेंट गेटवे प्रदाता के पास रहती है) (सुरक्षित रूप से, केवल आवश्यक डेटा लिया जाता है, इस सम्बन्ध में पेमेंट गेटवे प्रदाता की नीतियों को जानें)</li>
            <li>संपर्क और सहायता अनुरोध</li>
            <li>अन्य वैकल्पिक जानकारी जो आप हमें देते हैं</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. डेटा संरक्षण अवधि</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            हम आपकी जानकारी को केवल तब तक रखते हैं जब तक कि वह आवश्यक हो:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>उपयोगकर्ता के खाते की सक्रियता अवधि के दौरान और सेवा उपयोग के लिये आवश्यक</li>
            <li>वैधानिक या नियामक आवश्यकताओं के अनुसार न्यूनतम अवधि के लिये</li>
            <li>सेवा संबंधी विवादों या दावा समाधान तक आवश्यक अवधि के लिये</li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            यदि आपकी सेवा समाप्त हो जाती है या आप खाते को हटा देते हैं, तो हम आपकी व्यक्तिगत जानकारी को सुरक्षित रूप से हटाने या निरस्त करने के लिये उचित कदम उठायेंगे, जब तक कि वैधानिक कारणवश इसे बनाये रखने की आवश्यकता न हो।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. डेटा सुरक्षा उपाय</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            हम आपके डेटा की सुरक्षा के लिये निम्नलिखित तकनीकी और संगठनात्मक उपाय अपनाते हैं:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>डेटा एन्क्रिप्शन और सुरक्षित सर्वर</li>
            <li>पहुँच नियंत्रण और प्रमाणीकरण</li>
            <li>नियमित सुरक्षा समीक्षा और अपडेट</li>
            <li>कर्मचारियों के लिये गोपनीयता प्रशिक्षण</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. आपके अधिकार</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            आपके पास निम्न अधिकार हैं:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>अपनी व्यक्तिगत जानकारी तक पहुँच का अनुरोध करना</li>
            <li>गलत या अप्रासंगिक जानकारी को सुधारने का अनुरोध</li>
            <li>अपनी जानकारी को हटाने या निष्क्रिय करने का अनुरोध (कानूनी प्रतिबंधों के अधीन)</li>
            <li>अपनी डेटा प्रोसेसिंग की सहमति वापस लेने का अधिकार</li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            यदि आप अपने डेटा अधिकारों का प्रयोग करना चाहते हैं, तो कृपया हमसे संपर्क करें: support@vyakarni.com
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. नीति में बदलाव</h2>
          <p className="text-gray-600 leading-relaxed">
            यह नीति समय-समय पर परिवर्तित एवं अपडेट की जा सकती है। किसी भी परिवर्तन की सूचना वेबसाइट पर प्रकाशित कर दी जायेगी। कृपया समय-समय पर इस पृष्ठ को देखें।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. संपर्क जानकारी</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            यदि आपको इस नीति या आपके डेटा के बारे में कोई प्रश्न हो, तो कृपया संपर्क करें:
          </p>
          <div className="text-gray-600 mb-4">
            📧 support@vyakarni.com<br />
            📍 SNS Innovation Labs Pvt. Ltd., नॉएडा, उत्तर प्रदेश, भारत
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              📌 नोट: यह नीति हिंदी में आपके बेहतर समझ के लिये प्रस्तुत की गई है। यदि किसी कानूनी विवाद या व्याख्या की आवश्यकता हो, तो अंग्रेज़ी संस्करण प्राथमिक माना जायेगा।
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

export default DataProtection;

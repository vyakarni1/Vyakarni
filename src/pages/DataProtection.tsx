import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Layout from "@/components/Layout";

const DataProtection = () => {
  const [language, setLanguage] = useState<"english" | "hindi">("english");

  const englishContent = {
    title: "Data Protection Policy",
    subtitle: "How we protect your data",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          Effective Date: 28.05.2025
        </div>

        <div className="text-gray-600 leading-relaxed">
          SNS Innovation Labs Private Limited ("we," "Vyakarni," "the company") is committed to protecting the privacy and security of your personal data. This Data Protection Policy explains how we collect, use, and safeguard your information in compliance with applicable data protection laws and regulations.
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. Data Collection</h2>
          <p className="text-gray-600 leading-relaxed">
            We collect personal data that you provide to us directly, such as when you register for an account, use our services, or contact us for support. This may include your name, email address, contact information, and any other information you choose to provide.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Use of Data</h2>
          <p className="text-gray-600 leading-relaxed">
            We use your personal data for the following purposes:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>To provide and improve our services</li>
            <li>To personalize your experience</li>
            <li>To communicate with you about updates, promotions, and other relevant information</li>
            <li>To analyze usage patterns and trends</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, disclosure, alteration, or destruction. These measures include:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and audits</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Employee training on data protection best practices</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Data Sharing</h2>
          <p className="text-gray-600 leading-relaxed">
            We may share your personal data with trusted third parties who assist us in providing our services, such as hosting providers, payment processors, and analytics providers. We ensure that these third parties are contractually obligated to protect your data and use it only for the purposes we specify.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
          <p className="text-gray-600 leading-relaxed">
            We retain your personal data for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable laws and regulations. When your data is no longer needed, we securely delete or anonymize it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
          <p className="text-gray-600 leading-relaxed">
            You have the following rights regarding your personal data:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>The right to access your data</li>
            <li>The right to rectify inaccurate data</li>
            <li>The right to erase your data</li>
            <li>The right to restrict the processing of your data</li>
            <li>The right to data portability</li>
            <li>The right to object to the processing of your data</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            To exercise these rights, please contact us at support@vyakarni.com.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. International Data Transfers</h2>
          <p className="text-gray-600 leading-relaxed">
            If we transfer your personal data to countries outside of your jurisdiction, we will ensure that appropriate safeguards are in place to protect your data in accordance with applicable data protection laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. Updates to this Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this Data Protection Policy from time to time to reflect changes in our data processing practices or legal requirements. We will post the updated policy on our website and notify you of any material changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have any questions or concerns about this Data Protection Policy or our data processing practices, please contact us at:
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
    title: "डेटा संरक्षण नीति",
    subtitle: "हम आपके डेटा को कैसे सुरक्षित रखते हैं",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          प्रभावी तिथि: २८.०५.२०२५
        </div>

        <div className="text-gray-600 leading-relaxed">
          एसएनएस इनोवेशन लैब्स प्राइवेट लिमिटेड ("हम", "व्याकरणी", "कंपनी") आपकी व्यक्तिगत डेटा की गोपनीयता और सुरक्षा की रक्षा के लिए प्रतिबद्ध है। यह डेटा संरक्षण नीति बताती है कि हम लागू डेटा संरक्षण कानूनों और विनियमों के अनुपालन में आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित करते हैं।
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. डेटा संग्रह</h2>
          <p className="text-gray-600 leading-relaxed">
            हम व्यक्तिगत डेटा एकत्र करते हैं जो आप हमें सीधे प्रदान करते हैं, जैसे कि जब आप किसी खाते के लिए पंजीकरण करते हैं, हमारी सेवाओं का उपयोग करते हैं, या समर्थन के लिए हमसे संपर्क करते हैं। इसमें आपका नाम, ईमेल पता, संपर्क जानकारी और आपके द्वारा प्रदान की जाने वाली कोई अन्य जानकारी शामिल हो सकती है।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. डेटा का उपयोग</h2>
          <p className="text-gray-600 leading-relaxed">
            हम आपकी व्यक्तिगत डेटा का उपयोग निम्नलिखित उद्देश्यों के लिए करते हैं:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>हमारी सेवाओं को प्रदान और बेहतर बनाना</li>
            <li>आपके अनुभव को निजीकृत करना</li>
            <li>आपको अपडेट, प्रचार और अन्य प्रासंगिक जानकारी के बारे में सूचित करना</li>
            <li>उपयोग के पैटर्न और रुझानों का विश्लेषण करना</li>
            <li>कानूनी दायित्वों का पालन करना</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. डेटा सुरक्षा</h2>
          <p className="text-gray-600 leading-relaxed">
            हम आपकी व्यक्तिगत डेटा को अनधिकृत पहुंच, प्रकटीकरण, परिवर्तन या विनाश से बचाने के लिए उचित तकनीकी और संगठनात्मक उपाय लागू करते हैं। इन उपायों में शामिल हैं:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>डेटा का पारगमन और आराम में एन्क्रिप्शन</li>
            <li>नियमित सुरक्षा आकलन और ऑडिट</li>
            <li>पहुंच नियंत्रण और प्रमाणीकरण तंत्र</li>
            <li>डेटा संरक्षण सर्वोत्तम प्रथाओं पर कर्मचारी प्रशिक्षण</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. डेटा साझाकरण</h2>
          <p className="text-gray-600 leading-relaxed">
            हम आपकी व्यक्तिगत डेटा को विश्वसनीय तृतीय पक्षों के साथ साझा कर सकते हैं जो हमारी सेवाओं को प्रदान करने में हमारी सहायता करते हैं, जैसे कि होस्टिंग प्रदाता, भुगतान प्रोसेसर और एनालिटिक्स प्रदाता। हम यह सुनिश्चित करते हैं कि ये तृतीय पक्ष संविदात्मक रूप से आपके डेटा की सुरक्षा के लिए बाध्य हैं और इसका उपयोग केवल उन उद्देश्यों के लिए करते हैं जो हम निर्दिष्ट करते हैं।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. डेटा प्रतिधारण</h2>
          <p className="text-gray-600 leading-relaxed">
            हम आपकी व्यक्तिगत डेटा को तब तक बनाए रखते हैं जब तक कि उन उद्देश्यों को पूरा करने के लिए आवश्यक हो जिनके लिए इसे एकत्र किया गया था, या लागू कानूनों और विनियमों द्वारा आवश्यक है। जब आपके डेटा की आवश्यकता नहीं होती है, तो हम इसे सुरक्षित रूप से हटा या गुमनाम कर देते हैं।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. आपके अधिकार</h2>
          <p className="text-gray-600 leading-relaxed">
            आपके पास अपनी व्यक्तिगत डेटा के बारे में निम्नलिखित अधिकार हैं:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>अपने डेटा तक पहुंचने का अधिकार</li>
            <li>गलत डेटा को सुधारने का अधिकार</li>
            <li>अपने डेटा को मिटाने का अधिकार</li>
            <li>अपने डेटा के प्रसंस्करण को प्रतिबंधित करने का अधिकार</li>
            <li>डेटा पोर्टेबिलिटी का अधिकार</li>
            <li>अपने डेटा के प्रसंस्करण पर आपत्ति करने का अधिकार</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            इन अधिकारों का प्रयोग करने के लिए, कृपया हमसे support@vyakarni.com पर संपर्क करें।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. अंतर्राष्ट्रीय डेटा स्थानांतरण</h2>
          <p className="text-gray-600 leading-relaxed">
            यदि हम आपकी व्यक्तिगत डेटा को आपके अधिकार क्षेत्र के बाहर के देशों में स्थानांतरित करते हैं, तो हम यह सुनिश्चित करेंगे कि लागू डेटा संरक्षण कानूनों के अनुसार आपके डेटा की सुरक्षा के लिए उचित सुरक्षा उपाय किए गए हैं।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. इस नीति में अपडेट</h2>
          <p className="text-gray-600 leading-relaxed">
            हम अपनी डेटा प्रसंस्करण प्रथाओं या कानूनी आवश्यकताओं में परिवर्तन को दर्शाने के लिए समय-समय पर इस डेटा संरक्षण नीति को अपडेट कर सकते हैं। हम अद्यतन नीति को अपनी वेबसाइट पर पोस्ट करेंगे और आपको किसी भी भौतिक परिवर्तन की सूचना देंगे।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">9. हमसे संपर्क करें</h2>
          <p className="text-gray-600 leading-relaxed">
            यदि आपके पास इस डेटा संरक्षण नीति या हमारी डेटा प्रसंस्करण प्रथाओं के बारे में कोई प्रश्न या चिंता है, तो कृपया हमसे संपर्क करें:
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

export default DataProtection;

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Layout from "@/components/Layout";

const OtherPolicies = () => {
  const [language, setLanguage] = useState<"english" | "hindi">("english");

  const englishContent = {
    title: "Other Policies",
    subtitle: "Additional policies governing our services",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          Date: 28.05.2025
        </div>
        
        <div className="text-gray-600 leading-relaxed">
          Vyakarni and SNS Innovation Labs Pvt. Ltd. follows certain other policies which are stated as under:
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. Cookie Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            Our website uses cookies and other tracking technologies to enhance the user experience. Cookies remember your preferences and improve the website's functionality. You can manage or reject cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Acceptable Use Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            Vyakarni must be used only for lawful, fair, ethical and appropriate purposes. Users are not permitted to misuse the platform, distribute illegal content or engage in activities that harm other users. Violation of these rules may result in service termination.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. User Conduct Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We expect users to behave respectfully, civilly and with tolerance. Offensive language, violent or discriminatory content or any form of abusive behaviour will lead to appropriate action against the offending users.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Accessibility Statement</h2>
          <p className="text-gray-600 leading-relaxed">
            Vyakarni is committed to ensuring that our website and services are accessible to all users. We continually strive to improve ease of use and accessibility.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Copyright Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            The content available on Vyakarni is protected under our or third-party copyrights. Upon receiving notice of any copyright infringement, we will conduct a proper investigation and may take legal action against the infringer. Copyright complaints can be sent to us via email.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Contact Information</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            If you have any questions about a policy, that you are not able to find here in our different policies, please contact:
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
    title: "अन्य नीतियाँ",
    subtitle: "हमारी सेवाओं को नियंत्रित करने वाली अतिरिक्त नीतियाँ",
    content: (
      <div className="space-y-8">
        <div className="text-sm text-gray-500 mb-6">
          तारीख: २८.०५.२०२५
        </div>
        
        <div className="text-gray-600 leading-relaxed">
          व्याकरणी (Vyakarni) and SNS Innovation Labs Pvt. Ltd. कुछ निम्नांकित अन्य नीतियों का पालन करते हैं:
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. कुकी नीति</h2>
          <p className="text-gray-600 leading-relaxed">
            हमारी वेबसाइट पर कुकी और अन्य ट्रैकिंग तकनीकों का उपयोग किया जाता है ताकि उपयोगकर्ता अनुभव को उत्तम बनाया जा सके। कुकीज आपकी प्राथमिकताओं को याद रखती हैं और वेबसाइट की कार्यक्षमता बढ़ाती हैं। आप अपनी ब्राउज़र सेटिंग्स से कुकीज को नियंत्रित या अस्वीकार कर सकते हैं।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. स्वीकृत उपयोग नीति</h2>
          <p className="text-gray-600 leading-relaxed">
            Vyakarni का उपयोग केवल वैध, नैतिक, उचित और उपयुक्त उद्देश्यों के लिये ही किया जाना चाहिये। उपयोगकर्ता को प्लेटफ़ॉर्म का दुरुपयोग, अवैध सामग्री का वितरण या अन्य उपयोगकर्ताओं को हानि पहुँचाने वाले कार्य करने की अनुमति नहीं है। नियमों का उल्लंघन करने पर सेवा बंद की जा सकती है।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. उपयोगकर्ता आचार संहिता</h2>
          <p className="text-gray-600 leading-relaxed">
            हम उपयोगकर्ताओं से अपेक्षा करते हैं कि वे सम्मानजनक, सभ्य और सहिष्णु व्यवहार करें। अपमानजनक भाषा, हिंसक या भेदभावपूर्ण सामग्री या किसी भी प्रकार का दुर्व्यवहार करने वाले उपयोगकर्ताओं के खिलाफ उचित कार्रवाही की जायेगी।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. पहुँच योग्यता घोषणा</h2>
          <p className="text-gray-600 leading-relaxed">
            व्याकरणी (Vyakarni) यह सुनिश्चित करने के लिये प्रतिबद्ध है कि हमारी वेबसाइट और सेवायें सभी उपयोगकर्ताओं के लिये सुलभ हों। हम लगातार सुधार करते रहते हैं ताकि उपयोग में सरलता हो और पहुँच बढ़ सके।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. कॉपीराइट नीति</h2>
          <p className="text-gray-600 leading-relaxed">
            व्याकरणी (Vyakarni) पर उपलब्ध सामग्री हमारी या तीसरे पक्ष के कॉपीराइट के अंतर्गत आती है। किसी भी प्रकार की कॉपीराइट उल्लंघन की सूचना प्राप्त होने पर उचित जाँच की जायेगी और उल्लंघनकर्ता के खिलाफ कानूनी कार्यवाही की जा सकती है। कॉपीराइट संबंधी शिकायतें आप हमें ईमेल के माध्यम से भेज सकते हैं।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. संपर्क जानकारी</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            यदि आपको हमारी नीतियों के विषय में कोई प्रश्न हो, जिनका उत्तर आपको हमारी नीतियों के दस्तावेजों में नहीं मिल रहा है, कृपया हमसे संपर्क करें:
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

export default OtherPolicies;

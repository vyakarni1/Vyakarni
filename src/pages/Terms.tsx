
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Languages } from "lucide-react";
import { useState } from "react";

const Terms = () => {
  const [isHindi, setIsHindi] = useState(false);

  const toggleLanguage = () => {
    setIsHindi(!isHindi);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 animate-fade-in">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link to="/">
            <Button variant="outline" className="transition-all duration-200 hover:scale-105">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isHindi ? "होम पेज पर वापस जाएं" : "Back to Home"}
            </Button>
          </Link>
          
          <Button 
            onClick={toggleLanguage}
            variant="outline"
            className="transition-all duration-200 hover:scale-105"
          >
            <Languages className="h-4 w-4 mr-2" />
            {isHindi ? "English" : "हिंदी"}
          </Button>
        </div>
        
        <Card className="max-w-4xl mx-auto animate-scale-in">
          <CardHeader className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              व्याकरणी
            </div>
            <CardTitle className="text-3xl">
              {isHindi ? "नियम और शर्तें" : "Terms & Conditions"}
            </CardTitle>
            <p className="text-gray-600">
              {isHindi ? "प्रभावी तिथि: २८.०५.२०२५" : "Effective Date: 28.05.2025"}
            </p>
          </CardHeader>
          
          <CardContent className="prose prose-gray max-w-none space-y-6">
            {!isHindi ? (
              // English Content
              <>
                <section>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Welcome to Vyakarni! These Terms & Conditions ("Terms") govern your use of the website www.vyakarni.com ("Website"), our Hindi writing assistant app ("App") and the Hindi writing assistant services including but not limited to grammar correction, word selection, syntax formation, punctuation corrections and style enhancement of language etc. ("Services") offered by SNS Innovation Labs Private Limited ("we", "us", or "our").
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing or using our Website or Services, you agree to be bound by these Terms. If you do not agree, please do not use the Services.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">1. Eligibility</h2>
                  <p className="text-gray-700 leading-relaxed">
                    You must be at least 18 years of age or have the consent of a parent or legal guardian to use Vyakarni. By using the Website, you represent and warrant that you meet these requirements.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">2. Description of Services</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Vyakarni is an AI-powered Hindi grammar assistant that offers:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-3">
                    <li>Real-time grammar and syntax correction</li>
                    <li>Word selection and sentence beautification/style enhancement</li>
                    <li>Punctuation suggestions</li>
                    <li>Stylistic consistency using user-defined dictionaries</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed">
                    The Services are provided "as is" and we strive for high accuracy but do not guarantee error-free output.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">You agree:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>To use the Services only for lawful purposes</li>
                    <li>Not to upload or submit any content that is illegal, obscene, defamatory or infringes any rights</li>
                    <li>Not to attempt to access, reverse-engineer or modify our software or backend systems</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">4. Account and Access</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Some features may require account creation. You are responsible for maintaining the confidentiality of your login credentials. We are not liable for any unauthorised access resulting from your failure to protect such credentials.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    All content, codes, logos, trademarks and technology associated with Vyakarni are the intellectual property of SNS Innovation Labs Private Limited. You may not use our branding, logo, trademark or content without prior explicit written permission.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You retain ownership of the text you submit to Vyakarni, but by using our Services, you grant us a limited, non-exclusive licence to process your content for the purpose of providing corrections, enhancements and further model training.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">6. Pricing and Payments</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    If using a paid version of Vyakarni, you agree to the pricing terms listed on our Website. We reserve the right to modify pricing without prior notice.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    All payments are processed via secured third-party payment gateways. We do not store your payment details.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">7. Refund Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    As Vyakarni offers digital services, we do not offer refunds after a correction session has begun or an API request has been completed or you have subscribed but not used the services. You can cancel your subscription at any time and your subscription will be automatically terminated at the end of the month in which you cancel, once you have fully utilized the services for that month. However, if you face any technical issues, you may contact us for resolution.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">8. Data Privacy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We value your privacy. Please refer to our Privacy Policy and Data Protection and Retention Policy for detailed information on how we collect, use, and protect your data in accordance with applicable Indian data protection laws.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">9. Termination</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to suspend or terminate your access to Vyakarni for violations of these Terms or misuse of the Services.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">10. Limitation of Liability</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Vyakarni is a supportive tool and should not be relied upon as a substitute for human review. We are not responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Any academic, legal or professional consequences of using the tool.</li>
                    <li>Any damages arising from errors, inaccuracies or interruptions in service.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">11. Governing Law & Jurisdiction</h2>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from or related to these Terms shall be subject to the exclusive jurisdiction of the courts of Noida, Uttar Pradesh, India.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">12. Amendments</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may update these Terms from time to time. All changes will be posted on this page with an updated effective date. Continued use of the Services indicates your acceptance of the revised Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">13. Contact Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    If you have any questions about these Terms, please write to us at:
                  </p>
                  <p className="text-gray-600">
                    📧 support@vyakarni.com<br />
                    📍 SNS Innovation Labs Pvt. Ltd., Noida, Uttar Pradesh, India
                  </p>
                </section>
              </>
            ) : (
              // Hindi Content
              <>
                <section>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    व्याकरणी (Vyakarni) में आपका स्वागत है! ये नियम और शर्तें ("नियम") वेबसाइट www.vyakarni.com ("वेबसाइट"), हिंदी लेखन सहायक एप ("एप") और SNS Innovation Labs Private Limited ("हम", "हमारा", "कंपनी") द्वारा प्रदान की जा रही हिंदी लेखन सहायक सेवायें, जिनमें व्याकरण सुधार, शब्द चयन, वाक्य संरचना, विराम चिह्नों का संशोधन और भाषा की शैली में सुधार आदि शामिल हैं, लेकिन इन्हीं तक सीमित नहीं हैं ("सेवायें") के उपयोग को नियंत्रित करती हैं।
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    वेबसाइट या सेवाओं का उपयोग करके, आप इन नियमों से सहमत होते हैं। यदि आप सहमत नहीं हैं, तो कृपया सेवाओं का उपयोग न करें।
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">1. पात्रता</h2>
                  <p className="text-gray-700 leading-relaxed">
                    व्याकरणी (Vyakarni) का उपयोग करने के लिये आपकी आयु कम से कम 18 वर्ष होनी चाहिये या आपको अपने माता-पिता या कानूनी अभिभावक की अनुमति प्राप्त होनी चाहिये। वेबसाइट का उपयोग करके आप पुष्टि करते हैं कि आप इन आवश्यकताओं को पूरा करते हैं।
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">2. सेवाओं का विवरण</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    व्याकरणी (Vyakarni) एक एआई आधारित हिंदी लेखन सहायक है, जो निम्नलिखित सुविधायें प्रदान करता है:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-3">
                    <li>वास्तविक समय में व्याकरण और वाक्य संरचना सुधार</li>
                    <li>शब्द चयन और वाक्य की सुंदरता बढ़ाना</li>
                    <li>विराम चिन्हों का सुझाव</li>
                    <li>शैलीगत सुधार, उपयोगकर्ता द्वारा परिभाषित शब्दकोश के आधार पर</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed">
                    सेवायें "जैसी हैं" वैसी ही प्रदान की जाती हैं। हम उच्च सटीकता का प्रयास करते हैं, लेकिन त्रुटिरहित परिणाम की गारंटी नहीं देते हैं।
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">3. उपयोगकर्ता के उत्तरदायित्व</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">आप सहमत होते हैं कि आप:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>सेवाओं का उपयोग केवल वैध उद्देश्यों के लिये करेंगे</li>
                    <li>कोई भी अवैध, आपत्तिजनक, मानहानिकारक या कॉपीराइट युक्त सामग्री अपलोड या सबमिट नहीं करेंगे</li>
                    <li>हमारी तकनीक, सॉफ़्टवेयर या बैकएंड सिस्टम में अनधिकृत रूप से प्रवेश या संशोधन का प्रयास नहीं करेंगे</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">4. खाता और पहुँच</h2>
                  <p className="text-gray-700 leading-relaxed">
                    कुछ सेवाओं का उपयोग करने के लिये खाता बनाना आवश्यक हो सकता है। आप अपने लॉगिन विवरण की गोपनीयता बनाये रखने के लिये स्वयं जिम्मेदार हैं। यदि आपकी लापरवाही से अनधिकृत पहुँच होती है, तो उसके लिये हम उत्तरदायी नहीं होंगे।
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">5. बौद्धिक संपदा अधिकार</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    व्याकरणी (Vyakarni) से संबंधित सभी सामग्री, कोड और तकनीक SNS Innovation Labs Private Limited की बौद्धिक संपत्ति है। हमारी अनुमति के बिना आप हमारी ब्रांडिंग, लोगो, ट्रेडमार्क या किसी भी सामग्री का उपयोग नहीं कर सकते।
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    आप व्याकरणी (Vyakarni) में जो भी सामग्री सबमिट करते हैं, उसके मालिक आप ही बने रहते हैं। लेकिन सुधार सेवायें देने के उद्देश्य से तथा मॉडल को आगे प्रशिक्षित करने के उद्देश्य से आप हमें उसे संशोधित करने का सीमित, गैर-लाइसेंसी अधिकार देते हैं।
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">6. मूल्य निर्धारण और भुगतान</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    यदि आप व्याकरणी (Vyakarni) का भुगतान आधारित संस्करण उपयोग कर रहे हैं, तो आप वेबसाइट पर दर्शाये गये निर्धारित मूल्य से सहमत हैं। हम बिना किसी पूर्व सूचना के इस मूल्य में परिवर्तन कर सकते हैं।
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    सभी भुगतान विश्वसनीय थर्ड-पार्टी गेटवे के माध्यम से सुरक्षित रूप से किये जाते हैं। हम आपके भुगतान विवरण को संग्रहित नहीं करते।
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">7. रिफंड नीति</h2>
                  <p className="text-gray-700 leading-relaxed">
                    व्याकरणी (Vyakarni) डिजिटल सेवायें प्रदान करता है, इसलिये एक बार सुधार प्रक्रिया शुरू होने के बाद या एपीआई अनुरोध पूरा हो जाने पर अथवा आपके द्वारा हमारी सेवाओं को सब्सक्राइब कर लेने के उपरांत रिफंड नहीं दिया जायेगा। हालांकि, यदि आपको तकनीकी समस्या आती है, तो आप समाधान के लिये हमसे संपर्क कर सकते हैं। आप अपना सब्सक्रिप्शन किसी भी समय निरस्त कर सकते हैं एवं आपका सब्सक्रिप्शन निरस्त करने के माह के पूरा हो जाने के उपरांत, जब आप उस माह की सेवायें पूर्ण कर लेंगे, स्वतः निरस्त हो जायेगा।
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">8. डेटा गोपनीयता</h2>
                  <p className="text-gray-700 leading-relaxed">
                    हम आपकी गोपनीयता का सम्मान करते हैं। कृपया हमारी गोपनीयता नीति और डेटा संरक्षण और संग्रहण नीति देखें, जिसमें यह बताया गया है कि हम आपके डेटा को कैसे एकत्र करते हैं, उपयोग करते हैं और भारतीय डेटा संरक्षण कानूनों के अनुसार सुरक्षित रखते हैं।
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">9. समाप्ति (Termination)</h2>
                  <p className="text-gray-700 leading-relaxed">
                    यदि आप इन नियमों का उल्लंघन करते हैं या सेवाओं का दुरुपयोग करते हैं, तो हम आपकी सेवा को अस्थायी या स्थायी रूप से बंद कर सकते हैं।
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">10. उत्तरदायित्व की सीमा (Limitation of Liability)</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    व्याकरणी (Vyakarni) एक सहायक उपकरण है और यह मानवीय समीक्षा का विकल्प नहीं है। हम किसी भी:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>शैक्षणिक, कानूनी या व्यावसायिक परिणामों के लिये उत्तरदायी नहीं हैं</li>
                    <li>त्रुटियों, गलतियों या सेवा में हुयी रुकावटों के कारण हुये नुकसान के लिये उत्तरदायी नहीं हैं</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">11. लागू कानून और क्षेत्राधिकार</h2>
                  <p className="text-gray-700 leading-relaxed">
                    ये नियम भारत के कानूनों द्वारा नियंत्रित होंगे। इनसे संबंधित कोई भी विवाद केवल नॉएडा, उत्तर प्रदेश के न्यायालयों के अधिकार क्षेत्र में ही सुलझाया जायेगा।
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">12. संशोधन</h2>
                  <p className="text-gray-700 leading-relaxed">
                    हम समय-समय पर इन नियमों को संशोधित, परिवर्तित, अद्यतित और अपडेट कर सकते हैं। सभी परिवर्तन इस पृष्ठ पर प्रभावी तिथि के साथ प्रकाशित किये जायेंगे। सेवा का निरंतर उपयोग अद्यतन नियमों की आपकी स्वीकृति माना जायेगा।
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">13. संपर्क जानकारी</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    यदि आपके कोई प्रश्न हैं, तो आप हमसे संपर्क कर सकते हैं:
                  </p>
                  <p className="text-gray-600">
                    📧 support@vyakarni.com<br />
                    📍 SNS Innovation Labs Pvt. Ltd., नॉएडा, उत्तर प्रदेश, भारत
                  </p>
                </section>

                <section className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800 mb-2">📌 नोट:</h3>
                  <p className="text-yellow-700 text-sm leading-relaxed">
                    यह दस्तावेज़ आपकी सुविधा के लिये हिंदी में प्रस्तुत किया गया है। यदि किसी कानूनी व्याख्या या विवाद की स्थिति उत्पन्न होती है, तो अंग्रेज़ी संस्करण को प्राथमिकता दी जायेगी।
                  </p>
                </section>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;

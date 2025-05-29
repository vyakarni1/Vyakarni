
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 animate-fade-in">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="transition-all duration-200 hover:scale-105">
              <ArrowLeft className="h-4 w-4 mr-2" />
              होम पेज पर वापस जाएं
            </Button>
          </Link>
        </div>
        
        <Card className="max-w-4xl mx-auto animate-scale-in">
          <CardHeader className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              व्याकरणी
            </div>
            <CardTitle className="text-3xl">सेवा की शर्तें</CardTitle>
            <p className="text-gray-600">अंतिम अपडेट: 29 मई, 2025</p>
          </CardHeader>
          
          <CardContent className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. सेवा स्वीकृति</h2>
              <p className="text-gray-700 leading-relaxed">
                व्याकरणी की सेवाओं का उपयोग करके, आप इन शर्तों से सहमत होते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया हमारी सेवाओं का उपयोग न करें।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. सेवा विवरण</h2>
              <p className="text-gray-700 leading-relaxed">
                व्याकरणी एक हिंदी भाषा व्याकरण जांच उपकरण है जो आपके टेक्स्ट में व्याकरण संबंधी त्रुटियों की पहचान और सुधार में सहायता करता है।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. उपयोगकर्ता जिम्मेदारियां</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>आप सटीक और वैध जानकारी प्रदान करने के लिए जिम्मेदार हैं</li>
                <li>आप अपने खाते की सुरक्षा बनाए रखने के लिए जिम्मेदार हैं</li>
                <li>आप सेवा का दुरुपयोग नहीं करेंगे</li>
                <li>आप कानूनी उद्देश्यों के लिए ही सेवा का उपयोग करेंगे</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. बौद्धिक संपदा</h2>
              <p className="text-gray-700 leading-relaxed">
                व्याकरणी की सभी सामग्री, सॉफ्टवेयर, और डिज़ाइन हमारी बौद्धिक संपदा है। आप इसे हमारी अनुमति के बिना कॉपी या वितरित नहीं कर सकते।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. डेटा सुरक्षा</h2>
              <p className="text-gray-700 leading-relaxed">
                हम आपकी व्यक्तिगत जानकारी की सुरक्षा को गंभीरता से लेते हैं। हमारी गोपनीयता नीति देखें कि हम आपके डेटा को कैसे संभालते हैं।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. सेवा में परिवर्तन</h2>
              <p className="text-gray-700 leading-relaxed">
                हम किसी भी समय अपनी सेवाओं में परिवर्तन या सुधार कर सकते हैं। महत्वपूर्ण परिवर्तनों के बारे में हम आपको सूचित करेंगे।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. सेवा समाप्ति</h2>
              <p className="text-gray-700 leading-relaxed">
                हम किसी भी समय, किसी भी कारण से आपकी सेवा को समाप्त करने का अधिकार सुरक्षित रखते हैं, यदि आप इन शर्तों का उल्लंघन करते हैं।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. संपर्क जानकारी</h2>
              <p className="text-gray-700 leading-relaxed">
                यदि आपके पास इन शर्तों के बारे में कोई प्रश्न हैं, तो कृपया हमसे संपर्क करें:
              </p>
              <p className="text-gray-600">
                ईमेल: support@vyakarni.com<br />
                फोन: +91-XXXX-XXXX-XX
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;

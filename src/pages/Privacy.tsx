
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              हिंदी व्याकरण सुधारक
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
            प्राइवेसी पॉलिसी
          </h1>
          <p className="text-xl text-gray-600">
            आपकी निजता हमारी प्राथमिकता है
          </p>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-lg max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">जानकारी संग्रह</h2>
                <p className="text-gray-600 leading-relaxed">
                  हम केवल आवश्यक जानकारी एकत्र करते हैं जो हमारी सेवाओं को बेहतर बनाने के लिए आवश्यक है। 
                  इसमें आपका नाम, ईमेल पता, और आपके द्वारा प्रदान किए गए टेक्स्ट शामिल हैं।
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">डेटा का उपयोग</h2>
                <p className="text-gray-600 leading-relaxed">
                  आपकी जानकारी का उपयोग केवल निम्नलिखित उद्देश्यों के लिए किया जाता है:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                  <li>व्याकरण सुधार सेवा प्रदान करना</li>
                  <li>आपके खाते की सुरक्षा</li>
                  <li>सेवा की गुणवत्ता में सुधार</li>
                  <li>तकनीकी सहायता प्रदान करना</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">डेटा सुरक्षा</h2>
                <p className="text-gray-600 leading-relaxed">
                  हम आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए उद्योग मानक एन्क्रिप्शन और सुरक्षा उपायों का उपयोग करते हैं। 
                  आपका डेटा सुरक्षित सर्वर पर संग्रहीत किया जाता है।
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">तृतीय पक्ष साझाकरण</h2>
                <p className="text-gray-600 leading-relaxed">
                  हम आपकी व्यक्तिगत जानकारी को तृतीय पक्ष के साथ साझा नहीं करते हैं, केवल निम्नलिखित स्थितियों को छोड़कर:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                  <li>जब आपकी स्पष्ट सहमति हो</li>
                  <li>कानूनी आवश्यकताओं का अनुपालन</li>
                  <li>सेवा प्रदाताओं के साथ (जो गोपनीयता समझौते के तहत बंधे हैं)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">कुकीज़</h2>
                <p className="text-gray-600 leading-relaxed">
                  हम आपके अनुभव को बेहतर बनाने के लिए कुकीज़ का उपयोग करते हैं। 
                  आप अपने ब्राउज़र सेटिंग्स में कुकीज़ को अक्षम कर सकते हैं।
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">आपके अधिकार</h2>
                <p className="text-gray-600 leading-relaxed">
                  आपको निम्नलिखित अधिकार प्राप्त हैं:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                  <li>अपनी जानकारी तक पहुंच</li>
                  <li>अपनी जानकारी को सुधारना</li>
                  <li>अपनी जानकारी को हटाने का अनुरोध</li>
                  <li>डेटा प्रसंस्करण पर आपत्ति</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">संपर्क</h2>
                <p className="text-gray-600 leading-relaxed">
                  यदि आपके पास इस प्राइवेसी पॉलिसी के बारे में कोई प्रश्न हैं, तो कृपया हमसे संपर्क करें:
                </p>
                <p className="text-gray-600 mt-4">
                  ईमेल: privacy@hindigrammar.com<br />
                  फोन: +91 98765 43210
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">नीति में बदलाव</h2>
                <p className="text-gray-600 leading-relaxed">
                  हम समय-समय पर इस प्राइवेसी पॉलिसी को अपडेट कर सकते हैं। 
                  किसी भी बदलाव की स्थिति में हम आपको सूचित करेंगे।
                </p>
                <p className="text-gray-600 mt-4">
                  <strong>अंतिम अपडेट:</strong> {new Date().toLocaleDateString('hi-IN')}
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            हिंदी व्याकरण सुधारक
          </div>
          <p className="text-gray-400 mb-4">AI की शक्ति से हिंदी भाषा को बेहतर बनाएं</p>
          <div className="space-x-6">
            <Link to="/" className="text-gray-400 hover:text-white">होम</Link>
            <Link to="/about" className="text-gray-400 hover:text-white">हमारे बारे में</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white">संपर्क</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;

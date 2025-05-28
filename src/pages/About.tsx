
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, Award, Heart } from "lucide-react";

const About = () => {
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
            हमारे बारे में
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            हम हिंदी भाषा को डिजिटल युग में आगे बढ़ाने के लिए प्रतिबद्ध हैं
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">हमारा मिशन</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              हमारा लक्ष्य आधुनिक AI तकनीक का उपयोग करके हिंदी भाषा के व्याकरण को सुधारना और 
              भाषा की शुद्धता को बनाए रखना है। हम चाहते हैं कि हर व्यक्ति शुद्ध और स्पष्ट हिंदी लिख सके।
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              हमारा प्लेटफॉर्म व्याकरण की त्रुटियों को तुरंत पहचानता है और सुधार के सुझाव देता है, 
              जिससे आपका लेखन बेहतर और प्रभावशाली बनता है।
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">सटीकता</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">99% सटीक व्याकरण सुधार</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">समुदाय</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">हजारों खुश उपयोगकर्ता</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">गुणवत्ता</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">उच्च गुणवत्ता के परिणाम</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-2" />
                <CardTitle className="text-lg">सेवा</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">24/7 निःशुल्क सेवा</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">हमसे जुड़ें</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              हिंदी भाषा को बेहतर बनाने के हमारे मिशन में शामिल हों। आज ही रजिस्टर करें और 
              अपने लेखन को नई ऊंचाइयों पर ले जाएं।
            </p>
            <Link to="/register">
              <Button size="lg">
                अभी शुरू करें
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            व्याकरणी
          </div>
          <p className="text-gray-400 mb-4">AI की शक्ति से हिंदी भाषा को बेहतर बनाएं</p>
          <div className="space-x-6">
            <Link to="/" className="text-gray-400 hover:text-white">होम</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white">संपर्क</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white">प्राइवेसी पॉलिसी</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;

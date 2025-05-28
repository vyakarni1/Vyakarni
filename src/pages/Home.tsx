
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap, Shield, Users } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              हिंदी व्याकरण सुधारक
            </div>
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

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI के साथ हिंदी व्याकरण सुधारें
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          आधुनिक AI तकनीक का उपयोग करके अपने हिंदी टेक्स्ट को तुरंत सुधारें। व्याकरण की त्रुटियों को एक क्लिक में ठीक करें।
        </p>
        <Link to="/register">
          <Button size="lg" className="text-lg px-8 py-3">
            मुफ्त में शुरू करें
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">विशेषताएं</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>तत्काल सुधार</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">एक क्लिक में व्याकरण की त्रुटियों को तुरंत ठीक करें</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>AI संचालित</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">OpenAI की शक्तिशाली तकनीक से संचालित</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>हिंदी विशेषज्ञता</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">हिंदी व्याकरण में विशेष रूप से प्रशिक्षित</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">कैसे काम करता है</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">रजिस्टर करें</h3>
              <p className="text-gray-600">मुफ्त खाता बनाएं</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">टेक्स्ट लिखें</h3>
              <p className="text-gray-600">अपना हिंदी टेक्स्ट इनपुट करें</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">सुधार पाएं</h3>
              <p className="text-gray-600">तुरंत सुधारा गया टेक्स्ट प्राप्त करें</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            हिंदी व्याकरण सुधारक
          </div>
          <p className="text-gray-400 mb-4">AI की शक्ति से हिंदी भाषा को बेहतर बनाएं</p>
          <div className="space-x-6">
            <Link to="/about" className="text-gray-400 hover:text-white">हमारे बारे में</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white">संपर्क</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white">प्राइवेसी पॉलिसी</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

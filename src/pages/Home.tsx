
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap, Shield, Users, ArrowRight, Sparkles, Star } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Modern Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/30 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
                व्याकरणी
              </div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                  लॉगिन
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                  रजिस्टर करें
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center relative">
        {/* Background decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse delay-75"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-pink-200 rounded-full opacity-25 animate-pulse delay-150"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sparkles className="h-16 w-16 text-purple-500 animate-pulse" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in leading-tight">
            AI के साथ हिंदी व्याकरण
            <br />
            <span className="text-5xl">सुधारें</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-75">
            आधुनिक AI तकनीक का उपयोग करके अपने हिंदी टेक्स्ट को तुरंत सुधारें।
            <br />
            व्याकरण की त्रुटियों को <span className="font-semibold text-purple-600">एक क्लिक</span> में ठीक करें।
          </p>
          
          <div className="flex justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-600">मुफ्त उपयोग</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">तुरंत परिणाम</span>
            </div>
          </div>
          
          <Link to="/register">
            <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl group">
              मुफ्त में शुरू करें
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">विशेषताएं</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            हमारी AI-संचालित तकनीक के साथ अपनी हिंदी लेखन क्षमता को बेहतर बनाएं
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-blue-50 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <CardHeader className="relative">
              <div className="mb-4 p-3 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors duration-300">
                <Zap className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <CardTitle className="text-xl text-gray-800">तत्काल सुधार</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                एक क्लिक में व्याकरण की त्रुटियों को तुरंत ठीक करें। कोई प्रतीक्षा नहीं, तुरंत परिणाम।
              </p>
              <div className="mt-4 flex items-center text-sm text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>5 सेकेंड में परिणाम</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-purple-50 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <CardHeader className="relative">
              <div className="mb-4 p-3 bg-purple-100 rounded-full w-fit group-hover:bg-purple-200 transition-colors duration-300">
                <Shield className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <CardTitle className="text-xl text-gray-800">AI संचालित</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                OpenAI की शक्तिशाली तकनीक से संचालित। अत्याधुनिक AI मॉडल का उपयोग।
              </p>
              <div className="mt-4 flex items-center text-sm text-purple-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span>GPT-4 तकनीक</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-green-50 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <CardHeader className="relative">
              <div className="mb-4 p-3 bg-green-100 rounded-full w-fit group-hover:bg-green-200 transition-colors duration-300">
                <CheckCircle className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <CardTitle className="text-xl text-gray-800">हिंदी विशेषज्ञता</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                हिंदी व्याकरण में विशेष रूप से प्रशिक्षित। देवनागरी लिपि की पूर्ण समझ।
              </p>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>100% हिंदी फोकस</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced How it Works Section */}
      <section className="bg-gradient-to-r from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">कैसे काम करता है</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              सिर्फ तीन आसान चरणों में अपने हिंदी टेक्स्ट को सुधारें
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">रजिस्टर करें</h3>
              <p className="text-gray-600 leading-relaxed">
                मुफ्त खाता बनाएं और तुरंत शुरू करें। कोई शुल्क नहीं, कोई छुपी हुई लागत नहीं।
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce delay-75"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">टेक्स्ट लिखें</h3>
              <p className="text-gray-600 leading-relaxed">
                अपना हिंदी टेक्स्ट इनपुट करें या कॉपी-पेस्ट करें। किसी भी लंबाई का टेक्स्ट स्वीकार्य है।
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce delay-150"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">सुधार पाएं</h3>
              <p className="text-gray-600 leading-relaxed">
                तुरंत सुधारा गया टेक्स्ट प्राप्त करें। व्याकरण, वर्तनी और विराम चिह्न की त्रुटियां ठीक हो जाएंगी।
              </p>
            </div>
          </div>
          
          {/* CTA in How it Works */}
          <div className="text-center mt-12">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 transform hover:scale-105 transition-all duration-300 shadow-lg">
                अभी आज़माएं
                <Sparkles className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                व्याकरणी
              </div>
              <Sparkles className="h-6 w-6 text-purple-400 animate-pulse" />
            </div>
            
            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              AI की शक्ति से हिंदी भाषा को बेहतर बनाएं। आपकी लेखन यात्रा में हमेशा साथ।
            </p>
            
            <div className="flex justify-center space-x-8 mb-8">
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>हमारे बारे में</span>
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-1">
                <span>संपर्क</span>
              </Link>
              <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>प्राइवेसी पॉलिसी</span>
              </Link>
            </div>
            
            <div className="border-t border-gray-700 pt-8">
              <p className="text-gray-400 text-sm">
                © 2024 व्याकरणी। सभी अधिकार सुरक्षित।
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

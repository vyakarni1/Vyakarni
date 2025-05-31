import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, Award, Heart, BookOpen, Zap, Shield, Globe, TrendingUp, Clock, CheckCircle, Star } from "lucide-react";
import Layout from "@/components/Layout";
const About = () => {
  return <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              हमारे बारे में
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              हम आधुनिक AI तकनीक के साथ हिंदी भाषा को डिजिटल युग में आगे बढ़ाने के लिए प्रतिबद्ध हैं। 
              हमारा लक्ष्य हर व्यक्ति को शुद्ध और प्रभावशाली हिंदी लिखने में मदद करना है।
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-800">हमारी कहानी</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  व्याकरणी की शुरुआत एक साधारण विचार से हुई - हिंदी भाषा की शुद्धता को बनाए रखना और 
                  डिजिटल माध्यमों में इसका सही उपयोग सुनिश्चित करना। हमने देखा कि आधुनिक युग में हिंदी 
                  लेखन में कई त्रुटियां हो रही हैं।
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  हमारी टीम ने AI और मशीन लर्निंग का उपयोग करके एक ऐसा प्लेटफॉर्म बनाया जो न केवल 
                  व्याकरण की त्रुटियों को पकड़ता है बल्कि भाषा को और भी बेहतर बनाने के सुझाव भी देता है।
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="text-center transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">भाषा प्रेम</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">हिंदी भाषा के प्रति गहरा प्रेम और सम्मान</p>
                  </CardContent>
                </Card>
                <Card className="text-center transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <Zap className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">तकनीकी नवाचार</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">AI की शक्ति से भाषा को बेहतर बनाना</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">हमारा मिशन और दृष्टिकोण</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                हिंदी भाषा को डिजिटल युग में उसका उचित स्थान दिलाना
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <Target className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle className="text-2xl text-blue-800">हमारा मिशन</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      हिंदी व्याकरण की त्रुटियों को तुरंत पहचानना और सुधारना
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      भाषा की शुद्धता और स्पष्टता में सुधार करना
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      डिजिटल माध्यमों में हिंदी के उपयोग को प्रोत्साहित करना
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <Globe className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle className="text-2xl text-purple-800">हमारा दृष्टिकोण</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <Star className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                      हिंदी को विश्व की अग्रणी डिजिटल भाषाओं में शामिल करना
                    </li>
                    <li className="flex items-start">
                      <Star className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                      AI-संचालित भाषा उपकरणों में हिंदी को प्राथमिकता दिलाना
                    </li>
                    <li className="flex items-start">
                      <Star className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                      भावी पीढ़ियों के लिए शुद्ध हिंदी का संरक्षण करना
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">हमारे मूल्य</h2>
              <p className="text-xl text-gray-600">जो सिद्धांत हमारे काम को दिशा देते हैं</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Target className="h-12 w-12 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-lg">सटीकता</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">99.5% सटीक व्याकरण सुधार और विश्वसनीय परिणाम</p>
                </CardContent>
              </Card>

              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Users className="h-12 w-12 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-lg">समुदाय</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">हिंदी भाषी समुदाय के साथ मिलकर भाषा को बेहतर बनाना</p>
                </CardContent>
              </Card>

              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Shield className="h-12 w-12 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-lg">सुरक्षा</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">आपके डेटा की पूर्ण सुरक्षा और गोपनीयता का सम्मान</p>
                </CardContent>
              </Card>

              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Heart className="h-12 w-12 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-lg">सेवा भावना</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">भाषा सेवा के लिए प्रतिबद्धता और 24/7 सहायता</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">हमारी उपलब्धियां</h2>
              <p className="text-xl text-gray-600">आंकड़े जो हमारी सफलता को दर्शाते हैं</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
                <div className="text-gray-600">खुश उपयोगकर्ता</div>
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mt-2" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">1M+</div>
                <div className="text-gray-600">जांचे गए दस्तावेज़</div>
                <BookOpen className="h-8 w-8 text-green-600 mx-auto mt-2" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">99.5%</div>
                <div className="text-gray-600">सटीकता दर</div>
                <Award className="h-8 w-8 text-purple-600 mx-auto mt-2" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">24/7</div>
                <div className="text-gray-600">उपलब्ध सेवा</div>
                <Clock className="h-8 w-8 text-red-600 mx-auto mt-2" />
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">हमारी तकनीक</h2>
              <p className="text-xl text-gray-600">AI और मशीन लर्निंग की शक्ति</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Zap className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl">उन्नत AI मॉडल</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">हिंदी भाषा के लिए विशेष रूप से प्रशिक्षित AI मॉडल जो संदर्भ को समझकर सुधार सुझाते हैं।</p>
                </CardContent>
              </Card>

              <Card className="border-green-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Globe className="h-12 w-12 text-green-600 mb-4" />
                  <CardTitle className="text-xl">वास्तविक समय प्रसंस्करण</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">तुरंत व्याकरण जांच और सुधार के सुझाव, बिना किसी देरी के।</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Shield className="h-12 w-12 text-purple-600 mb-4" />
                  <CardTitle className="text-xl">डेटा सुरक्षा</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">आपके डेटा की संपूर्ण सुरक्षा के साथ एंड-टू-एंड एन्क्रिप्शन।</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">हमसे जुड़ें</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              हिंदी भाषा को बेहतर बनाने के हमारे मिशन में शामिल हों। आज ही रजिस्टर करें और 
              अपने लेखन को नई ऊंचाइयों पर ले जाएं।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  अभी शुरू करें
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-white text-blue hover:text-blue-600 px-8 py-3 text-lg font-semibold bg-slate-50">
                  संपर्क करें
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>;
};
export default About;
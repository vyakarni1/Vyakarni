import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, Award, Heart, BookOpen, Zap, Shield, Globe, TrendingUp, Clock, CheckCircle, Star, Mail } from "lucide-react";
import Layout from "@/components/Layout";
const About = () => {
  return <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              हमारे विषय में
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              हम आधुनिक AI तकनीक के साथ हिंदी भाषा को डिजिटल युग में आगे बढ़ाने के लिये प्रतिबद्ध हैं। हमारा लक्ष्य प्रत्येक व्यक्ति को शुद्ध और प्रभावशाली हिंदी लिखने में सहायता प्रदान करना है।
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
                  व्याकरणी की आवश्यकता लम्बे समय से अनुभव की जा रही थी। यूँ तो अनुवाद इत्यादि के तो अनेक प्लेटफॉर्म्स उपलब्ध हैं, किन्तु भाषा-शोधन का कोई समर्पित प्लेटफार्म उपलब्ध नही था। हिंदी भाषा के प्रति हमारा प्रेम हमें निरंतर ऐसे किसी प्लेटफार्म के निर्माण हेतु आंदोलित करता रहता था।
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  आज जब यह प्लेटफार्म साकार हो कर हमारे सम्मुख उपस्थित है तो यह हमें अत्यंत संतोष और गौरव का अनुभव देता है तथा इसे आपके साथ साझा करना हमारे इस अनुभव को बहुगुणित कर रहा है।
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
                    <CardTitle className="text-lg">AI की शक्ति से भाषा का संवर्धन</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">AI के प्रयोग से अभिव्यक्ति का संवर्धन</p>
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
              <h2 className="text-4xl font-bold mb-4 text-gray-800">हमारा ध्येय और दृष्टिकोण</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">हिंदी भाषा में लोगों की अभिव्यक्ति की क्षमता में वृद्धि करने वाला एक आधुनिक डिजिटल प्लेटफार्म निर्मित कर उसे लोगों के प्रयोग हेतु एक सशक्त विकल्प के रूप में प्रस्तुत करना।</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <Target className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle className="text-2xl text-blue-800">हमारा ध्येय</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      डिजिटल युग की आवश्यकताओं के अनुरूप भाषा का शोधन एवं संवर्धन करना।
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      लोगों को यह समझाना कि वे व्याकरणी के माध्यम से स्वयं को सहजता एवं सरलता के साथ हिंदी में अभिव्यक्त कर सकते हैं।
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      हिंदी लेखन के विभिन्न पारंपरिक घटकों जैसे कि कथा-लेखन, उपन्यास लेखन इत्यादि तथा आधुनिक घटकों जैसे कि ब्लॉग-लेखन, तथा ऑडियो स्टोरी लेखन हेतु स्तरीय हिंदी के प्रयोग को प्रोत्साहित करना।
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
                      व्यवसायिक क्षेत्र में हिंदी के बढ़ते उपयोग को संबल प्रदान कर इसके प्रयोग को बढ़ाना।
                    </li>
                    <li className="flex items-start">
                      <Star className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                      AI की शक्ति द्वारा हिंदी प्रयोग की त्रुटियों को दूर करते हुये इसके द्वारा प्राप्त परिणामों में उत्तरोत्तर सुधार करना।
                    </li>
                    <li className="flex items-start">
                      <Star className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                      जिन्हें हम जेन-जी और जेन-अल्फा कहते हैं, उनके लिये हिंदी भाषा में संवाद एवं अभिव्यक्ति का एक माध्यम निर्मित करना।
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
              <h2 className="text-4xl font-bold mb-4 text-gray-800">हमारे नीति-निर्देशक तत्व</h2>
              <p className="text-xl text-gray-600">हिंदी भाषा के प्रति हमारी प्रतिबद्धता को व्यक्त करने वाले कुछ कारक</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Target className="h-12 w-12 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-lg">सटीकता</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">99% सटीक व्याकरण सुधार और विश्वसनीय परिणाम</p>
                </CardContent>
              </Card>

              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Users className="h-12 w-12 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-lg">समुदाय</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">हिंदी भाषा प्रेमी समुदाय के साथ मिलकर भाषा के प्रयोग को प्रोत्साहित करना</p>
                </CardContent>
              </Card>

              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Shield className="h-12 w-12 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-lg">सुरक्षा</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">आपके डेटा की पूर्ण सुरक्षा और आपकी गोपनीयता का सम्मान</p>
                </CardContent>
              </Card>

              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Heart className="h-12 w-12 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-lg">सेवा भावना</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">अपने ग्राहकों के प्रति पूर्ण प्रतिबद्धता और 24/7 सहायता</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">हमारी उपलब्धियाँ</h2>
              <p className="text-xl text-gray-600">आँकड़े, जो हमारी उपलब्धियों को दर्शाते हैं</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-600">संतुष्ट प्रयोगकर्ता</div>
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mt-2" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">1,00,000</div>
                <div className="text-gray-600">पाठ जाँचे गये</div>
                <BookOpen className="h-8 w-8 text-green-600 mx-auto mt-2" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">99%</div>
                <div className="text-gray-600">सटीक सुधार</div>
                <Award className="h-8 w-8 text-purple-600 mx-auto mt-2" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">24/7</div>
                <div className="text-gray-600">सेवा उपलब्ध</div>
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
                  <p className="text-gray-600">हिंदी भाषा के लिये विशेष रूप से प्रशिक्षित AI मॉडल जो संदर्भ को समझकर सुधार सुझाते हैं।</p>
                </CardContent>
              </Card>

              <Card className="border-green-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Globe className="h-12 w-12 text-green-600 mb-4" />
                  <CardTitle className="text-xl">वास्तविक समय प्रसंस्करण</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">त्वरित व्याकरण परीक्षण एवं सुधार के अनुकरणीय सुझाव।</p>
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
            <div className="max-w-4xl mx-auto mb-8">
              <p className="text-xl mb-6 opacity-90 leading-relaxed">
                व्याकरणी हमारे लिये एक अभियान है। एक ऐसा अभियान, जिसके माध्यम से हम लोगों को हिंदी भाषा में दक्ष संवाद करने हेतु प्रोत्साहित करेंगे। 'सर्वजन हिताय' की मूल भावना के साथ प्रारंभ किया गया यह अभियान सर्वजन के सहयोग की अनुपस्थिति में पूर्ण न हो सकेगा।
              </p>
              <p className="text-lg opacity-90">
                व्याकरणी के इस महा-अभियान से किसी भी रूप में जुड़ने के लिये आप हमें हमारे ई-मेल support@vyakarni.com पर संपर्क कर सकते हैं।
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  तत्काल आरम्भ करें
                </Button>
              </Link>
              <a href="mailto:support@vyakarni.com">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold bg-transparent">
                  व्याकरणी अभियान में जुड़ें
                  <Mail className="h-5 w-5 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>;
};
export default About;
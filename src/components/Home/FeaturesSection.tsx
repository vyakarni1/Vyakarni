
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Shield, BookOpen, Globe } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">व्याकरणी की विशेषतायें</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">हमारी AI-संचालित तकनीक के साथ अपनी हिंदी लेखन क्षमता को श्रेष्ठतर बनायें।</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-blue-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <CardHeader className="relative">
            <div className="mb-4 p-3 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors duration-300">
              <Zap className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <CardTitle className="text-xl text-gray-800">तत्काल सुधार</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">एक क्लिक में व्याकरण की त्रुटियों को त्वरित रूप से दूर करें।</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-cyan-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-200 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <CardHeader className="relative">
            <div className="mb-4 p-3 bg-cyan-100 rounded-full w-fit group-hover:bg-cyan-200 transition-colors duration-300">
              <Shield className="h-8 w-8 text-cyan-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <CardTitle className="text-xl text-gray-800">AI संचालित</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">AI की शक्तिशाली तकनीक से संचालित। अत्याधुनिक AI मॉडल का उपयोग।</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-blue-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <CardHeader className="relative">
            <div className="mb-4 p-3 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors duration-300">
              <BookOpen className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <CardTitle className="text-xl text-gray-800">निपुण विशेषज्ञ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">हिंदी व्याकरण में विशेष रूप से प्रशिक्षित। देवनागरी लिपि में पूर्णतः पारंगत।</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-sky-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-sky-200 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <CardHeader className="relative">
            <div className="mb-4 p-3 bg-sky-100 rounded-full w-fit group-hover:bg-sky-200 transition-colors duration-300">
              <Globe className="h-8 w-8 text-sky-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <CardTitle className="text-xl text-gray-800">सभी डिवाइस पर उपलब्ध</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">
              मोबाइल, टैबलेट या कंप्यूटर - कहीं भी, कभी भी उपयोग करें।
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FeaturesSection;

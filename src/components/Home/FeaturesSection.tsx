
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Shield, BookOpen, Globe } from "lucide-react";

interface FeaturesSectionProps {
  content: {
    title: string;
    description: string;
    feature1: {
      title: string;
      description: string;
    };
    feature2: {
      title: string;
      description: string;
    };
    feature3: {
      title: string;
      description: string;
    };
    feature4: {
      title: string;
      description: string;
    };
  };
}

const FeaturesSection = ({ content }: FeaturesSectionProps) => {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{content.title}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{content.description}</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-blue-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <CardHeader className="relative">
            <div className="mb-4 p-3 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors duration-300">
              <Zap className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <CardTitle className="text-xl text-gray-800">{content.feature1.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">{content.feature1.description}</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-cyan-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-200 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <CardHeader className="relative">
            <div className="mb-4 p-3 bg-cyan-100 rounded-full w-fit group-hover:bg-cyan-200 transition-colors duration-300">
              <Shield className="h-8 w-8 text-cyan-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <CardTitle className="text-xl text-gray-800">{content.feature2.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">{content.feature2.description}</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-blue-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <CardHeader className="relative">
            <div className="mb-4 p-3 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors duration-300">
              <BookOpen className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <CardTitle className="text-xl text-gray-800">{content.feature3.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">{content.feature3.description}</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-sky-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-sky-200 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <CardHeader className="relative">
            <div className="mb-4 p-3 bg-sky-100 rounded-full w-fit group-hover:bg-sky-200 transition-colors duration-300">
              <Globe className="h-8 w-8 text-sky-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <CardTitle className="text-xl text-gray-800">{content.feature4.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">{content.feature4.description}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FeaturesSection;

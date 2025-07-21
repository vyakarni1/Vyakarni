
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, CheckCircle, Mail } from 'lucide-react';

interface CTABannerProps {
  content: {
    title: string;
    subtitle: string;
    description: string;
    startButton: string;
    joinButton: string;
    freeSignup: string;
    noCreditCard: string;
    instantStart: string;
    missionText: string;
  };
}

const CTABanner = ({ content }: CTABannerProps) => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-75"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-150"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-300"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-center">
            <Sparkles className="h-16 w-16 text-white animate-pulse" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {content.title}
            <br />
            <span className="text-yellow-300">{content.subtitle}</span>
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            {content.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl group">
                {content.startButton}
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            
            <a href="mailto:support@vyakarni.com">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600 font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl group">
                {content.joinButton}
                <Mail className="h-5 w-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
              </Button>
            </a>
          </div>
          
          <div className="flex justify-center items-center space-x-6 text-white/80 text-sm">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>{content.freeSignup}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>{content.noCreditCard}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>{content.instantStart}</span>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 max-w-3xl mx-auto">
            <p className="text-white/90 leading-relaxed">
              {content.missionText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;

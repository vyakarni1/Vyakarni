
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Heart, Facebook, Instagram, Linkedin, X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Footer = () => {
  const [language, setLanguage] = useState<"english" | "hindi">("hindi");

  // Custom Discord icon component
  const DiscordIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={className} viewBox="0 0 16 16">
      <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
    </svg>
  );

  // Social media links - easy to modify links later
  const socialLinks = [
    { icon: X, href: "https://x.com/vyakarni", label: "X", hoverColor: "hover:text-blue-400" },
    { icon: Facebook, href: "https://www.facebook.com/vyakarni", label: "Facebook", hoverColor: "hover:text-blue-600" },
    { icon: Instagram, href: "https://www.instagram.com/vyakarni", label: "Instagram", hoverColor: "hover:text-pink-400" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/vyakarni", label: "LinkedIn", hoverColor: "hover:text-blue-500" },
    { icon: DiscordIcon, href: "https://discord.gg/KdQW2UG5", label: "Discord", hoverColor: "hover:text-indigo-400" },
  ];

  const content = {
    english: {
      brand: "Vyakarni",
      description: "Best Hindi Grammar Checker, and Online Hindi writing Tool",
      quickLinks: "Quick Links",
      aboutUs: "About Us",
      contactUs: "Contact Us",
      grammarChecker: "Grammar Checker",
      guide: "Hindi Grammar Checker – Complete Guide",
      businessPolicies: "Business Policies",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      disclaimer: "Disclaimer",
      refundPolicy: "Refund Policy",
      pricingPolicy: "Pricing Policy",
      otherPolicies: "Other Policies",
      dataProtection: "Data Protection Policy",
      shippingPolicy: "Shipping Policy",
      other: "Other Policies",
      email: "Email: support@vyakarni.com",
      copyright: "© 2025 Vyakarni. All rights reserved. Powered by SNS Innovation Labs Pvt. Ltd.",
      madeInIndia: "Made in India with"
    },
    hindi: {
      brand: "व्याकरणी",
      description: "हिंदी भाषा के सुधार हेतु एक उन्नत व्याकरण परीक्षण टूल",
      quickLinks: "त्वरित लिंक",
      aboutUs: "हमारे विषय में",
      contactUs: "संपर्क करें",
      grammarChecker: "व्याकरण जाँच",
      guide: "हिंदी व्याकरण चेकर – संपूर्ण मार्गदर्शिका",
      businessPolicies: "व्यवसायिक नीतियाँ",
      privacyPolicy: "गोपनीयता नीति",
      termsOfService: "सेवा की शर्तें",
      disclaimer: "अस्वीकरण",
      refundPolicy: "वापसी नीति",
      pricingPolicy: "मूल्य निर्धारण नीति",
      otherPolicies: "अन्य नीतियाँ",
      dataProtection: "डेटा संरक्षण नीति",
      shippingPolicy: "शिपिंग नीति",
      other: "अन्य नीतियाँ",
      email: "ईमेल: support@vyakarni.com",
      copyright: "© 2025 व्याकरणी. सभी अधिकार सुरक्षित। Powered by SNS Innovation Labs Pvt. Ltd.",
      madeInIndia: "के साथ भारत में बनाया गया"
    }
  };

  const currentContent = content[language];

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-gray-700">
        <ToggleGroup
          type="single"
          value={language}
          onValueChange={(value) => value && setLanguage(value as "english" | "hindi")}
          className="gap-1"
        >
          <ToggleGroupItem
            value="hindi"
            className="text-xs px-2 py-1 data-[state=on]:bg-blue-600 data-[state=on]:text-white text-gray-300"
          >
            हिंदी
          </ToggleGroupItem>
          <ToggleGroupItem
            value="english"
            className="text-xs px-2 py-1 data-[state=on]:bg-blue-600 data-[state=on]:text-white text-gray-300"
          >
            English
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {currentContent.brand}
            </div>
            <p className="text-gray-400 text-sm">
              {currentContent.description}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                return (
                  <a 
                    key={index}
                    href={social.href} 
                    className={`text-gray-400 ${social.hoverColor} transition-all duration-200 hover:scale-110`} 
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentContent.quickLinks}</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-gray-400 hover:text-white transition-colors duration-200 relative group">
                {currentContent.aboutUs}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors duration-200 relative group">
                {currentContent.contactUs}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
               <Link to="/grammar-checker" className="block text-gray-400 hover:text-white transition-colors duration-200 relative group">
                {currentContent.grammarChecker}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to={language === "hindi" ? "/hi/hindi-grammar-checker-complete-guide" : "/hindi-grammar-checker-complete-guide"} className="block text-gray-400 hover:text-white transition-colors duration-200 relative group">
                {currentContent.guide}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Legal Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentContent.businessPolicies}</h3>
            <div className="space-y-2">
              <Link to="/privacy" className="block text-gray-400 hover:text-white transition-colors duration-200 relative group">
                {currentContent.privacyPolicy}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/terms" className="block text-gray-400 hover:text-white transition-colors duration-200 relative group">
                {currentContent.termsOfService}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/disclaimer" className="block text-gray-400 hover:text-white transition-colors duration-200 relative group">
                {currentContent.disclaimer}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/refund-policy" className="block text-gray-400 hover:text-white transition-colors duration-200 relative group">
                {currentContent.refundPolicy}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/pricing-policy" className="block text-gray-400 hover:text-white transition-colors duration-200 relative group">
                {currentContent.pricingPolicy}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Additional Policies & Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentContent.otherPolicies}</h3>
            <div className="space-y-2">
              <Link to="/data-protection" className="block text-gray-400 hover:text-white transition-colors duration-200 relative group">
                {currentContent.dataProtection}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/shipping-policy" className="block text-gray-400 hover:text-white transition-colors duration-200 relative group">
                {currentContent.shippingPolicy}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/other-policies" className="block text-gray-400 hover:text-white transition-colors duration-200 relative group">
                {currentContent.other}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            <div className="mt-4 text-gray-400 text-sm">
              <p>{currentContent.email}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">{currentContent.copyright}</p>
          <p className="text-gray-400 text-sm flex items-center">
            <Heart className="h-4 w-4 text-red-500 mr-1 animate-bounce-subtle" />
            {currentContent.madeInIndia}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

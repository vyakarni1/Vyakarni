
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Heart, Facebook, Instagram, Linkedin, X, MessageCircle } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Footer = () => {
  const [language, setLanguage] = useState<"english" | "hindi">("hindi");

  // Social media links - easy to modify links later
  const socialLinks = [
    { icon: X, href: "https://x.com/vyakarni", label: "X", hoverColor: "hover:text-blue-400" },
    { icon: Facebook, href: "https://www.facebook.com/vyakarni", label: "Facebook", hoverColor: "hover:text-blue-600" },
    { icon: Instagram, href: "https://www.instagram.com/vyakarni", label: "Instagram", hoverColor: "hover:text-pink-400" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/vyakarni", label: "LinkedIn", hoverColor: "hover:text-blue-500" },
    { icon: MessageCircle, href: "https://discord.com/channels/1401251646717038734/1401251648701075538", label: "Discord", hoverColor: "hover:text-indigo-400" },
    { icon: Mail, href: "support@vyakarni.com", label: "Email", hoverColor: "hover:text-green-400" },
  ];

  const content = {
    english: {
      brand: "Vyakarni",
      description: "An advanced grammar checking tool for Hindi language improvement",
      quickLinks: "Quick Links",
      aboutUs: "About Us",
      contactUs: "Contact Us",
      grammarChecker: "Grammar Checker",
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
                const IconComponent = social.icon;
                return (
                  <a 
                    key={index}
                    href={social.href} 
                    className={`text-gray-400 ${social.hoverColor} transition-all duration-200 hover:scale-110`} 
                    aria-label={social.label}
                  >
                    <IconComponent className="h-5 w-5" />
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

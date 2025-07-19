import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(language === "english" ? "Message sent successfully!" : "संदेश सफलतापूर्वक भेजा गया!");
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast.error(language === "english" ? "Failed to send message." : "संदेश भेजने में विफल।");
    }
  };

  const englishContent = {
    title: "Contact Us",
    description: "We'd love to hear from you! Reach out using the form below or through our contact details.",
    formName: "Name",
    formEmail: "Email",
    formSubject: "Subject",
    formMessage: "Message",
    formButton: "Send Message",
    contactInfo: "Contact Information",
    address: "123 Tech Park, New City, India",
    phone: "+91 9876543210",
    hours: "Mon - Fri: 9am - 6pm"
  };

  const hindiContent = {
    title: "संपर्क करें",
    description: "हम आपसे सुनना पसंद करेंगे! नीचे दिए गए फॉर्म या हमारे संपर्क विवरण के माध्यम से पहुंचें।",
    formName: "नाम",
    formEmail: "ईमेल",
    formSubject: "विषय",
    formMessage: "संदेश",
    formButton: "संदेश भेजें",
    contactInfo: "संपर्क जानकारी",
    address: "123 टेक पार्क, नया शहर, भारत",
    phone: "+91 9876543210",
    hours: "सोम - शुक्र: सुबह 9 बजे - शाम 6 बजे"
  };

  const currentContent = language === "english" ? englishContent : hindiContent;

  return (
    <Layout>
      <div className="container mx-auto py-12 px-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gray-50 py-4">
            <CardTitle className="text-2xl font-semibold">{currentContent.title}</CardTitle>
            <p className="text-gray-600">{currentContent.description}</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input 
                    type="text" 
                    name="name" 
                    placeholder={currentContent.formName} 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div>
                  <Input 
                    type="email" 
                    name="email" 
                    placeholder={currentContent.formEmail} 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div>
                  <Input 
                    type="text" 
                    name="subject" 
                    placeholder={currentContent.formSubject} 
                    value={formData.subject} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div>
                  <Textarea 
                    name="message" 
                    placeholder={currentContent.formMessage} 
                    rows={4} 
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3">{currentContent.formButton}</Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4">{currentContent.contactInfo}</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{currentContent.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span>{currentContent.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span>support@vyakarni.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span>{currentContent.hours}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Contact;

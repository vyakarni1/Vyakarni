
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import Layout from "@/components/Layout";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState<"english" | "hindi">("hindi");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const hindiContent = {
    pageTitle: "हमसे संपर्क करयें",
    pageDescription: "हमारी टीम आपकी सहायता के लिये तत्पर है। अपने प्रश्न या सुझाव निःसंकोच साझा करयें।",
    sendMessageTitle: "संदेश भेजें",
    loginRequired: "संदेश भेजने के लिये कृपया लॉगिन करयें",
    loginButton: "लॉगिन करयें",
    nameLabel: "पूरा नाम",
    namePlaceholder: "आपका नाम",
    nameRequired: "नाम आवश्यक है",
    emailLabel: "ईमेल पता",
    emailPlaceholder: "आपका ईमेल",
    emailRequired: "ईमेल आवश्यक है",
    emailValid: "वैध ईमेल दर्ज करयें",
    messageLabel: "संदेश",
    messagePlaceholder: "आपका संदेश यहाँ लिखें...",
    messageRequired: "संदेश आवश्यक है",
    sendButton: "संदेश भेजें",
    sending: "भेजा जा रहा है...",
    contactDetailsTitle: "संपर्क हेतु विवरण",
    workingHoursTitle: "कार्यसमय",
    mondayFriday: "सोमवार - शुक्रवार",
    weekend: "शनिवार एवं रविवार",
    holiday: "अवकाश",
    holidayNote: "राजपत्रित अवकाशों पर सेवा उपलब्ध नहीं होंगी।",
    successMessage: "आपका संदेश सफलतापूर्वक भेज दिया गया है! हम जल्द ही आपसे संपर्क करयेंगे।",
    errorMessage: "संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करयें।",
    genericError: "कुछ गलत हुआ है। कृपया पुनः प्रयास करयें।"
  };

  const englishContent = {
    pageTitle: "Contact Us",
    pageDescription: "Our team is ready to assist you. Feel free to share your questions or suggestions.",
    sendMessageTitle: "Send Message",
    loginRequired: "Please login to send a message",
    loginButton: "Login",
    nameLabel: "Full Name",
    namePlaceholder: "Your name",
    nameRequired: "Name is required",
    emailLabel: "Email Address",
    emailPlaceholder: "Your email",
    emailRequired: "Email is required",
    emailValid: "Enter a valid email",
    messageLabel: "Message",
    messagePlaceholder: "Write your message here...",
    messageRequired: "Message is required",
    sendButton: "Send Message",
    sending: "Sending...",
    contactDetailsTitle: "Contact Details",
    workingHoursTitle: "Working Hours",
    mondayFriday: "Monday - Friday",
    weekend: "Saturday & Sunday",
    holiday: "Closed",
    holidayNote: "Services will not be available on public holidays.",
    successMessage: "Your message has been sent successfully! We will contact you soon.",
    errorMessage: "Error sending message. Please try again.",
    genericError: "Something went wrong. Please try again."
  };

  const currentContent = language === "english" ? englishContent : hindiContent;

  const onSubmit = async (data: ContactFormData) => {
    if (!user) {
      toast.error(currentContent.loginRequired);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: data.name,
          email: data.email,
          message: data.message,
        });

      if (error) {
        console.error('Error submitting contact form:', error);
        toast.error(currentContent.errorMessage);
        return;
      }

      toast.success(currentContent.successMessage);
      reset();
    } catch (error) {
      console.error('Error in contact form submission:', error);
      toast.error(currentContent.genericError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
       {/* Language Toggle Dropdown */}
<div className="fixed top-20 right-4 z-40">
  {/* This button toggles the visibility of the language options */}
  <button
    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-gray-100 transition-colors"
    aria-label="Toggle Language Selector"
  >
    <span className="text-xl">🌐</span>
  </button>

  {/* The dropdown menu appears only when isLanguageOpen is true */}
  {isLanguageOpen && (
    <div className="absolute top-full right-0 mt-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200">
      <ToggleGroup
        type="single"
        value={language}
        onValueChange={(value) => {
          if (value) {
            setLanguage(value as "english" | "hindi");
            setIsLanguageOpen(false); // Close dropdown on selection
          }
        }}
        className="gap-1"
      >
        <ToggleGroupItem
          value="hindi"
          className="text-sm px-3 py-1 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
        >
          हिंदी
        </ToggleGroupItem>
        <ToggleGroupItem
          value="english"
          className="text-sm px-3 py-1 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
        >
          English
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )}
</div>

        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {currentContent.pageTitle}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {currentContent.pageDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <Send className="mr-2 h-6 w-6" />
                  {currentContent.sendMessageTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">{currentContent.loginRequired}</p>
                    <Button asChild>
                      <a href="/login">{currentContent.loginButton}</a>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <Label htmlFor="name">{currentContent.nameLabel}</Label>
                      <Input
                        id="name"
                        {...register("name", { required: currentContent.nameRequired })}
                        placeholder={currentContent.namePlaceholder}
                        className="mt-1"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">{currentContent.emailLabel}</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email", { 
                          required: currentContent.emailRequired,
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: currentContent.emailValid
                          }
                        })}
                        placeholder={currentContent.emailPlaceholder}
                        className="mt-1"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="message">{currentContent.messageLabel}</Label>
                      <Textarea
                        id="message"
                        {...register("message", { required: currentContent.messageRequired })}
                        placeholder={currentContent.messagePlaceholder}
                        rows={6}
                        className="mt-1"
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? currentContent.sending : currentContent.sendButton}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">{currentContent.contactDetailsTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {language === "english" ? "Email" : "ईमेल"}
                      </h3>
                      <p className="text-gray-600">support@vyakarni.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {language === "english" ? "Phone" : "फोन"}
                      </h3>
                      <p className="text-gray-600">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {language === "english" ? "Address" : "पता"}
                      </h3>
                      <p className="text-gray-600">
                        {language === "english" ? "Vyakarni, Sector 143, Noida" : "व्याकरणी, सेक्टर 143, नॉएडा"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">{currentContent.workingHoursTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{currentContent.mondayFriday}</span>
                      <span className="font-semibold">10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{currentContent.weekend}</span>
                      <span className="font-semibold">{currentContent.holiday}</span>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      {currentContent.holidayNote}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;

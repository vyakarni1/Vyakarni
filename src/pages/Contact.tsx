
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    if (!user) {
      toast.error("संदेश भेजने के लिये कृपया लॉगिन करयें");
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
        toast.error("संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करयें।");
        return;
      }

      toast.success("आपका संदेश सफलतापूर्वक भेज दिया गया है! हम जल्द ही आपसे संपर्क करयेंगे।");
      reset();
    } catch (error) {
      console.error('Error in contact form submission:', error);
      toast.error("कुछ गलत हुआ है। कृपया पुनः प्रयास करयें।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              हमसे संपर्क करयें
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              हमारी टीम आपकी सहायता के लिये तत्पर है। अपने प्रश्न या सुझाव निःसंकोच साझा करयें।
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <Send className="mr-2 h-6 w-6" />
                  संदेश भेजें
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">संदेश भेजने के लिये कृपया लॉगिन करयें</p>
                    <Button asChild>
                      <a href="/login">लॉगिन करयें</a>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <Label htmlFor="name">पूरा नाम</Label>
                      <Input
                        id="name"
                        {...register("name", { required: "नाम आवश्यक है" })}
                        placeholder="आपका नाम"
                        className="mt-1"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">ईमेल पता</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email", { 
                          required: "ईमेल आवश्यक है",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "वैध ईमेल दर्ज करयें"
                          }
                        })}
                        placeholder="आपका ईमेल"
                        className="mt-1"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="message">संदेश</Label>
                      <Textarea
                        id="message"
                        {...register("message", { required: "संदेश आवश्यक है" })}
                        placeholder="आपका संदेश यहाँ लिखें..."
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
                      {isSubmitting ? "भेजा जा रहा है..." : "संदेश भेजें"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">संपर्क हेतु विवरण</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">ईमेल</h3>
                      <p className="text-gray-600">support@vyakarni.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">फोन</h3>
                      <p className="text-gray-600">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">पता</h3>
                      <p className="text-gray-600">
                        व्याकरणी, सेक्टर 143, नॉएडा
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">कार्यसमय</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">सोमवार - शुक्रवार</span>
                      <span className="font-semibold">10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">शनिवार एवं रविवार</span>
                      <span className="font-semibold">अवकाश</span>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      राजपत्रित अवकाशों पर सेवा उपलब्ध नहीं होंगी।
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

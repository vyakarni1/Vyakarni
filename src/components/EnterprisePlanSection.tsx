
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown, ChevronUp, Building2, Users, Phone, Mail, Industry, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useEnterpriseInquiry } from '@/hooks/useEnterpriseInquiry';
import { EnterpriseFormData } from '@/types/enterprise';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const EnterprisePlanSection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { submitInquiry, loading } = useEnterpriseInquiry();

  const form = useForm<EnterpriseFormData>({
    defaultValues: {
      company_name: '',
      contact_person: '',
      email: '',
      phone: '',
      company_size: '1-50',
      industry: '',
      requirements: '',
      estimated_users: '',
      message: '',
    },
  });

  const handleContactClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsFormOpen(!isFormOpen);
  };

  const onSubmit = async (data: EnterpriseFormData) => {
    const success = await submitInquiry(data);
    if (success) {
      form.reset();
      setIsFormOpen(false);
    }
  };

  const enterpriseFeatures = [
    'असीमित शब्द प्रसंस्करण',
    'कस्टम API एकीकरण',
    'प्राथमिकता सहायता (24/7)',
    'टीम प्रबंधन डैशबोर्ड',
    'कस्टम ब्रांडिंग',
    'एडवांस रिपोर्टिंग',
    'समर्पित खाता प्रबंधक',
    'ऑन-प्रिमाइसेस डिप्लॉयमेंट',
    'कस्टम भाषा मॉडल',
    'एसएसओ (Single Sign-On)',
  ];

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">एंटरप्राइज़ समाधान</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          बड़े संगठनों के लिए कस्टमाइज़्ड समाधान
        </p>
      </div>

      <Card className="max-w-4xl mx-auto border-2 border-purple-200 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader className="text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 text-sm font-medium">
            बड़े व्यवसायों के लिए
          </div>
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white mb-4 mx-auto mt-8">
            <Building2 className="h-8 w-8" />
          </div>
          
          <CardTitle className="text-3xl font-bold text-gray-800">एंटरप्राइज़ प्लान</CardTitle>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-purple-600">कस्टम मूल्य</div>
            <Badge variant="outline" className="text-sm">
              आपकी आवश्यकताओं के अनुसार
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-3">
            {enterpriseFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Contact Button */}
          <div className="pt-4">
            <Button 
              onClick={handleContactClick}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 transition-all duration-300 text-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{user ? 'संपर्क करें' : 'साइनअप करें'}</span>
                {isFormOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </Button>
          </div>

          {/* Expandable Form */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isFormOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            {isFormOpen && (
              <div className="border-t pt-6 mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  एंटरप्राइज़ समाधान के लिए संपर्क करें
                </h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="company_name"
                        rules={{ required: 'कंपनी का नाम आवश्यक है' }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4" />
                              <span>कंपनी का नाम *</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="आपकी कंपनी का नाम" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contact_person"
                        rules={{ required: 'संपर्क व्यक्ति का नाम आवश्यक है' }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>संपर्क व्यक्ति *</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="आपका नाम" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        rules={{ 
                          required: 'ईमेल आवश्यक है',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'वैध ईमेल पता दर्ज करें'
                          }
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>ईमेल *</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@company.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>फोन नंबर</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="+91 9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="company_size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>कंपनी का आकार</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="कर्मचारियों की संख्या चुनें" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1-50">1-50 कर्मचारी</SelectItem>
                                <SelectItem value="51-200">51-200 कर्मचारी</SelectItem>
                                <SelectItem value="201-1000">201-1000 कर्मचारी</SelectItem>
                                <SelectItem value="1000+">1000+ कर्मचारी</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center space-x-2">
                              <Industry className="h-4 w-4" />
                              <span>उद्योग</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="जैसे: शिक्षा, स्वास्थ्य, आईटी" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="estimated_users"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>अनुमानित उपयोगकर्ता संख्या</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="कितने लोग इस सर्विस का उपयोग करेंगे?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>विशिष्ट आवश्यकताएं</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="आपकी कंपनी की विशिष्ट आवश्यकताओं के बारे में बताएं..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>अतिरिक्त संदेश</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="कोई अन्य जानकारी या प्रश्न..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3"
                    >
                      {loading ? 'भेजा जा रहा है...' : 'संपर्क अनुरोध भेजें'}
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnterprisePlanSection;

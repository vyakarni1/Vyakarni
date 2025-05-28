
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error("कृपया सभी फील्ड भरें");
      return;
    }

    setIsLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("आपका संदेश भेज दिया गया है! हम जल्दी ही आपसे संपर्क करेंगे।");
      setName("");
      setEmail("");
      setMessage("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              हिंदी व्याकरण सुधारक
            </Link>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="outline">लॉगिन</Button>
              </Link>
              <Link to="/register">
                <Button>रजिस्टर करें</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            संपर्क करें
          </h1>
          <p className="text-xl text-gray-600">
            हमसे जुड़ें और अपने सवाल पूछें
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">हमसे बात करें</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold">ईमेल</h3>
                  <p className="text-gray-600">support@hindigrammar.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold">फोन</h3>
                  <p className="text-gray-600">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-semibold">पता</h3>
                  <p className="text-gray-600">नई दिल्ली, भारत</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">कार्य समय</h3>
              <div className="space-y-2 text-gray-600">
                <p>सोमवार - शुक्रवार: 9:00 AM - 6:00 PM</p>
                <p>शनिवार: 10:00 AM - 4:00 PM</p>
                <p>रविवार: बंद</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>संदेश भेजें</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">नाम</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="आपका नाम"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="email">ईमेल</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="आपका ईमेल"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="message">संदेश</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="आपका संदेश..."
                    className="min-h-[120px]"
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "भेजा जा रहा है..." : "संदेश भेजें"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            हिंदी व्याकरण सुधारक
          </div>
          <p className="text-gray-400 mb-4">AI की शक्ति से हिंदी भाषा को बेहतर बनाएं</p>
          <div className="space-x-6">
            <Link to="/" className="text-gray-400 hover:text-white">होम</Link>
            <Link to="/about" className="text-gray-400 hover:text-white">हमारे बारे में</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white">प्राइवेसी पॉलिसी</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;

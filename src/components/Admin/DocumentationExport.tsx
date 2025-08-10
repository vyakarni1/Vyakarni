import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, BookOpen, Code2, Database, Settings, Users, Shield } from "lucide-react";

interface DocumentationFile {
  name: string;
  path: string;
  description: string;
  icon: any;
  size: string;
}

const documentationFiles: DocumentationFile[] = [
  {
    name: "मुख्य दस्तावेज",
    path: "/docs/README.md",
    description: "व्याकरणी का संपूर्ण अवलोकन और परिचय",
    icon: BookOpen,
    size: "15 KB"
  },
  {
    name: "उपयोगकर्ता गाइड",
    path: "/docs/user-guide.md", 
    description: "उपयोगकर्ताओं के लिए विस्तृत उपयोग निर्देश",
    icon: Users,
    size: "25 KB"
  },
  {
    name: "डेवलपर गाइड",
    path: "/docs/developer-guide.md",
    description: "विकासकर्ताओं के लिए सेटअप और योगदान गाइड",
    icon: Code2,
    size: "18 KB"
  },
  {
    name: "तकनीकी आर्किटेक्चर",
    path: "/docs/technical-architecture.md",
    description: "सिस्टम आर्किटेक्चर और घटकों का विवरण",
    icon: Settings,
    size: "22 KB"
  },
  {
    name: "API संदर्भ",
    path: "/docs/api-reference.md",
    description: "API एंडपॉइंट्स और उपयोग के उदाहरण",
    icon: Code2,
    size: "30 KB"
  },
  {
    name: "डेटाबेस स्कीमा",
    path: "/docs/database-schema.md",
    description: "डेटाबेस संरचना और संबंधों का विवरण",
    icon: Database,
    size: "20 KB"
  },
  {
    name: "एडमिन गाइड",
    path: "/docs/admin-guide.md",
    description: "एडमिन पैनल उपयोग और प्रबंधन निर्देश",
    icon: Shield,
    size: "12 KB"
  },
  {
    name: "डिप्लॉयमेंट गाइड",
    path: "/docs/deployment-guide.md",
    description: "प्रोडक्शन डिप्लॉयमेंट और रखरखाव गाइड",
    icon: Settings,
    size: "16 KB"
  }
];

export const DocumentationExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const downloadFile = async (file: DocumentationFile) => {
    try {
      setIsExporting(true);
      
      // Fetch the file content from the docs folder
      const response = await fetch(file.path);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${file.name}`);
      }
      
      const content = await response.text();
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = file.path.split('/').pop() || 'documentation.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "डाउनलोड सफल",
        description: `${file.name} सफलतापूर्वक डाउनलोड हो गया।`,
      });
    } catch (error) {
      toast({
        title: "डाउनलोड त्रुटि",
        description: `${file.name} डाउनलोड करने में त्रुटि हुई।`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const downloadAllDocumentation = async () => {
    try {
      setIsExporting(true);
      
      const zip = await import('jszip');
      const JSZip = zip.default;
      const zipFile = new JSZip();
      
      // Add all documentation files to the zip
      for (const file of documentationFiles) {
        try {
          const response = await fetch(file.path);
          if (response.ok) {
            const content = await response.text();
            zipFile.file(file.path.split('/').pop() || 'document.md', content);
          }
        } catch (error) {
          console.error(`Failed to fetch ${file.name}:`, error);
        }
      }
      
      // Generate zip and download
      const content = await zipFile.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `vyakarni-documentation-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "संपूर्ण दस्तावेज डाउनलोड सफल",
        description: "सभी दस्तावेज ZIP फाइल में डाउनलोड हो गए।",
      });
    } catch (error) {
      toast({
        title: "डाउनलोड त्रुटि",
        description: "दस्तावेज डाउनलोड करने में त्रुटि हुई।",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">दस्तावेज एक्सपोर्ट</h1>
          <p className="text-muted-foreground mt-1">व्याकरणी का संपूर्ण दस्तावेज डाउनलोड करें</p>
        </div>
        <Button 
          onClick={downloadAllDocumentation}
          disabled={isExporting}
          className="bg-primary hover:bg-primary/90"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? "डाउनलोड हो रहा है..." : "सभी दस्तावेज डाउनलोड करें"}
        </Button>
      </div>

      {/* Documentation Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentationFiles.map((file, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <file.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-medium truncate">
                    {file.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{file.size}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {file.description}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => downloadFile(file)}
                disabled={isExporting}
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                डाउनलोड करें
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            दस्तावेज के बारे में
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              यह दस्तावेज व्याकरणी प्लेटफॉर्म का संपूर्ण तकनीकी और उपयोगकर्ता दस्तावेज है।
            </p>
            <p>
              सभी फाइलें Markdown फॉर्मेट में हैं और किसी भी टेक्स्ट एडिटर या Markdown व्यूअर में खोली जा सकती हैं।
            </p>
            <p>
              दस्तावेज में शामिल है: उपयोगकर्ता गाइड, डेवलपर निर्देश, API संदर्भ, डेटाबेस स्कीमा, और डिप्लॉयमेंट गाइड।
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
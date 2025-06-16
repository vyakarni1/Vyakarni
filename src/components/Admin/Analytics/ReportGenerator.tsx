
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Download, 
  Calendar, 
  FileText, 
  Settings, 
  Send,
  Clock,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportConfig {
  name: string;
  description: string;
  type: 'user' | 'revenue' | 'activity' | 'comprehensive';
  format: 'pdf' | 'excel' | 'csv';
  schedule: 'manual' | 'daily' | 'weekly' | 'monthly';
  includeCharts: boolean;
  dateRange: {
    start: string;
    end: string;
  };
  metrics: string[];
  recipients: string[];
}

const ReportGenerator = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<ReportConfig>({
    name: '',
    description: '',
    type: 'comprehensive',
    format: 'pdf',
    schedule: 'manual',
    includeCharts: true,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    metrics: ['users', 'revenue', 'activity'],
    recipients: []
  });

  const [newRecipient, setNewRecipient] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const availableMetrics = [
    { id: 'users', label: 'उपयोगकर्ता मेट्रिक्स', description: 'कुल उपयोगकर्ता, नये पंजीकरण, सक्रियता' },
    { id: 'revenue', label: 'राजस्व विश्लेषण', description: 'कुल आय, ट्रेंड, प्रति उपयोगकर्ता औसत' },
    { id: 'activity', label: 'गतिविधि डेटा', description: 'सुधार, उपयोग पैटर्न, सत्र डेटा' },
    { id: 'subscriptions', label: 'सब्सक्रिप्शन', description: 'प्लान वितरण, चर्न रेट, अपग्रेड' },
    { id: 'performance', label: 'प्रदर्शन', description: 'सिस्टम मेट्रिक्स, रिस्पॉन्स टाइम' },
    { id: 'security', label: 'सुरक्षा', description: 'लॉगिन गतिविधि, सुरक्षा इवेंट्स' }
  ];

  const handleMetricToggle = (metricId: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      metrics: checked 
        ? [...prev.metrics, metricId]
        : prev.metrics.filter(m => m !== metricId)
    }));
  };

  const addRecipient = () => {
    if (newRecipient.trim() && !config.recipients.includes(newRecipient.trim())) {
      setConfig(prev => ({
        ...prev,
        recipients: [...prev.recipients, newRecipient.trim()]
      }));
      setNewRecipient('');
    }
  };

  const removeRecipient = (email: string) => {
    setConfig(prev => ({
      ...prev,
      recipients: prev.recipients.filter(r => r !== email)
    }));
  };

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportData = {
        ...config,
        generatedAt: new Date().toISOString(),
        fileSize: '2.4 MB'
      };

      // In a real implementation, this would call an API to generate the report
      console.log('Generating report with config:', reportData);

      if (config.schedule === 'manual') {
        // Trigger immediate download
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${config.name || 'report'}-${new Date().toISOString().split('T')[0]}.${config.format}`;
        a.click();
        URL.revokeObjectURL(url);
      }

      toast({
        title: "रिपोर्ट जेनरेट हुयी",
        description: config.schedule === 'manual' 
          ? "आपकी रिपोर्ट डाउनलोड हो गयी है।"
          : "रिपोर्ट शेड्यूल हो गयी है और नियमित रूप से भेजी जायेगी।",
      });
    } catch (error) {
      toast({
        title: "त्रुटि",
        description: "रिपोर्ट जेनरेट करने में समस्या हुयी।",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const previewReport = () => {
    toast({
      title: "रिपोर्ट प्रीव्यू",
      description: "प्रीव्यू फीचर शीघ्र ही उपलब्ध होगा।",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            रिपोर्ट जेनरेटर
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Config */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reportName">रिपोर्ट नाम</Label>
              <Input
                id="reportName"
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="मासिक व्यापार रिपोर्ट"
              />
            </div>
            <div>
              <Label htmlFor="reportType">रिपोर्ट प्रकार</Label>
              <Select value={config.type} onValueChange={(value: any) => setConfig(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">उपयोगकर्ता रिपोर्ट</SelectItem>
                  <SelectItem value="revenue">राजस्व रिपोर्ट</SelectItem>
                  <SelectItem value="activity">गतिविधि रिपोर्ट</SelectItem>
                  <SelectItem value="comprehensive">व्यापक रिपोर्ट</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">विवरण</Label>
            <Textarea
              id="description"
              value={config.description}
              onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
              placeholder="इस रिपोर्ट का उद्देश्य और मुख्य बिंदु..."
            />
          </div>

          {/* Format and Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>फॉर्मेट</Label>
              <Select value={config.format} onValueChange={(value: any) => setConfig(prev => ({ ...prev, format: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>शेड्यूल</Label>
              <Select value={config.schedule} onValueChange={(value: any) => setConfig(prev => ({ ...prev, schedule: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">मैन्युअल</SelectItem>
                  <SelectItem value="daily">दैनिक</SelectItem>
                  <SelectItem value="weekly">साप्ताहिक</SelectItem>
                  <SelectItem value="monthly">मासिक</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <Checkbox
                id="includeCharts"
                checked={config.includeCharts}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeCharts: !!checked }))}
              />
              <Label htmlFor="includeCharts">चार्ट शामिल करें</Label>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">प्रारंभ दिनांक</Label>
              <Input
                id="startDate"
                type="date"
                value={config.dateRange.start}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="endDate">समाप्ति दिनांक</Label>
              <Input
                id="endDate"
                type="date"
                value={config.dateRange.end}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
              />
            </div>
          </div>

          {/* Metrics Selection */}
          <div>
            <Label className="text-base font-semibold">शामिल करने वाले मेट्रिक्स</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {availableMetrics.map((metric) => (
                <div key={metric.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={metric.id}
                    checked={config.metrics.includes(metric.id)}
                    onCheckedChange={(checked) => handleMetricToggle(metric.id, !!checked)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={metric.id} className="font-medium">{metric.label}</Label>
                    <p className="text-sm text-gray-600">{metric.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recipients (for scheduled reports) */}
          {config.schedule !== 'manual' && (
            <div>
              <Label className="text-base font-semibold">ईमेल प्राप्तकर्ता</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  placeholder="admin@example.com"
                  onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                />
                <Button onClick={addRecipient} variant="outline">
                  जोड़ें
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {config.recipients.map((email) => (
                  <Badge key={email} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <button onClick={() => removeRecipient(email)} className="ml-1 hover:text-red-500">
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button onClick={previewReport} variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              प्रीव्यू
            </Button>
            <Button 
              onClick={generateReport} 
              disabled={isGenerating || !config.name.trim()}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <Clock className="h-4 w-4 animate-spin" />
              ) : config.schedule === 'manual' ? (
                <Download className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isGenerating ? 'जेनरेट हो रही है...' : 
               config.schedule === 'manual' ? 'डाउनलोड करें' : 'शेड्यूल करें'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;

import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSimplePDFProcessor } from '@/hooks/useSimplePDFProcessor';
import PDFUploader from '@/components/PDF/PDFUploader';
import PDFProcessor from '@/components/PDF/PDFProcessor';
import CorrectedPDFViewer from '@/components/PDF/CorrectedPDFViewer';
import { useEffect, useState } from 'react';

const PDFGrammarChecker = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  
  const {
    pdfFile,
    processingStatus,
    correctedPDF,
    uploadPDF,
    processPDF,
    reset,
    downloadCorrectedPDF
  } = useSimplePDFProcessor();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      // Fetch user profile
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      };
      fetchProfile();
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('सफलतापूर्वक लॉग आउट हो गए!');
      navigate('/');
    } catch (error) {
      toast.error('लॉग आउट में त्रुटि');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                वापस
              </Link>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PDF व्याकरण सुधारक (AI Vision)
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="outline">डैशबोर्ड</Button>
              </Link>
              <Link to="/grammar-checker">
                <Button variant="outline">टेक्स्ट सुधारक</Button>
              </Link>
              {user && (
                <>
                  <span className="text-gray-600">नमस्ते, {profile?.name || user.email}</span>
                  <Button variant="outline" onClick={async () => {
                    try {
                      await supabase.auth.signOut();
                      toast.success('सफलतापूर्वक लॉग आउट हो गए!');
                      navigate('/');
                    } catch (error) {
                      toast.error('लॉग आउट में त्रुटि');
                    }
                  }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    लॉग आउट
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            PDF व्याकरण सुधारक (AI Vision)
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            अपनी हिंदी PDF फ़ाइलों में व्याकरण, वर्तनी और विराम चिह्न की त्रुटियों को आसानी से सुधारें। 
            यह OpenAI Vision API का उपयोग करता है जो अधिक सटीक और विश्वसनीय परिणाम देता है।
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                1. PDF फ़ाइल अपलोड करें
              </h2>
              <PDFUploader
                onUpload={uploadPDF}
                uploadedFile={pdfFile ? { name: pdfFile.name, size: pdfFile.size } : null}
                onRemove={reset}
                disabled={processingStatus.status !== 'idle' && processingStatus.status !== 'completed'}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                2. प्रक्रिया शुरू करें
              </h2>
              <PDFProcessor
                status={processingStatus}
                onProcess={processPDF}
                onReset={reset}
                canProcess={!!pdfFile && processingStatus.status === 'idle'}
              />
            </div>
          </div>

          {/* Results Section */}
          {correctedPDF && processingStatus.status === 'completed' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                3. सुधारी गई PDF डाउनलोड करें
              </h2>
              <CorrectedPDFViewer
                correctedPDF={correctedPDF}
                onDownload={downloadCorrectedPDF}
                filename={pdfFile?.name || 'document.pdf'}
              />
            </div>
          )}

          {/* Enhanced Notice Section */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">🚀 नई सुविधा - AI Vision Technology!</h3>
            <p className="text-green-700 mb-3">
              यह enhanced version OpenAI के Vision API का उपयोग करता है जो:
            </p>
            <ul className="list-disc list-inside text-green-700 space-y-1">
              <li>PDF pages को images में convert करता है</li>
              <li>Advanced OCR के लिए GPT-4 Vision का उपयोग करता है</li>
              <li>Scanned PDFs और image-based documents को बेहतर handle करता है</li>
              <li>Complex layouts और formatting को समझता है</li>
              <li>हिंदी text recognition में बेहतर accuracy प्रदान करता है</li>
            </ul>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">सुविधाएं:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-800">AI Vision Processing</h4>
                  <p className="text-sm text-gray-600">OpenAI Vision API से powered advanced text extraction</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Smart OCR</h4>
                  <p className="text-sm text-gray-600">Scanned PDFs और images से accurate text extraction</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Advanced Grammar Correction</h4>
                  <p className="text-sm text-gray-600">AI-powered हिंदी व्याकरण और वर्तनी सुधार</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Multi-page Support</h4>
                  <p className="text-sm text-gray-600">Multiple pages को process करने की क्षमता</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFGrammarChecker;


import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import Layout from '@/components/Layout';
import { toast } from 'sonner';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  handled_by?: string;
  admin_notes?: string;
}

const ContactSubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        toast.error('संदेश लोड करने में त्रुटि');
        return;
      }

      setSubmissions(data || []);
    } catch (error) {
      console.error('Error in fetchSubmissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: string, status: 'read' | 'replied') => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({
          status,
          handled_by: user?.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating submission:', error);
        toast.error('स्थिति अपडेट करने में त्रुटि');
        return;
      }

      setSubmissions(prev =>
        prev.map(sub =>
          sub.id === id
            ? { ...sub, status, handled_by: user?.id, updated_at: new Date().toISOString() }
            : sub
        )
      );

      toast.success('स्थिति सफलतापूर्वक अपडेट की गई');
    } catch (error) {
      console.error('Error in updateSubmissionStatus:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread':
        return <Clock className="h-4 w-4" />;
      case 'read':
        return <Eye className="h-4 w-4" />;
      case 'replied':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-yellow-100 text-yellow-800';
      case 'read':
        return 'bg-blue-100 text-blue-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'unread':
        return 'अपठित';
      case 'read':
        return 'पठित';
      case 'replied':
        return 'उत्तर दिया';
      default:
        return 'अज्ञात';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">संपर्क संदेश</h1>
            <p className="text-gray-600 mt-2">उपयोगकर्ताओं से प्राप्त संदेशों का प्रबंधन</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>सभी संदेश ({submissions.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>नाम</TableHead>
                    <TableHead>ईमेल</TableHead>
                    <TableHead>संदेश</TableHead>
                    <TableHead>स्थिति</TableHead>
                    <TableHead>दिनांक</TableHead>
                    <TableHead>कार्य</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell className="max-w-xs truncate">{submission.message}</TableCell>
                      <TableCell>
                        <Badge className={`flex items-center space-x-1 ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          <span>{getStatusText(submission.status)}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(submission.created_at).toLocaleDateString('hi-IN')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            देखें
                          </Button>
                          {submission.status === 'unread' && (
                            <Button
                              size="sm"
                              onClick={() => updateSubmissionStatus(submission.id, 'read')}
                            >
                              पढ़ा गया
                            </Button>
                          )}
                          {submission.status !== 'replied' && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => updateSubmissionStatus(submission.id, 'replied')}
                            >
                              उत्तर दिया
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {submissions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  कोई संदेश नहीं मिला
                </div>
              )}
            </CardContent>
          </Card>

          {selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>संदेश विवरण</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <strong>नाम:</strong> {selectedSubmission.name}
                  </div>
                  <div>
                    <strong>ईमेल:</strong> {selectedSubmission.email}
                  </div>
                  <div>
                    <strong>दिनांक:</strong> {new Date(selectedSubmission.created_at).toLocaleString('hi-IN')}
                  </div>
                  <div>
                    <strong>स्थिति:</strong>
                    <Badge className={`ml-2 ${getStatusColor(selectedSubmission.status)}`}>
                      {getStatusText(selectedSubmission.status)}
                    </Badge>
                  </div>
                  <div>
                    <strong>संदेश:</strong>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      {selectedSubmission.message}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSubmission(null)}
                    >
                      बंद करें
                    </Button>
                    {selectedSubmission.status === 'unread' && (
                      <Button
                        onClick={() => {
                          updateSubmissionStatus(selectedSubmission.id, 'read');
                          setSelectedSubmission(null);
                        }}
                      >
                        पढ़ा गया
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ContactSubmissions;

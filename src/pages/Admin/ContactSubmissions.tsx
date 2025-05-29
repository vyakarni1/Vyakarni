
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import Layout from '@/components/Layout';
import { useContactSubmissions } from '@/hooks/useContactSubmissions';
import SubmissionsTable from '@/components/Admin/ContactSubmissions/SubmissionsTable';
import SubmissionDetailModal from '@/components/Admin/ContactSubmissions/SubmissionDetailModal';
import { ContactSubmission } from '@/types/contact';

const ContactSubmissions = () => {
  const { submissions, loading, updateSubmissionStatus } = useContactSubmissions();
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

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
              <SubmissionsTable
                submissions={submissions}
                onViewSubmission={setSelectedSubmission}
                onUpdateStatus={updateSubmissionStatus}
              />

              {submissions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  कोई संदेश नहीं मिला
                </div>
              )}
            </CardContent>
          </Card>

          {selectedSubmission && (
            <SubmissionDetailModal
              submission={selectedSubmission}
              onClose={() => setSelectedSubmission(null)}
              onMarkAsRead={updateSubmissionStatus}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ContactSubmissions;

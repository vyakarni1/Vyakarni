
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStatusColor, getStatusText } from '@/utils/contactStatus';
import { ContactSubmission } from '@/types/contact';

interface SubmissionDetailModalProps {
  submission: ContactSubmission;
  onClose: () => void;
  onMarkAsRead: (id: string, status: 'read' | 'replied') => void;
}

const SubmissionDetailModal = ({ submission, onClose, onMarkAsRead }: SubmissionDetailModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>संदेश विवरण</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>नाम:</strong> {submission.name}
          </div>
          <div>
            <strong>ईमेल:</strong> {submission.email}
          </div>
          <div>
            <strong>दिनांक:</strong> {new Date(submission.created_at).toLocaleString('hi-IN')}
          </div>
          <div>
            <strong>स्थिति:</strong>
            <Badge className={`ml-2 ${getStatusColor(submission.status)}`}>
              {getStatusText(submission.status)}
            </Badge>
          </div>
          <div>
            <strong>संदेश:</strong>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              {submission.message}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              बंद करें
            </Button>
            {submission.status === 'unread' && (
              <Button
                onClick={() => {
                  onMarkAsRead(submission.id, 'read');
                  onClose();
                }}
              >
                पढ़ा गया
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionDetailModal;

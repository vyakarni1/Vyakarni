
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getStatusIcon, getStatusColor, getStatusText } from '@/utils/contactStatus';
import { ContactSubmission } from '@/types/contact';

interface SubmissionsTableProps {
  submissions: ContactSubmission[];
  onViewSubmission: (submission: ContactSubmission) => void;
  onUpdateStatus: (id: string, status: 'read' | 'replied') => void;
}

const SubmissionsTable = ({ submissions, onViewSubmission, onUpdateStatus }: SubmissionsTableProps) => {
  return (
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
        {submissions.map((submission) => {
          const StatusIcon = getStatusIcon(submission.status);
          return (
            <TableRow key={submission.id}>
              <TableCell className="font-medium">{submission.name}</TableCell>
              <TableCell>{submission.email}</TableCell>
              <TableCell className="max-w-xs truncate">{submission.message}</TableCell>
              <TableCell>
                <Badge className={`flex items-center space-x-1 ${getStatusColor(submission.status)}`}>
                  <StatusIcon className="h-4 w-4" />
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
                    onClick={() => onViewSubmission(submission)}
                  >
                    देखें
                  </Button>
                  {submission.status === 'unread' && (
                    <Button
                      size="sm"
                      onClick={() => onUpdateStatus(submission.id, 'read')}
                    >
                      पढ़ा गया
                    </Button>
                  )}
                  {submission.status !== 'replied' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onUpdateStatus(submission.id, 'replied')}
                    >
                      उत्तर दिया
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default SubmissionsTable;

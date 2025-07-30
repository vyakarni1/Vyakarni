import { useState, useEffect } from "react";
import AdminLayoutWithNavigation from "@/components/AdminLayoutWithNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Eye, CheckCircle, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useContactSubmissions } from "@/hooks/useContactSubmissions";
import { getStatusIcon, getStatusColor, getStatusText } from "@/utils/contactStatus";
import { toast } from "sonner";

const AdminContacts = () => {
  const { submissions, loading, updateSubmissionStatus, refetch } = useContactSubmissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || submission.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (id: string, status: 'read' | 'replied') => {
    await updateSubmissionStatus(id, status);
    if (selectedSubmission?.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status });
    }
  };

  const handleAddNotes = async () => {
    if (!selectedSubmission || !adminNotes.trim()) return;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ admin_notes: adminNotes })
        .eq('id', selectedSubmission.id);

      if (error) throw error;

      setSelectedSubmission({ ...selectedSubmission, admin_notes: adminNotes });
      toast.success('नोट्स जोड़े गए');
      refetch();
    } catch (error) {
      toast.error('नोट्स जोड़ने में त्रुटि');
    }
  };

  const statusCounts = {
    all: submissions.length,
    unread: submissions.filter(s => s.status === 'unread').length,
    read: submissions.filter(s => s.status === 'read').length,
    replied: submissions.filter(s => s.status === 'replied').length,
  };

  if (loading) {
    return (
      <AdminLayoutWithNavigation>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">संपर्क संदेश लोड हो रहे हैं...</p>
          </div>
        </div>
      </AdminLayoutWithNavigation>
    );
  }

  return (
    <AdminLayoutWithNavigation>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">संपर्क संदेश</h1>
          <p className="text-muted-foreground mt-2">उपयोगकर्ताओं से आए संपर्क संदेशों का प्रबंधन</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{statusCounts.all}</div>
              <p className="text-sm text-muted-foreground">कुल संदेश</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.unread}</div>
              <p className="text-sm text-muted-foreground">अपठित</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.read}</div>
              <p className="text-sm text-muted-foreground">पठित</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{statusCounts.replied}</div>
              <p className="text-sm text-muted-foreground">उत्तर दिया</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="नाम, ईमेल या संदेश खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-input rounded-md px-3 py-2 text-sm bg-background"
                >
                  <option value="all">सभी स्थितियां</option>
                  <option value="unread">अपठित</option>
                  <option value="read">पठित</option>
                  <option value="replied">उत्तर दिया</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">संदेश सूची</h2>
            {filteredSubmissions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">कोई संदेश नहीं मिला</p>
                </CardContent>
              </Card>
            ) : (
              filteredSubmissions.map((submission) => {
                const StatusIcon = getStatusIcon(submission.status);
                return (
                  <Card 
                    key={submission.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedSubmission?.id === submission.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="h-4 w-4" />
                          <span className="font-medium text-foreground">{submission.name}</span>
                        </div>
                        <Badge className={getStatusColor(submission.status)}>
                          {getStatusText(submission.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{submission.email}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground line-clamp-2 mb-2">
                        {submission.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(submission.created_at).toLocaleString('hi-IN')}
                      </p>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Message Detail */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">संदेश विवरण</h2>
            {selectedSubmission ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-foreground">{selectedSubmission.name}</CardTitle>
                      <p className="text-muted-foreground">{selectedSubmission.email}</p>
                    </div>
                    <Badge className={getStatusColor(selectedSubmission.status)}>
                      {getStatusText(selectedSubmission.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">संदेश:</h4>
                    <p className="text-sm text-foreground bg-muted p-3 rounded-md">
                      {selectedSubmission.message}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      प्राप्त: {new Date(selectedSubmission.created_at).toLocaleString('hi-IN')}
                    </p>
                    {selectedSubmission.updated_at && (
                      <p className="text-xs text-muted-foreground">
                        अपडेट: {new Date(selectedSubmission.updated_at).toLocaleString('hi-IN')}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {selectedSubmission.status === 'unread' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(selectedSubmission.id, 'read')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        पठित के रूप में चिह्नित करें
                      </Button>
                    )}
                    {selectedSubmission.status !== 'replied' && (
                      <Button 
                        size="sm"
                        onClick={() => handleStatusUpdate(selectedSubmission.id, 'replied')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        उत्तर दिया के रूप में चिह्नित करें
                      </Button>
                    )}
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <h4 className="font-medium text-foreground mb-2">एडमिन नोट्स:</h4>
                    {selectedSubmission.admin_notes && (
                      <p className="text-sm text-foreground bg-blue-50 p-3 rounded-md mb-2">
                        {selectedSubmission.admin_notes}
                      </p>
                    )}
                    <div className="space-y-2">
                      <Textarea
                        placeholder="नोट्स जोड़ें..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows={3}
                      />
                      <Button size="sm" onClick={handleAddNotes} disabled={!adminNotes.trim()}>
                        नोट्स जोड़ें
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">विवरण देखने के लिए कोई संदेश चुनें</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayoutWithNavigation>
  );
};

export default AdminContacts;

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTextHistory } from '@/hooks/useTextHistory';
import { Clock, FileText, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const TextHistoryCard = () => {
  const { textHistory, getTextHistory, deleteTextCorrection, loading } = useTextHistory();
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    getTextHistory(10, 0);
  }, [getTextHistory]);

  const handleDelete = async (id: string) => {
    const success = await deleteTextCorrection(id);
    if (success) {
      toast.success('इतिहास सूची सफलतापूर्वक हटाया गया');
      getTextHistory(10, 0); // Refresh the list
    } else {
      toast.error('इतिहास सूची हटाने में त्रुटि');
    }
  };

  const getTypeLabel = (type: string) => {
    return type === 'grammar' ? 'व्याकरण' : 'शैली';
  };

  const getTypeBadgeVariant = (type: string) => {
    return type === 'grammar' ? 'default' : 'secondary';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>सुधार इतिहास</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>सुधार इतिहास</span>
          <Badge variant="outline">{textHistory.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {textHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>अभी तक कोई सुधार इतिहास नहीं है</p>
            <p className="text-sm">व्याकरण या शैली सुधार करें और यहाँ देखें</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {textHistory.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={getTypeBadgeVariant(item.processing_type)}>
                        {getTypeLabel(item.processing_type)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {item.words_used} शब्द
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              सुधार विवरण - {getTypeLabel(selectedItem?.processing_type || '')}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">मूल पाठ:</h4>
                              <div className="bg-gray-100 p-3 rounded-lg">
                                {selectedItem?.original_text}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">सुधारा गया पाठ:</h4>
                              <div className="bg-green-50 p-3 rounded-lg">
                                {selectedItem?.corrected_text}
                              </div>
                            </div>
                            {selectedItem?.corrections_data && selectedItem.corrections_data.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2">सुधार विवरण:</h4>
                                <div className="space-y-2">
                                  {selectedItem.corrections_data.map((correction: any, index: number) => (
                                    <div key={index} className="bg-blue-50 p-2 rounded">
                                      <div className="text-sm">
                                        <span className="font-medium text-red-600">
                                          {correction.incorrect}
                                        </span>
                                        {' → '}
                                        <span className="font-medium text-green-600">
                                          {correction.correct}
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-600 mt-1">
                                        {correction.reason}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                    {item.original_text}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}
                    </span>
                    {item.corrections_data && item.corrections_data.length > 0 && (
                      <span>{item.corrections_data.length} सुधार</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        {textHistory.length > 0 && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => getTextHistory(textHistory.length + 10, 0)}
              disabled={loading}
            >
              और दिखायें
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextHistoryCard;

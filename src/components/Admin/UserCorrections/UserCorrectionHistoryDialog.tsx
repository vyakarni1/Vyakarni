import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Palette,
  Clock,
  Hash,
  X,
  Download,
  Search,
  Filter
} from 'lucide-react';
import { useAdminTextHistory } from '@/hooks/admin/useAdminTextHistory';
import CorrectionCard from './CorrectionCard';
import CorrectionFilters from './CorrectionFilters';
import CorrectionStats from './CorrectionStats';

interface UserCorrectionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  userEmail: string;
}

const UserCorrectionHistoryDialog: React.FC<UserCorrectionHistoryDialogProps> = ({
  open,
  onOpenChange,
  userId,
  userName,
  userEmail,
}) => {
  const { loading, corrections, totalCount, getTextCorrections, getCorrectionStats } = useAdminTextHistory();
  const [stats, setStats] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    processing_type: 'all' as 'all' | 'grammar' | 'style',
    date_range: 'all' as 'all' | 'today' | 'week' | 'month',
    min_words: 0,
    max_words: 1000000
  });

  const pageSize = 10;

  useEffect(() => {
    if (open && userId) {
      loadData();
      loadStats();
    }
  }, [open, userId, filters, currentPage]);

  const loadData = async () => {
    await getTextCorrections(userId, filters, pageSize, currentPage * pageSize);
  };

  const loadStats = async () => {
    const userStats = await getCorrectionStats(userId);
    setStats(userStats);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader className="space-y-3 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>उपयोगकर्ता सुधार इतिहास</span>
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-1" />
                फिल्टर
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                निर्यात
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <span className="font-medium">उपयोगकर्ता:</span>
              <Badge variant="secondary">{userName || 'अनाम'}</Badge>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-medium">ईमेल:</span>
              <span>{userEmail}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-medium">कुल सुधार:</span>
              <Badge variant="outline">{totalCount}</Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex gap-6 min-h-0">
          {/* Left Panel - Stats */}
          <div className="w-80 flex-shrink-0">
            <CorrectionStats stats={stats} loading={loading} />
          </div>

          {/* Right Panel - Corrections List */}
          <div className="flex-1 flex flex-col min-w-0">
            {showFilters && (
              <div className="mb-4">
                <CorrectionFilters 
                  filters={filters} 
                  onFiltersChange={handleFilterChange}
                />
              </div>
            )}

            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="space-y-4 pr-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : corrections.length > 0 ? (
                    corrections.map((correction, index) => (
                      <CorrectionCard 
                        key={correction.id} 
                        correction={correction} 
                        index={index}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">कोई सुधार नहीं मिला</h3>
                      <p className="text-muted-foreground">इस उपयोगकर्ता के लिए कोई टेक्स्ट सुधार इतिहास उपलब्ध नहीं है।</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  पृष्ठ {currentPage + 1} का {totalPages} (कुल {totalCount} सुधार)
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                  >
                    पिछला
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage >= totalPages - 1}
                  >
                    अगला
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserCorrectionHistoryDialog;
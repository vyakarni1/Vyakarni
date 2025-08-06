import { useState, useEffect } from "react";
import AdminLayoutWithNavigation from "@/components/AdminLayoutWithNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Download,
  Calendar,
  Filter,
  TrendingUp,
  User,
  FileText,
  Clock
} from "lucide-react";
import { useAdminTextHistory } from "@/hooks/admin/useAdminTextHistory";
import CorrectionCard from "@/components/Admin/UserCorrections/CorrectionCard";
import CorrectionFilters from "@/components/Admin/UserCorrections/CorrectionFilters";
import CorrectionStats from "@/components/Admin/UserCorrections/CorrectionStats";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { supabase } from "@/integrations/supabase/client";

interface CorrectionFilter {
  search: string;
  processingType: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  sortBy: string;
  userEmail: string;
}

const AdminUserCorrections = () => {
  const { loading, corrections, totalCount, getTextCorrections, getCorrectionStats } = useAdminTextHistory();
  const [stats, setStats] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<CorrectionFilter>({
    search: '',
    processingType: 'all',
    dateRange: { from: undefined, to: undefined },
    sortBy: 'newest',
    userEmail: ''
  });

  // Load corrections and stats
  useEffect(() => {
    loadCorrections();
    loadStats();
  }, [filters, currentPage]);

  const loadCorrections = async () => {
    const params = {
      search: filters.search,
      processingType: filters.processingType !== 'all' ? filters.processingType : undefined,
      startDate: filters.dateRange.from?.toISOString(),
      endDate: filters.dateRange.to?.toISOString(),
      sortBy: filters.sortBy,
      userEmail: filters.userEmail,
      page: currentPage,
      limit: 20
    };
    
    await getTextCorrections(params);
  };

  const loadStats = async () => {
    const statsData = await getCorrectionStats({
      startDate: filters.dateRange.from?.toISOString(),
      endDate: filters.dateRange.to?.toISOString(),
      processingType: filters.processingType !== 'all' ? filters.processingType : undefined
    });
    setStats(statsData);
  };

  const handleExport = async () => {
    try {
      // Export logic could be added here
      console.log('Exporting corrections data...');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleFilterChange = (newFilters: Partial<CorrectionFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(0);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      processingType: 'all',
      dateRange: { from: undefined, to: undefined },
      sortBy: 'newest',
      userEmail: ''
    });
    setCurrentPage(0);
  };

  return (
    <AdminLayoutWithNavigation>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">उपयोगकर्ता सुधार इतिहास</h1>
            <p className="text-muted-foreground mt-1">सभी उपयोगकर्ताओं के व्याकरण सुधार का विस्तृत विवरण</p>
          </div>
          <Button onClick={handleExport} className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            डेटा निर्यात करें
          </Button>
        </div>

        {/* Stats Overview */}
        {stats && <CorrectionStats stats={stats} loading={loading} />}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              फ़िल्टर और खोज
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">खोजें</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="टेक्स्ट या उपयोगकर्ता खोजें..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange({ search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* User Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium">उपयोगकर्ता ईमेल</label>
                <Input
                  placeholder="user@example.com"
                  value={filters.userEmail}
                  onChange={(e) => handleFilterChange({ userEmail: e.target.value })}
                />
              </div>

              {/* Processing Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">प्रसंस्करण प्रकार</label>
                <Select 
                  value={filters.processingType} 
                  onValueChange={(value) => handleFilterChange({ processingType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">सभी</SelectItem>
                    <SelectItem value="grammar">व्याकरण सुधार</SelectItem>
                    <SelectItem value="style">शैली संवर्धन</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium">क्रमबद्ध करें</label>
                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value) => handleFilterChange({ sortBy: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">नवीनतम पहले</SelectItem>
                    <SelectItem value="oldest">पुराने पहले</SelectItem>
                    <SelectItem value="most_words">अधिक शब्द पहले</SelectItem>
                    <SelectItem value="most_corrections">अधिक सुधार पहले</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Range */}
            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium">दिनांक सीमा</label>
              <div className="flex items-center gap-4">
                <DatePickerWithRange
                  date={filters.dateRange}
                  onDateChange={(range) => handleFilterChange({ 
                    dateRange: { from: range?.from, to: range?.to } 
                  })}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetFilters}
                  className="whitespace-nowrap"
                >
                  फ़िल्टर रीसेट करें
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                सुधार रिकॉर्ड ({totalCount})
              </CardTitle>
              {loading && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1 animate-spin" />
                  लोड हो रहा है...
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {corrections && corrections.length > 0 ? (
              <div className="space-y-4">
                {corrections.map((correction, index) => (
                  <CorrectionCard
                    key={correction.id}
                    correction={correction}
                    index={index}
                  />
                ))}

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    {currentPage * 20 + 1} - {Math.min((currentPage + 1) * 20, totalCount)} of {totalCount} रिकॉर्ड
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                    >
                      पिछला
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={(currentPage + 1) * 20 >= totalCount}
                    >
                      अगला
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">कोई सुधार नहीं मिला</h3>
                <p className="text-muted-foreground">
                  {filters.search || filters.userEmail || filters.processingType !== 'all' 
                    ? "आपके फ़िल्टर के अनुसार कोई रिकॉर्ड नहीं मिला। कृपया फ़िल्टर बदलें।"
                    : "अभी तक कोई सुधार रिकॉर्ड नहीं है।"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayoutWithNavigation>
  );
};

export default AdminUserCorrections;
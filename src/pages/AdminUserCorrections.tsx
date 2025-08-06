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
  const [loadedCount, setLoadedCount] = useState(0);
  const [filters, setFilters] = useState<CorrectionFilter>({
    search: '',
    processingType: 'all',
    dateRange: { from: undefined, to: undefined },
    sortBy: 'newest',
    userEmail: ''
  });

  // Load initial corrections and stats
  useEffect(() => {
    console.log('Loading initial data...');
    loadInitialCorrections();
    loadStats();
  }, []);

  // Reload when filters change (only if filters are active)
  useEffect(() => {
    const hasActiveFilters = filters.search || 
                           filters.processingType !== 'all' || 
                           filters.dateRange.from || 
                           filters.userEmail;
    
    if (hasActiveFilters) {
      console.log('Filters changed, reloading...', filters);
      loadCorrections();
    }
  }, [filters]);

  const loadInitialCorrections = async () => {
    console.log('Loading initial 10 corrections...');
    const params = {
      sortBy: 'newest',
      page: 0,
      limit: 10
    };
    
    const data = await getTextCorrections(params);
    console.log('Initial corrections loaded:', data.length);
    setLoadedCount(data.length);
  };

  const loadCorrections = async () => {
    const params = {
      search: filters.search,
      processingType: filters.processingType !== 'all' ? filters.processingType : undefined,
      startDate: filters.dateRange.from?.toISOString(),
      endDate: filters.dateRange.to?.toISOString(),
      sortBy: filters.sortBy,
      userEmail: filters.userEmail,
      page: 0,
      limit: 20
    };
    
    const data = await getTextCorrections(params);
    setLoadedCount(data.length);
  };

  const loadMoreCorrections = async () => {
    const nextPage = Math.floor(loadedCount / 10);
    const params = {
      search: filters.search,
      processingType: filters.processingType !== 'all' ? filters.processingType : undefined,
      startDate: filters.dateRange.from?.toISOString(),
      endDate: filters.dateRange.to?.toISOString(),
      sortBy: filters.sortBy,
      userEmail: filters.userEmail,
      page: nextPage,
      limit: 10,
      append: true // This will be used to append data instead of replacing
    };
    
    const data = await getTextCorrections(params);
    setLoadedCount(prev => prev + data.length);
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
    setLoadedCount(0);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      processingType: 'all',
      dateRange: { from: undefined, to: undefined },
      sortBy: 'newest',
      userEmail: ''
    });
    setLoadedCount(0);
    loadInitialCorrections();
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
            <div className="text-center py-4 mb-4">
              <p className="text-sm text-muted-foreground">
                कुल {totalCount} सुधार रिकॉर्ड में से {corrections.length} दिखाए जा रहे हैं
              </p>
              {/* Debug info */}
              <div className="mt-2 p-2 bg-muted rounded text-xs">
                <p>Debug: corrections.length = {corrections.length}</p>
                <p>totalCount = {totalCount}</p>
                <p>loading = {loading.toString()}</p>
                <p>loadedCount = {loadedCount}</p>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">डेटा लोड हो रहा है...</span>
              </div>
            ) : corrections && corrections.length > 0 ? (
              <div className="space-y-4">
                {corrections.map((correction, index) => (
                  <CorrectionCard
                    key={correction.id}
                    correction={correction}
                    index={index}
                  />
                ))}

                {/* Load More Button */}
                {loadedCount < totalCount && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={loadMoreCorrections}
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          लोड हो रहा है...
                        </>
                      ) : (
                        <>
                          और देखें ({totalCount - loadedCount} और रिकॉर्ड)
                        </>
                      )}
                    </Button>
                  </div>
                )}
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
                <div className="mt-4 p-4 bg-muted rounded text-sm">
                  <p>Debug Information:</p>
                  <p>• totalCount: {totalCount}</p>
                  <p>• corrections.length: {corrections.length}</p>
                  <p>• loadedCount: {loadedCount}</p>
                  <p>• loading: {loading.toString()}</p>
                  <p>• filters.processingType: {filters.processingType}</p>
                  <p>• Has search: {!!filters.search}</p>
                  <p>• Has userEmail: {!!filters.userEmail}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayoutWithNavigation>
  );
};

export default AdminUserCorrections;
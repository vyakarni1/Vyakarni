
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, RefreshCw } from "lucide-react";
import { dictionaryService, DictionaryTableData, WordReplacement } from "@/services/dictionaryService";
import { useToast } from "@/hooks/use-toast";

export function DictionaryDataTable() {
  const [data, setData] = useState<DictionaryTableData>({
    entries: [],
    totalCount: 0,
    page: 1,
    pageSize: 50
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [dictionaryType, setDictionaryType] = useState<'grammar' | 'style'>('grammar');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await dictionaryService.getDictionaryTableData(
        data.page,
        data.pageSize,
        searchTerm,
        dictionaryType
      );
      setData(result);
    } catch (error) {
      console.error("Error loading dictionary data:", error);
      toast({
        title: "Error",
        description: "Failed to load dictionary data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, dictionaryType, data.page]);

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    try {
      const exportData = await dictionaryService.exportDictionary(format, dictionaryType);
      
      const blob = new Blob([exportData], {
        type: format === 'csv' ? 'text/csv' : 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${dictionaryType}-dictionary.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `${dictionaryType} dictionary exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export dictionary",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setData(prev => ({ ...prev, page: newPage }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dictionary Entries</CardTitle>
        <CardDescription>
          Browse and manage dictionary entries for {dictionaryType} corrections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search words..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={dictionaryType} onValueChange={(value: 'grammar' | 'style') => setDictionaryType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Dictionary Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grammar">Grammar Dictionary</SelectItem>
                <SelectItem value="style">Style Dictionary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={loadData} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => handleExport('csv')} variant="outline" size="sm" disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button onClick={() => handleExport('json')} variant="outline" size="sm" disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              JSON
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Total entries: {data.totalCount}</span>
          <Badge variant="outline">{dictionaryType} dictionary</Badge>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Original</TableHead>
                <TableHead>Replacement</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {isLoading ? 'Loading...' : 'No dictionary entries found'}
                  </TableCell>
                </TableRow>
              ) : (
                data.entries.map((entry: WordReplacement) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.original}</TableCell>
                    <TableCell>{entry.replacement}</TableCell>
                    <TableCell>
                      <Badge variant={entry.dictionary_type === 'grammar' ? 'default' : 'secondary'}>
                        {entry.dictionary_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.source || 'google_sheets'}</TableCell>
                    <TableCell>
                      {entry.created_at ? new Date(entry.created_at).toLocaleDateString('hi-IN') : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {data.totalCount > data.pageSize && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((data.page - 1) * data.pageSize) + 1} to {Math.min(data.page * data.pageSize, data.totalCount)} of {data.totalCount} entries
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(data.page - 1)}
                disabled={data.page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(data.page + 1)}
                disabled={data.page * data.pageSize >= data.totalCount}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Download, Database, FileText } from "lucide-react";
import { dictionaryService, type WordReplacement, type DictionaryTableData } from "@/services/dictionaryService";
import { useToast } from "@/hooks/use-toast";

export function DictionaryDataTable() {
  const [tableData, setTableData] = useState<DictionaryTableData>({
    entries: [],
    totalCount: 0,
    page: 1,
    pageSize: 50
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const loadTableData = async (page: number = 1, search: string = "") => {
    setIsLoading(true);
    try {
      const data = await dictionaryService.getDictionaryTableData(page, 50, search);
      setTableData(data);
    } catch (error) {
      console.error("Error loading dictionary table data:", error);
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
    loadTableData(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    loadTableData(1, searchTerm);
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const exportData = await dictionaryService.exportDictionary(format);
      const blob = new Blob([exportData], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dictionary-export.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `Dictionary exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export dictionary data",
        variant: "destructive",
      });
    }
  };

  const getSourceBadge = (source: string) => {
    if (source === 'google_sheets') {
      return <Badge variant="default" className="bg-green-100 text-green-800">
        <Database className="h-3 w-3 mr-1" />
        Google Sheets
      </Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-100 text-gray-800">
      <FileText className="h-3 w-3 mr-1" />
      Static Fallback
    </Badge>;
  };

  const totalPages = Math.ceil(tableData.totalCount / tableData.pageSize);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Dictionary Entries</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('json')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search original or replacement words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading}>
            Search
          </Button>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-muted-foreground">
          Showing {tableData.entries.length} of {tableData.totalCount} entries
          {searchTerm && ` for "${searchTerm}"`}
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Original Word</TableHead>
                <TableHead className="w-[30%]">Replacement</TableHead>
                <TableHead className="w-[20%]">Source</TableHead>
                <TableHead className="w-[20%]">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : tableData.entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No entries found matching your search.' : 'No dictionary entries available.'}
                  </TableCell>
                </TableRow>
              ) : (
                tableData.entries.map((entry, index) => (
                  <TableRow key={entry.id || `${entry.original}-${index}`}>
                    <TableCell className="font-medium">
                      {entry.original}
                    </TableCell>
                    <TableCell>
                      {entry.replacement}
                    </TableCell>
                    <TableCell>
                      {getSourceBadge(entry.source || 'unknown')}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {entry.updated_at 
                        ? new Date(entry.updated_at).toLocaleDateString('hi-IN')
                        : 'Unknown'
                      }
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={pageNum === currentPage}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle, XCircle, Clock, TrendingUp, Database, FileText } from "lucide-react";
import { dictionaryService } from "@/services/dictionaryService";
import { useToast } from "@/hooks/use-toast";
import { DictionaryDataTable } from "@/components/Admin/DictionaryDataTable";
import Layout from "@/components/Layout";

export default function AdminDictionary() {
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const result = await dictionaryService.syncFromGoogleSheets();
      if (result.success) {
        toast({
          title: "Sync Successful",
          description: result.message,
        });
        await loadData();
      } else {
        toast({
          title: "Sync Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sync Error",
        description: "Failed to sync dictionary",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [statusData, statsData] = await Promise.all([
        dictionaryService.getSyncStatus(),
        dictionaryService.getDictionaryStats(),
      ]);
      setSyncStatus(statusData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading dictionary data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dictionary Management</h1>
            </div>
            <p className="text-gray-600 mt-1">Manage dynamic word dictionary from Google Sheets</p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Entries</p>
                    <p className="text-2xl font-bold">{stats?.totalEntries || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Database className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Database Entries</p>
                    <p className="text-2xl font-bold">{stats?.databaseEntries || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Static Fallback</p>
                    <p className="text-2xl font-bold">{stats?.staticEntries || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Current Source</p>
                    <p className="text-2xl font-bold">
                      {stats?.databaseEntries > 0 ? 'Live' : 'Fallback'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sync Control */}
          <Card>
            <CardHeader>
              <CardTitle>Google Sheets Sync</CardTitle>
              <CardDescription>
                Sync dictionary from Google Sheets to database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Manual Sync</h3>
                  <p className="text-sm text-muted-foreground">
                    Trigger immediate sync from Google Sheets
                  </p>
                </div>
                <Button onClick={handleSync} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Syncing...' : 'Sync Now'}
                </Button>
              </div>

              {syncStatus && (
                <div className="flex items-center gap-2 pt-4 border-t">
                  {getStatusIcon(syncStatus.sync_status)}
                  <Badge variant={syncStatus.sync_status === 'success' ? 'default' : 'destructive'}>
                    {syncStatus.sync_status}
                  </Badge>
                  {syncStatus.last_sync_at && (
                    <span className="text-sm text-muted-foreground">
                      Last sync: {new Date(syncStatus.last_sync_at).toLocaleString('hi-IN')}
                    </span>
                  )}
                  {syncStatus.error_message && (
                    <span className="text-sm text-red-600 ml-2">
                      Error: {syncStatus.error_message}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dictionary Data Table */}
          <DictionaryDataTable />
        </div>
      </div>
    </Layout>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import { dictionaryService } from "@/services/dictionaryService";
import { useToast } from "@/hooks/use-toast";

export function DictionaryManagement() {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dictionary Management</CardTitle>
          <CardDescription>
            Manage the dynamic word dictionary from Google Sheets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Google Sheets Sync</h3>
              <p className="text-sm text-muted-foreground">
                Sync dictionary from Google Sheets to database
              </p>
            </div>
            <Button onClick={handleSync} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>

          {syncStatus && (
            <div className="flex items-center gap-2">
              {getStatusIcon(syncStatus.sync_status)}
              <Badge variant={syncStatus.sync_status === 'success' ? 'default' : 'destructive'}>
                {syncStatus.sync_status}
              </Badge>
              {syncStatus.last_sync_at && (
                <span className="text-sm text-muted-foreground">
                  Last sync: {new Date(syncStatus.last_sync_at).toLocaleString()}
                </span>
              )}
            </div>
          )}

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalEntries}</div>
                <div className="text-sm text-muted-foreground">Total Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.databaseEntries}</div>
                <div className="text-sm text-muted-foreground">Database</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.staticEntries}</div>
                <div className="text-sm text-muted-foreground">Static Fallback</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {stats.databaseEntries > 0 ? 'Live' : 'Fallback'}
                </div>
                <div className="text-sm text-muted-foreground">Current Source</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
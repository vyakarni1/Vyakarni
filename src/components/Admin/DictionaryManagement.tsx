import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import { dictionaryService } from "@/services/dictionaryService";
import { useToast } from "@/hooks/use-toast";
import { DictionaryDataTable } from "@/components/Admin/DictionaryDataTable";

export function DictionaryManagement() {
  const [isGrammarLoading, setIsGrammarLoading] = useState(false);
  const [isStyleLoading, setIsStyleLoading] = useState(false);
  const [grammarSyncStatus, setGrammarSyncStatus] = useState<any>(null);
  const [styleSyncStatus, setStyleSyncStatus] = useState<any>(null);
  const [grammarStats, setGrammarStats] = useState<any>(null);
  const [styleStats, setStyleStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'grammar' | 'style'>('grammar');
  const { toast } = useToast();

  const handleSync = async (type: 'grammar' | 'style') => {
    const setLoading = type === 'grammar' ? setIsGrammarLoading : setIsStyleLoading;
    setLoading(true);
    try {
      const result = await dictionaryService.syncFromGoogleSheets(undefined, type);
      if (result.success) {
        toast({
          title: "Sync Successful",
          description: `${type === 'grammar' ? 'Grammar' : 'Style'} dictionary: ${result.message}`,
        });
        await loadData();
      } else {
        toast({
          title: "Sync Failed",
          description: `${type === 'grammar' ? 'Grammar' : 'Style'} dictionary: ${result.message}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sync Error",
        description: `Failed to sync ${type} dictionary`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [
        grammarStatusData, 
        styleStatusData, 
        grammarStatsData, 
        styleStatsData
      ] = await Promise.all([
        dictionaryService.getSyncStatus('grammar'),
        dictionaryService.getSyncStatus('style'),
        dictionaryService.getDictionaryStats('grammar'),
        dictionaryService.getDictionaryStats('style'),
      ]);
      setGrammarSyncStatus(grammarStatusData);
      setStyleSyncStatus(styleStatusData);
      setGrammarStats(grammarStatsData);
      setStyleStats(styleStatsData);
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

  const DictionarySection = ({ 
    type, 
    syncStatus, 
    stats, 
    isLoading 
  }: { 
    type: 'grammar' | 'style'; 
    syncStatus: any; 
    stats: any; 
    isLoading: boolean; 
  }) => (
    <Card>
      <CardHeader>
        <CardTitle>{type === 'grammar' ? 'Grammar' : 'Style'} Dictionary Management</CardTitle>
        <CardDescription>
          Manage the {type} word dictionary from Google Sheets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Google Sheets Sync</h3>
            <p className="text-sm text-muted-foreground">
              Sync {type} dictionary from Google Sheets to database
            </p>
          </div>
          <Button type="button" onClick={() => handleSync(type)} disabled={isLoading}>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalEntries}</div>
              <div className="text-sm text-muted-foreground">Total Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.databaseEntries}</div>
              <div className="text-sm text-muted-foreground">Database</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {stats.databaseEntries > 0 ? 'Live' : 'Empty'}
              </div>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dictionary Management</CardTitle>
          <CardDescription>
            Manage both grammar and style dictionaries from Google Sheets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'grammar' | 'style')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grammar">Grammar Dictionary</TabsTrigger>
              <TabsTrigger value="style">Style Dictionary</TabsTrigger>
            </TabsList>
            <TabsContent value="grammar" className="mt-6">
              <DictionarySection 
                type="grammar"
                syncStatus={grammarSyncStatus}
                stats={grammarStats}
                isLoading={isGrammarLoading}
              />
            </TabsContent>
            <TabsContent value="style" className="mt-6">
              <DictionarySection 
                type="style"
                syncStatus={styleSyncStatus}
                stats={styleStats}
                isLoading={isStyleLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Dictionary Data Table */}
      <DictionaryDataTable />
    </div>
  );
}
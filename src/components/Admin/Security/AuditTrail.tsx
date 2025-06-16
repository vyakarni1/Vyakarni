
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Shield, 
  User, 
  Database, 
  Settings, 
  Eye,
  Download,
  Clock,
  MapPin
} from 'lucide-react';

interface AuditLog {
  id: string;
  admin_id: string;
  admin_name: string;
  action_type: string;
  resource_type: string;
  resource_id?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

interface AuditTrailProps {
  logs: AuditLog[];
  isLoading: boolean;
  onExport: (format: 'csv' | 'json') => void;
}

const AuditTrail = ({ logs, isLoading, onExport }: AuditTrailProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  const getActionBadgeVariant = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'default';
      case 'update':
        return 'secondary';
      case 'delete':
        return 'destructive';
      case 'login':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getActionText = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'बनाया';
      case 'update':
        return 'अपडेट';
      case 'delete':
        return 'हटाया';
      case 'login':
        return 'लॉगिन';
      case 'logout':
        return 'लॉगआउट';
      case 'activate':
        return 'सक्रिय';
      case 'suspend':
        return 'निलंबित';
      default:
        return action;
    }
  };

  const getResourceText = (resource: string) => {
    switch (resource.toLowerCase()) {
      case 'user':
        return 'उपयोगकर्ता';
      case 'subscription':
        return 'सब्सक्रिप्शन';
      case 'settings':
        return 'सेटिंग्स';
      case 'system':
        return 'सिस्टम';
      default:
        return resource;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.admin_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action_type === actionFilter;
    const matchesResource = resourceFilter === 'all' || log.resource_type === resourceFilter;
    
    let matchesTime = true;
    if (timeFilter !== 'all') {
      const logDate = new Date(log.created_at);
      const now = new Date();
      switch (timeFilter) {
        case 'today':
          matchesTime = logDate.toDateString() === now.toDateString();
          break;
        case 'week':
          matchesTime = now.getTime() - logDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
          break;
        case 'month':
          matchesTime = now.getTime() - logDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
          break;
      }
    }
    
    return matchesSearch && matchesAction && matchesResource && matchesTime;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span>ऑडिट ट्रेल</span>
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onExport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => onExport('json')}>
            <Download className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="कार्य फ़िल्टर" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सभी कार्य</SelectItem>
              <SelectItem value="create">बनाया</SelectItem>
              <SelectItem value="update">अपडेट</SelectItem>
              <SelectItem value="delete">हटाया</SelectItem>
              <SelectItem value="login">लॉगिन</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={resourceFilter} onValueChange={setResourceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="रिसोर्स फ़िल्टर" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सभी रिसोर्स</SelectItem>
              <SelectItem value="user">उपयोगकर्ता</SelectItem>
              <SelectItem value="subscription">सब्सक्रिप्शन</SelectItem>
              <SelectItem value="settings">सेटिंग्स</SelectItem>
              <SelectItem value="system">सिस्टम</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="समय फ़िल्टर" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सभी समय</SelectItem>
              <SelectItem value="today">आज</SelectItem>
              <SelectItem value="week">इस सप्ताह</SelectItem>
              <SelectItem value="month">इस माह</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Audit Logs Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>समय</TableHead>
                <TableHead>व्यवस्थापक</TableHead>
                <TableHead>कार्य</TableHead>
                <TableHead>रिसोर्स</TableHead>
                <TableHead>विवरण</TableHead>
                <TableHead>IP पता</TableHead>
                <TableHead>कार्य</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium">
                          {new Date(log.created_at).toLocaleDateString('hi-IN')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.created_at).toLocaleTimeString('hi-IN')}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{log.admin_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getActionBadgeVariant(log.action_type)}>
                      {getActionText(log.action_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-gray-400" />
                      <span>{getResourceText(log.resource_type)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {log.resource_id && (
                        <span className="text-sm text-gray-600">
                          ID: {log.resource_id.slice(0, 8)}...
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {log.ip_address || 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">कोई ऑडिट लॉग नहीं मिला</h3>
            <p className="text-gray-600">फ़िल्टर परिवर्तित करने का प्रयास करें</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditTrail;

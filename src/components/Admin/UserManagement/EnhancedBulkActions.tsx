import React, { useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Users, 
  Shield, 
  ShieldOff, 
  Trash2, 
  Mail,
  Coins,
  Plus,
  Minus
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EnhancedBulkActionsProps {
  selectedCount: number;
  onBulkAction: (action: string, value?: any) => void;
  isUpdating: boolean;
}

const EnhancedBulkActions = ({ selectedCount, onBulkAction, isUpdating }: EnhancedBulkActionsProps) => {
  const [creditAction, setCreditAction] = useState<'add' | 'deduct'>('add');
  const [creditAmount, setCreditAmount] = useState('');
  const [creditReason, setCreditReason] = useState('');
  const [isFreeCredit, setIsFreeCredit] = useState(true);
  const [expiryDays, setExpiryDays] = useState('30');
  const [showCreditDialog, setShowCreditDialog] = useState(false);

  if (selectedCount === 0) return null;

  const handleCreditManagement = () => {
    const amount = parseInt(creditAmount);
    if (!amount || amount <= 0) return;

    const value = {
      amount,
      reason: creditReason,
      is_free: isFreeCredit,
      expiry_date: creditAction === 'add' && !isFreeCredit 
        ? new Date(Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000).toISOString() 
        : null
    };

    onBulkAction(creditAction === 'add' ? 'add_credits' : 'deduct_credits', value);
    setShowCreditDialog(false);
    setCreditAmount('');
    setCreditReason('');
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <span className="font-semibold text-blue-900 text-lg">
                {selectedCount} उपयोगकर्ता चयनित
              </span>
              <p className="text-sm text-blue-700">बल्क ऑपरेशन के लिए तैयार</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Word Credit Management */}
            <Dialog open={showCreditDialog} onOpenChange={setShowCreditDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Coins className="h-4 w-4" />
                  <span>शब्द क्रेडिट</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>शब्द क्रेडिट प्रबंधन</DialogTitle>
                  <DialogDescription>
                    {selectedCount} चयनित उपयोगकर्ताओं के लिए शब्द क्रेडिट जोड़ें या घटाएं
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={creditAction === 'add' ? 'default' : 'outline'}
                      onClick={() => setCreditAction('add')}
                      className="flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>जोड़ें</span>
                    </Button>
                    <Button
                      variant={creditAction === 'deduct' ? 'default' : 'outline'}
                      onClick={() => setCreditAction('deduct')}
                      className="flex items-center space-x-1"
                    >
                      <Minus className="h-4 w-4" />
                      <span>घटाएं</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">शब्द की संख्या</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="उदाहरण: 500"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                    />
                  </div>

                  {creditAction === 'add' && (
                    <>
                      <div className="space-y-2">
                        <Label>क्रेडिट प्रकार</Label>
                        <Select 
                          value={isFreeCredit ? 'free' : 'paid'} 
                          onValueChange={(value) => setIsFreeCredit(value === 'free')}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">मुफ्त क्रेडिट</SelectItem>
                            <SelectItem value="paid">खरीदा गया क्रेडिट</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {!isFreeCredit && (
                        <div className="space-y-2">
                          <Label htmlFor="expiry">समाप्ति अवधि (दिन)</Label>
                          <Input
                            id="expiry"
                            type="number"
                            value={expiryDays}
                            onChange={(e) => setExpiryDays(e.target.value)}
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="reason">कारण (वैकल्पिक)</Label>
                    <Textarea
                      id="reason"
                      placeholder="इस कार्य का कारण बताएं..."
                      value={creditReason}
                      onChange={(e) => setCreditReason(e.target.value)}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreditDialog(false)}>
                    रद्द करें
                  </Button>
                  <Button onClick={handleCreditManagement} disabled={!creditAmount || isUpdating}>
                    {creditAction === 'add' ? 'क्रेडिट जोड़ें' : 'क्रेडिट घटाएं'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Other Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('activate')}
              disabled={isUpdating}
              className="flex items-center space-x-1 border-green-200 text-green-700 hover:bg-green-50"
            >
              <Shield className="h-4 w-4" />
              <span>सक्रिय करें</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('suspend')}
              disabled={isUpdating}
              className="flex items-center space-x-1 border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              <ShieldOff className="h-4 w-4" />
              <span>निलंबित करें</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('email')}
              disabled={isUpdating}
              className="flex items-center space-x-1 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Mail className="h-4 w-4" />
              <span>ईमेल भेजें</span>
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onBulkAction('delete')}
              disabled={isUpdating}
              className="flex items-center space-x-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>हटाएं</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedBulkActions;

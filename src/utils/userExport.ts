
import { UserWithDetails } from '@/types/userManagement';
import { useToast } from '@/hooks/use-toast';

export const useUserExport = () => {
  const { toast } = useToast();

  const exportUsers = async (users: UserWithDetails[], format: 'csv' | 'json' = 'csv') => {
    try {
      const exportData = users || [];
      
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-complete-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const csvContent = [
          'Name,Email,Role,Profile Completion,Word Balance,Free Words,Purchased Words,Total Corrections,Words Used Today,Created At',
          ...exportData.map(user => 
            `"${user.name || ''}","${user.email}","${user.role}",${user.profile_completion}%,${user.word_balance.total_words_available},${user.word_balance.free_words},${user.word_balance.purchased_words},${user.usage_stats.total_corrections},${user.usage_stats.words_used_today},"${user.created_at}"`
          )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-complete-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }

      toast({
        title: "एक्सपोर्ट सफल",
        description: `उपयोगकर्ता डेटा ${format.toUpperCase()} फॉर्मेट में डाउनलोड हो गया।`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "एक्सपोर्ट त्रुटि",
        description: "डेटा एक्सपोर्ट करने में त्रुटि हुई।",
        variant: "destructive",
      });
    }
  };

  return { exportUsers };
};

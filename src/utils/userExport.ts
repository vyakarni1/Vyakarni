
import { UserWithDetails } from '@/types/userManagement';
import { toast } from 'sonner';

export const exportUsers = async (users: UserWithDetails[] | undefined, format: 'csv' | 'json' = 'csv') => {
  try {
    const exportData = users || [];
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const csvContent = [
        'Name,Email,Created At,Role,Word Balance,Profile Completion,Is Active',
        ...exportData.map(user => 
          `"${user.name || 'N/A'}","${user.email}","${user.created_at}","${user.role}",${user.word_balance.total_words_available},${user.profile_completion}%,${user.is_active ? 'Yes' : 'No'}`
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    toast.success("एक्सपोर्ट सफल", {
      description: `उपयोगकर्ता डेटा ${format.toUpperCase()} फॉर्मेट में डाउनलोड हो गया।`,
    });
  } catch (error) {
    toast.error("एक्सपोर्ट त्रुटि", {
      description: "डेटा एक्सपोर्ट करने में त्रुटि हुई।",
    });
  }
};

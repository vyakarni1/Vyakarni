
import { Clock, Eye, CheckCircle, MessageSquare } from 'lucide-react';

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'unread':
      return Clock;
    case 'read':
      return Eye;
    case 'replied':
      return CheckCircle;
    default:
      return MessageSquare;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'unread':
      return 'bg-yellow-100 text-yellow-800';
    case 'read':
      return 'bg-blue-100 text-blue-800';
    case 'replied':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'unread':
      return 'अपठित';
    case 'read':
      return 'पठित';
    case 'replied':
      return 'उत्तर दिया';
    default:
      return 'अज्ञात';
  }
};

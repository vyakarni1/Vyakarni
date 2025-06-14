
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { validatePasswordStrength, PasswordStrength } from '@/utils/securityUtils';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  showFeedback?: boolean;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ 
  password, 
  showFeedback = true 
}) => {
  const strength: PasswordStrength = validatePasswordStrength(password);
  
  const getStrengthColor = (score: number) => {
    if (score < 40) return 'bg-red-500';
    if (score < 60) return 'bg-orange-500';
    if (score < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getStrengthText = (score: number) => {
    if (score < 40) return 'कमजोर';
    if (score < 60) return 'मध्यम';
    if (score < 80) return 'अच्छा';
    return 'मजबूत';
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">पासवर्ड मजबूती:</span>
        <span className={`text-sm font-medium ${
          strength.score < 40 ? 'text-red-600' :
          strength.score < 60 ? 'text-orange-600' :
          strength.score < 80 ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {getStrengthText(strength.score)}
        </span>
      </div>
      
      <Progress 
        value={strength.score} 
        className={`h-2 ${getStrengthColor(strength.score)}`}
      />
      
      {showFeedback && strength.feedback.length > 0 && (
        <div className="space-y-1">
          {strength.feedback.map((feedback, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <XCircle className="h-3 w-3 text-red-500" />
              <span className="text-red-600">{feedback}</span>
            </div>
          ))}
          {strength.isValid && (
            <div className="flex items-center space-x-2 text-xs">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-green-600">पासवर्ड मजबूत है!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;

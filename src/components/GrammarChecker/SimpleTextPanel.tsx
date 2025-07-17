import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface SimpleTextPanelProps {
  title: string;
  text: string;
  placeholder?: string;
  onTextChange?: (text: string) => void;
  readOnly?: boolean;
  className?: string;
}

export const SimpleTextPanel: React.FC<SimpleTextPanelProps> = ({
  title,
  text,
  placeholder = "",
  onTextChange,
  readOnly = false,
  className = ""
}) => {
  return (
    <Card className={`h-full ${className}`}>
      <CardContent className="p-6 h-full flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        
        <Textarea
          value={text}
          onChange={onTextChange ? (e) => onTextChange(e.target.value) : undefined}
          placeholder={placeholder}
          readOnly={readOnly}
          className="flex-1 min-h-[300px] text-base leading-relaxed resize-none border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
          style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
        />
        
        {text && (
          <div className="mt-3 text-sm text-gray-500 space-x-4">
            <span>शब्द: {text.trim() ? text.trim().split(/\s+/).length : 0}</span>
            <span>अक्षर: {text.length}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
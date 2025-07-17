import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface SimpleProgressDisplayProps {
  isProcessing: boolean;
  progress: number;
  currentStage: string;
}

export const SimpleProgressDisplay: React.FC<SimpleProgressDisplayProps> = ({
  isProcessing,
  progress,
  currentStage
}) => {
  if (!isProcessing) return null;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">व्याकरण सुधार प्रगति</h3>
            <p className="text-gray-600">{currentStage}</p>
          </div>
          
          <Progress value={progress} className="w-full" />
          
          <div className="text-center text-sm text-gray-500">
            {progress}% पूर्ण
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
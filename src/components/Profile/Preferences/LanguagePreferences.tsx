
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

interface LanguagePreferencesProps {
  preferredLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguagePreferences = ({ preferredLanguage, onLanguageChange }: LanguagePreferencesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="h-5 w-5 mr-2 text-blue-500" />
          भाषा की प्राथमिकतायें
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="language">चयनित भाषा</Label>
          <Select
            value={preferredLanguage}
            onValueChange={onLanguageChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="भाषा चुनयें" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hindi">हिंदी</SelectItem>
              <SelectItem value="english">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguagePreferences;

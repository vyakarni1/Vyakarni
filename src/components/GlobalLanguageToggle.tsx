
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLanguage } from "@/contexts/LanguageContext";

interface GlobalLanguageToggleProps {
  className?: string;
}

const GlobalLanguageToggle = ({ className = "" }: GlobalLanguageToggleProps) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-gray-200 ${className}`}>
      <ToggleGroup
        type="single"
        value={language}
        onValueChange={(value) => value && setLanguage(value as "english" | "hindi")}
        className="gap-1"
      >
        <ToggleGroupItem
          value="hindi"
          className="text-sm px-3 py-1 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
        >
          हिंदी
        </ToggleGroupItem>
        <ToggleGroupItem
          value="english"
          className="text-sm px-3 py-1 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
        >
          English
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default GlobalLanguageToggle;

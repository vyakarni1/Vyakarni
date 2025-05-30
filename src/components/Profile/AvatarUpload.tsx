
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, X, Upload } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarUpdate: (avatarUrl: string) => void;
}

const AvatarUpload = ({ currentAvatarUrl, onAvatarUpdate }: AvatarUploadProps) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading, error, handleFileSelect, removeAvatar } = useAvatarUpload({
    currentAvatarUrl,
    onAvatarUpdate
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div 
        className="relative group cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <Avatar className="h-24 w-24 transition-all duration-200 group-hover:opacity-80">
          <AvatarImage src={currentAvatarUrl} alt="Profile" />
          <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        
        {/* Overlay for drag and drop */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Camera className="h-6 w-6 text-white" />
        </div>

        {/* Remove button */}
        {currentAvatarUrl && (
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => {
              e.stopPropagation();
              removeAvatar();
            }}
            disabled={uploading}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        
        <Button
          variant="outline"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="min-w-[120px]"
        >
          <Camera className="h-4 w-4 mr-2" />
          {uploading ? "अपलोड हो रहा है..." : "फ़ोटो बदलें"}
        </Button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            अधिकतम आकार: 2MB<br />
            समर्थित: JPG, PNG, GIF
          </p>
          <p className="text-xs text-blue-500 mt-1">
            या यहाँ फ़ाइल खींचें और छोड़ें
          </p>
        </div>

        {error && (
          <p className="text-xs text-red-500 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;

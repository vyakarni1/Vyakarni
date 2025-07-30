
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";

const AccountDeletion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const handleAccountDeletion = async () => {
    if (!user) return;
    
    if (confirmationText !== "DELETE") {
      toast.error("कृपया पुष्टि के लिये 'DELETE' टाइप करें");
      return;
    }

    setIsDeleting(true);
    try {
      // Delete user's avatar from storage first
      const { data: files } = await supabase.storage
        .from('avatars')
        .list(user.id);

      if (files && files.length > 0) {
        const filesToDelete = files.map(file => `${user.id}/${file.name}`);
        await supabase.storage.from('avatars').remove(filesToDelete);
      }

      // The user profile and related data will be automatically deleted 
      // due to CASCADE foreign key relationships when the auth user is deleted
      
      // Delete the auth user (this will trigger cascading deletes)
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;

      toast.success("आपका खाता सफलतापूर्वक हटा दिया गया है");
      navigate("/");
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error("खाता हटाने में त्रुटि। कृपया सपोर्ट से संपर्क करें।");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <Trash2 className="h-5 w-5 mr-2" />
          खाता हटायें
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-red-100 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-red-800">चेतावनी: यह कार्य अपरिवर्तनीय है</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• आपका सारा डेटा स्थायी रूप से हट जायेगा</li>
                <li>• आपके सभी शब्द क्रेडिट समाप्त हो जायेंगे</li>
                <li>• आपकी व्याकरण जाँच का इतिहास हट जायेगा</li>
                <li>• यह कार्य वापस नहीं किया जा सकता</li>
              </ul>
            </div>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              स्थायी रूप से खाता हटायें
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>क्या आप स्पष्टतः अपना खाता हटाना चाहते हैं?</AlertDialogTitle>
              <AlertDialogDescription>
                यह कार्य अपरिवर्तनीय है। आपका सारा डेटा स्थायी रूप से हट जायेगा।
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirmation">
                  पुष्टि के लिए <strong>DELETE</strong> टाइप करें:
                </Label>
                <Input
                  id="confirmation"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="DELETE"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>रद्द करें</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleAccountDeletion}
                disabled={isDeleting || confirmationText !== "DELETE"}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "हटाया जा रहा है..." : "खाता हटायें"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default AccountDeletion;

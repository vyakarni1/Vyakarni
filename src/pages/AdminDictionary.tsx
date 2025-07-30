
import AdminLayoutWithNavigation from "@/components/AdminLayoutWithNavigation";
import { DictionaryManagement } from "@/components/Admin/DictionaryManagement";

export default function AdminDictionary() {
  return (
    <AdminLayoutWithNavigation>
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="bg-card shadow-sm border rounded-lg">
          <div className="px-6 py-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-foreground">Dictionary Management</h1>
            </div>
            <p className="text-muted-foreground mt-1">Manage grammar and style dictionaries from Google Sheets</p>
          </div>
        </div>

        <DictionaryManagement />
      </div>
    </AdminLayoutWithNavigation>
  );
}


import Layout from "@/components/Layout";
import { DictionaryManagement } from "@/components/Admin/DictionaryManagement";

export default function AdminDictionary() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">Dictionary Management</h1>
            </div>
            <p className="text-gray-600 mt-1">Manage grammar and style dictionaries from Google Sheets</p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <DictionaryManagement />
        </div>
      </div>
    </Layout>
  );
}

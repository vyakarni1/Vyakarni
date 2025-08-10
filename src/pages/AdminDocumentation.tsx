import AdminLayoutWithNavigation from "@/components/AdminLayoutWithNavigation";
import { DocumentationExport } from "@/components/Admin/DocumentationExport";

const AdminDocumentation = () => {
  return (
    <AdminLayoutWithNavigation>
      <DocumentationExport />
    </AdminLayoutWithNavigation>
  );
};

export default AdminDocumentation;
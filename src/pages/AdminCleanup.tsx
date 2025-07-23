
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import DatabaseCleanup from '@/components/Admin/DatabaseCleanup';

const AdminCleanup = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">डेटाबेस सफाई</h1>
          <p className="text-muted-foreground mt-2">
            अनावश्यक डेटा को सुरक्षित रूप से हटाकर स्टोरेज स्पेस बचाएं
          </p>
        </div>
        
        <DatabaseCleanup />
      </div>
    </AdminLayout>
  );
};

export default AdminCleanup;

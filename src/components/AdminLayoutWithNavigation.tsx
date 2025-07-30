import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import UnifiedNavigation from "./UnifiedNavigation";
import Footer from "./Footer";
import MarqueeBar from "./MarqueeBar";

interface AdminLayoutWithNavigationProps {
  children: ReactNode;
}

const AdminLayoutWithNavigation = ({ children }: AdminLayoutWithNavigationProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Header */}
      <UnifiedNavigation variant="default" />
      <MarqueeBar />

      <SidebarProvider>
        <div className="flex min-h-screen w-full pt-24">
          {/* Admin Sidebar */}
          <AdminSidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Content Header with Sidebar Toggle */}
            <div className="flex items-center h-12 px-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-24 z-40 lg:hidden">
              <SidebarTrigger className="mr-2" />
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminLayoutWithNavigation;
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
        <div className="flex min-h-screen w-full pt-16 sm:pt-20 md:pt-24">
          {/* Admin Sidebar */}
          <AdminSidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Content Header with Sidebar Toggle - Always visible on mobile/tablet */}
            <div className="flex items-center h-12 px-3 sm:px-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 sm:top-20 md:top-24 z-40 xl:hidden">
              <SidebarTrigger className="mr-2" />
              <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">एडमिन पैनल</h1>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
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

import { ReactNode } from "react";
import UnifiedNavigation from "@/components/UnifiedNavigation";
import Footer from "@/components/Footer";

interface LayoutProps {
  children: ReactNode;
  variant?: "default" | "transparent";
}

const Layout = ({ children, variant = "default" }: LayoutProps) => {
  const navigationVariant = variant === "transparent" ? "default" : "default";
  const navigationClassName = variant === "transparent" ? "bg-transparent" : "";

  return (
    <div className="min-h-screen flex flex-col">
      <UnifiedNavigation variant={navigationVariant} className={navigationClassName} />
      
      {/* Main Content */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;

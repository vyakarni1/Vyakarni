
import { ReactNode } from "react";
import UnifiedNavigation from "@/components/UnifiedNavigation";
import Footer from "@/components/Footer";
import MarqueeBar from "@/components/MarqueeBar";

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
      <MarqueeBar content="🎉 व्याकरणी के साथ अपनी हिंदी लेखन को बेहतर बनाएं | Improve your Hindi writing with Vyaakarani 🎉" />
      
      {/* Main Content - adjusted padding to account for header (16) + marquee (8) = 24 */}
      <main className="flex-1 pt-24">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;

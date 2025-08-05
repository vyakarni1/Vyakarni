import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3,
  Mail,
  Shield,
  BookOpen,
  PenTool,
  MessageSquare,
  Receipt
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const adminNavItems = [
  { 
    name: "डैशबोर्ड", 
    href: "/admin", 
    icon: LayoutDashboard,
    exact: true
  },
  { 
    name: "उपयोगकर्ता", 
    href: "/admin/users", 
    icon: Users 
  },
  { 
    name: "एनालिटिक्स", 
    href: "/admin/analytics", 
    icon: BarChart3,
    exact: false
  },
  { 
    name: "ब्लॉग प्रबंधन", 
    href: "/admin/blog", 
    icon: PenTool 
  },
  { 
    name: "ईमेल प्रबंधन", 
    href: "/admin/emails", 
    icon: Mail 
  },
  { 
    name: "संपर्क संदेश", 
    href: "/admin/contacts", 
    icon: MessageSquare 
  },
  { 
    name: "इनवॉयस प्रबंधन", 
    href: "/admin/invoices", 
    icon: Receipt 
  },
  { 
    name: "शब्दकोश प्रबंधन", 
    href: "/admin/dictionary", 
    icon: BookOpen 
  },
  { 
    name: "सेटिंग्स", 
    href: "/admin/settings", 
    icon: Settings 
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <SidebarContent>
        {/* Admin Header - Hidden on mobile as it's shown in main header */}
        <div className="hidden xl:flex h-16 items-center px-3 sm:px-4 border-b border-border">
          <div className="flex items-center space-x-2 min-w-0">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            {!isCollapsed && <h1 className="text-base sm:text-lg font-bold text-foreground truncate">एडमिन पैनल</h1>}
          </div>
        </div>

        <SidebarGroup className="mt-2 xl:mt-4">
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : "px-3 sm:px-4 text-xs sm:text-sm font-medium"}>
            प्रबंधन
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2 sm:px-3">
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.href} 
                      end={item.exact}
                      className={({ isActive }) => 
                        `flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2.5 sm:py-3 rounded-lg transition-colors min-h-[44px] ${
                          isActive 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium text-sm sm:text-base truncate">
                          {item.name}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
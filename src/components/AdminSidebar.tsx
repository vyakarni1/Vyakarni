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
  MessageSquare
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
    icon: BarChart3 
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
    >
      <SidebarContent>
        {/* Admin Header */}
        <div className="flex h-16 items-center px-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            {!isCollapsed && <h1 className="text-lg font-bold text-foreground">एडमिन पैनल</h1>}
          </div>
        </div>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            प्रबंधन
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.href} 
                      end={item.exact}
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.name}</span>}
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
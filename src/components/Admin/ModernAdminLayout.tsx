
import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  CreditCard, 
  Settings, 
  Menu,
  X,
  Bell,
  Search,
  User,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/AuthProvider';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  useSidebar
} from '@/components/ui/sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'डैशबोर्ड', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'उपयोगकर्ता', href: '/admin/users', icon: Users },
  { name: 'एनालिटिक्स', href: '/admin/analytics', icon: BarChart3 },
  { name: 'सब्सक्रिप्शन', href: '/admin/subscriptions', icon: CreditCard },
  { name: 'संपर्क संदेश', href: '/admin/contacts', icon: Bell },
  { name: 'सेटिंग्स', href: '/admin/settings', icon: Settings },
];

const ModernAdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <Sidebar variant="inset" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="text-lg font-semibold text-sidebar-foreground">व्यवस्थापक पैनल</h2>
            <p className="text-xs text-sidebar-foreground/70">डैशबोर्ड प्रबंधन</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                onClick={() => navigate(item.href)}
                isActive={location.pathname === item.href}
                className="w-full justify-start px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <item.icon className="mr-3 h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="mt-auto pt-4 border-t border-sidebar-border group-data-[collapsible=icon]:hidden">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-sidebar-accent/50">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.email?.split('@')[0] || 'Admin'}
              </p>
              <p className="text-xs text-sidebar-foreground/70">व्यवस्थापक</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

const ModernAdminLayout = ({ children }: AdminLayoutProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <ModernAdminSidebar />
        
        <SidebarInset className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="-ml-1" />
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="खोजें..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64 bg-white/50 border-gray-200/50 focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
                </Button>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="text-sm text-gray-600">
                  अंतिम अपडेट: {new Date().toLocaleTimeString('hi-IN')}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ModernAdminLayout;

import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3,
  Mail,
  Shield,
  BookOpen,
  PenTool
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();

  const navItems = [
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
      icon: Mail 
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

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">एडमिन पैनल</h1>
          </div>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href, item.exact)
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

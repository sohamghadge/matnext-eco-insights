import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Users, 
  Package, 
  Briefcase, 
  Database,
  ChevronDown,
  ChevronRight,
  UserCircle,
  Building,
  Recycle,
  Factory,
  Truck,
  Wrench,
  HardHat,
  Store,
  Car
} from 'lucide-react';
import matnextLogo from '@/assets/matnext-logo.png';

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    key: 'home',
    label: 'Home',
    icon: <Home className="w-5 h-5" />,
    path: '/',
  },
  {
    key: 'dashboard',
    label: 'Dashboard (Compliance)',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/dashboard',
  },
  {
    key: 'user',
    label: 'User',
    icon: <Users className="w-5 h-5" />,
    children: [
      { key: 'admin', label: 'Admin', icon: <UserCircle className="w-4 h-4" />, path: '/user/admin' },
      { key: 'owner', label: 'Owner', icon: <Building className="w-4 h-4" />, path: '/user/owner' },
      { key: 'scrapping', label: 'Scrapping Facility', icon: <Recycle className="w-4 h-4" />, path: '/user/scrapping' },
      { key: 'material-producer', label: 'Material Producer', icon: <Factory className="w-4 h-4" />, path: '/user/material-producer' },
      { key: 'trading', label: 'Trading Company', icon: <Store className="w-4 h-4" />, path: '/user/trading' },
      { key: 'part-producer', label: 'Part Producer', icon: <Wrench className="w-4 h-4" />, path: '/user/part-producer' },
      { key: 'technician', label: 'Part Producer Technician', icon: <HardHat className="w-4 h-4" />, path: '/user/technician' },
      { key: 'maker', label: 'Maker', icon: <Car className="w-4 h-4" />, path: '/user/maker' },
      { key: 'transport', label: 'Transport Contractor', icon: <Truck className="w-4 h-4" />, path: '/user/transport' },
    ],
  },
  {
    key: 'inventory',
    label: 'Inventory',
    icon: <Package className="w-5 h-5" />,
    path: '/inventory',
  },
  {
    key: 'jobs',
    label: 'Jobs',
    icon: <Briefcase className="w-5 h-5" />,
    path: '/jobs',
  },
  {
    key: 'data-view',
    label: 'Data View',
    icon: <Database className="w-5 h-5" />,
    path: '/data-view',
  },
];

const AppSidebar = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['user']);

  const toggleExpand = (key: string) => {
    setExpandedItems(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key) 
        : [...prev, key]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.key);
    const active = isActive(item.path);

    if (hasChildren) {
      return (
        <div key={item.key}>
          <button
            onClick={() => toggleExpand(item.key)}
            className={`
              w-full flex items-center justify-between px-4 py-3 text-sidebar-foreground
              hover:bg-sidebar-accent transition-colors rounded-lg mx-2
              ${level > 0 ? 'pl-10' : ''}
            `}
          >
            <span className="flex items-center gap-3">
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </span>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {isExpanded && (
            <div className="ml-4">
              {item.children?.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.key}
        to={item.path || '/'}
        className={({ isActive }) => `
          flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors
          ${isActive 
            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' 
            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
          }
          ${level > 0 ? 'pl-10 text-sm' : ''}
        `}
      >
        {item.icon}
        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <img 
          src={matnextLogo} 
          alt="MatNEXT - powered by GenbaNEXT" 
          className="h-12 object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/60 text-center">
          ©2025 GenbaNEXT Limited
        </p>
      </div>
    </aside>
  );
};

export default AppSidebar;

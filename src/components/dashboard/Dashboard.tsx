import { useState, useCallback } from 'react';
import { Tabs, Empty, ConfigProvider } from 'antd';
import { Building2, Recycle, Factory, Truck } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import MSILTab from './tabs/MSILTab';
import RVSFTab from './tabs/RVSFTab';
import RecyclersTab from './tabs/RecyclersTab';
import SuppliersTab from './tabs/SuppliersTab';
import { FilterState, defaultFilters } from '@/data/dashboardData';

const Dashboard = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeTab, setActiveTab] = useState('msil');
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setIsLoading(true);
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const tabItems = [
    {
      key: 'msil',
      label: (
        <span className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Corporate (MSIL)
        </span>
      ),
      children: <MSILTab isLoading={isLoading} />,
    },
    {
      key: 'rvsf',
      label: (
        <span className="flex items-center gap-2">
          <Recycle className="w-4 h-4" />
          Scrapping (RVSF)
        </span>
      ),
      children: <RVSFTab isLoading={isLoading} />,
    },
    {
      key: 'recyclers',
      label: (
        <span className="flex items-center gap-2">
          <Factory className="w-4 h-4" />
          Material Processing
        </span>
      ),
      children: <RecyclersTab isLoading={isLoading} />,
    },
    {
      key: 'suppliers',
      label: (
        <span className="flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Supply Chain
        </span>
      ),
      children: <SuppliersTab isLoading={isLoading} />,
    },
  ];

  // Ant Design theme customization
  const antdTheme = {
    token: {
      colorPrimary: '#3d6b4f',
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      borderRadius: 8,
      fontFamily: "'Inter', system-ui, sans-serif",
    },
    components: {
      Select: {
        controlHeight: 36,
        borderRadius: 8,
      },
      Tabs: {
        itemColor: '#64748b',
        itemActiveColor: '#3d6b4f',
        itemHoverColor: '#3d6b4f',
        inkBarColor: '#3d6b4f',
      },
      Table: {
        headerBg: '#f0fdf4',
        headerColor: '#166534',
        borderColor: '#e2e8f0',
      },
      Progress: {
        defaultColor: '#10b981',
      },
    },
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <div className="min-h-screen bg-background">
        <DashboardHeader filters={filters} onFilterChange={handleFilterChange} />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Dashboard (Statistics)</h1>
          </div>

          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            type="card"
            size="large"
            className="dashboard-tabs"
          />
        </main>
      </div>
    </ConfigProvider>
  );
};

export default Dashboard;

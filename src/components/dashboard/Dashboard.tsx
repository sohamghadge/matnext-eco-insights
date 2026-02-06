import { useState, useCallback } from 'react';
import { Tabs, ConfigProvider } from 'antd';
import { Building2, Recycle, Factory, Truck } from 'lucide-react';
import MSILTab from './tabs/MSILTab';
import RVSFTab from './tabs/RVSFTab';
import RecyclersTab from './tabs/RecyclersTab';
import SuppliersTab from './tabs/SuppliersTab';
import DashboardHeader from './DashboardHeader';
import { FilterState, defaultFilters } from '@/data/dashboardData';

const Dashboard = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeTab, setActiveTab] = useState('msil');
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = useCallback((key: keyof FilterState, value: string | string[] | Date) => {
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
      children: <MSILTab isLoading={isLoading} filters={filters} />,
    },
    {
      key: 'rvsf',
      label: (
        <span className="flex items-center gap-2">
          <Recycle className="w-4 h-4" />
          RVSFs Overview
        </span>
      ),
      children: <RVSFTab isLoading={isLoading} filters={filters} />,
    },
    {
      key: 'recyclers',
      label: (
        <span className="flex items-center gap-2">
          <Factory className="w-4 h-4" />
          Recyclers Overview
        </span>
      ),
      children: <RecyclersTab isLoading={isLoading} filters={filters} />,
    },
    {
      key: 'suppliers',
      label: (
        <span className="flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Suppliers Overview
        </span>
      ),
      children: <SuppliersTab isLoading={isLoading} filters={filters} />,
    },
  ];

  // Ant Design theme customization - Olive Green theme
  const antdTheme = {
    token: {
      colorPrimary: '#5a7a32',
      colorSuccess: '#6b8e23',
      colorWarning: '#d4a537',
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
        itemActiveColor: '#5a7a32',
        itemHoverColor: '#5a7a32',
        inkBarColor: '#5a7a32',
      },
      Table: {
        headerBg: '#f0f4e8',
        headerColor: '#3d5a1f',
        borderColor: '#e2e8d0',
      },
      Progress: {
        defaultColor: '#6b8e23',
      },
    },
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <div className="bg-background">
        {/* Dashboard Header with filters and targets */}
        <DashboardHeader filters={filters} onFilterChange={handleFilterChange} />

        <div className="px-6 py-6">
          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            type="card"
            size="large"
            className="dashboard-tabs"
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Dashboard;

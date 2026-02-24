import { useState, useCallback } from 'react';
import { Tabs, ConfigProvider, notification } from 'antd';
import { Building2, Recycle, Factory, Truck } from 'lucide-react';
import MSILTab from './tabs/MSILTab';
import RVSFTab from './tabs/RVSFTab';
import RecyclersTab from './tabs/RecyclersTab';
import SuppliersTab from './tabs/SuppliersTab';
import DashboardHeader from './DashboardHeader';
import DataValidationBanner from './DataValidationBanner';
import { FilterState, defaultFilters } from '@/data/dashboardData';
import { Leaf } from 'lucide-react';

const Dashboard = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeTab, setActiveTab] = useState('msil');
  const [isLoading, setIsLoading] = useState(false);
  const [customTargets, setCustomTargets] = useState<{ material: string; fy: string; unit: string; target: number }[]>([]);

  const handleSaveTarget = useCallback((target: { material: string; fy: string; unit: string; target: number }) => {
    setCustomTargets(prev => [...prev, target]);
    notification.success({
      message: 'Target Set Successfully',
      description: `Target for ${target.material} has been updated for ${target.fy}.`,
      placement: 'topRight',
      className: '!bg-emerald-50 !border-emerald-200',
      style: { border: '1px solid #a7f3d0', borderRadius: '12px' },
      icon: <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center -ml-2"><Leaf className="w-4 h-4 text-emerald-600" /></div>,
      duration: 4,
    });
  }, []);

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
      children: <MSILTab isLoading={isLoading} filters={filters} customTargets={customTargets} />,
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
        <DashboardHeader filters={filters} onFilterChange={handleFilterChange} activeTab={activeTab} customTargets={customTargets} onSaveTarget={handleSaveTarget} />

        <div className="px-6 py-6">
          {/* Data Validation Banner */}
          <DataValidationBanner className="mb-4" />
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

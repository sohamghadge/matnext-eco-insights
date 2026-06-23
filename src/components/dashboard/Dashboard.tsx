/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react';
import { Tabs, ConfigProvider, notification } from 'antd';
import { Building2, Recycle, Factory, Truck, Flame, BarChart2, GitBranch } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import MSILTab from './tabs/MSILTab';
import RVSFTab from './tabs/RVSFTab';
import RecyclersTab from './tabs/RecyclersTab';
import SuppliersTab from './tabs/SuppliersTab';
import ELVHotspotTab from './tabs/ELVHotspotTab';
import OEMCompetitorTab from './tabs/OEMCompetitorTab';
import PartsTraceTab from './tabs/parts-trace/PartsTraceTab';
import DashboardHeader from './DashboardHeader';
import DataValidationBanner from './DataValidationBanner';
import { FilterState, defaultFilters } from '@/data/dashboardData';
import { Leaf } from 'lucide-react';
import { getFiscalYears, getMaterialTileData, getMaterialType, MaterialFiscalYearTargetPayload, MaterialTileResp, setMaterialTargetApi, type FiscalYearItem, type SetMaterialTargetResponse, type TagsResponse } from '@/services/dashboardApi';
import { formatDateToDDMMYYYY } from '@/utils/dayjs';
import { useAuthStore } from '@/stores/authStore';
import type { TargetEntry } from './TargetsModal';

const getFiscalYearDateRange = (fiscalYear: string | number | null) => {
  if (fiscalYear === null || fiscalYear === undefined || fiscalYear === '') {
    return null;
  }

  const startYear = Number(fiscalYear);
  if (Number.isNaN(startYear)) {
    return null;
  }

  return {
    dateFrom: new Date(startYear, 3, 1),
    dateTo: new Date(startYear + 1, 2, 31),
  };
};

const Dashboard = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeTab, setActiveTab] = useState('msil');
  const [isLoading, setIsLoading] = useState(false);
  const [customTargets, setCustomTargets] = useState<TargetEntry[]>([]);
  const [materialOptions, setMaterialOptions] = useState<TagsResponse>({})
  const [materialTiles, setMaterialTiles] = useState<MaterialTileResp>({});
  const [fiscalYearOptions, setFiscalYearOptions] = useState<FiscalYearItem[]>([]);
  const [fiscalYearLoading, setFiscalYearLoading] = useState(false);
  const token = useAuthStore((state) => state.token);
  const userData = useAuthStore((state) => state.userData);

  const materialTypeQuery = useQuery({
    queryKey: ['materialTypeTags'],
    queryFn: async () => {
      const response = await getMaterialType({ params: { type: "MATERIAL_TYPE" } });
      if (response?.data) {
        setMaterialOptions(response?.data)
        const defaultMaterials = ["Aluminium", "Copper", "Plastic", "Steel"]
        const filteredMaterials = response.data?.list?.filter(v => defaultMaterials.includes(v?.name ?? ''))
        setFilters((prev) => ({
          ...prev,
          materials: filteredMaterials.map(v => v?.id) || [],
        }))
      }
      return response?.data;
    },
    enabled: Boolean(token),
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (fiscalYearOptions && fiscalYearOptions.length) return
    if (!token) {
      setFiscalYearOptions([]);
      setFiscalYearLoading(false);
      return;
    }

    setFiscalYearLoading(true);
    getFiscalYears()
      .then((response) => {
        const years = response.data?.list ?? [];
        setFiscalYearOptions(years);

        if (years.length > 0) {
          const lastYear = years[years.length - 1]?.year ?? null;
          const dateRange = getFiscalYearDateRange(lastYear);
          setFilters((prev) => ({
            ...prev,
            fiscalYear: lastYear,
            dateFrom: dateRange?.dateFrom ?? prev.dateFrom,
            dateTo: dateRange?.dateTo ?? prev.dateTo,
          }));
        }
      })
      .catch(() => {
        setFiscalYearOptions([]);
      })
      .finally(() => {
        setFiscalYearLoading(false);
      });
  }, [token]);

  const getMaterialTiles = useCallback(() => {
    if (!token || !filters.materials.length) {
      setMaterialTiles({ list: [] });
      return;
    }
    getMaterialTileData({
      params: {
        materialTypeIds: filters.materials.join(","),
        userId: userData?.id,
        fiscalyear: filters.fiscalYear,
        fromDate: formatDateToDDMMYYYY(filters.dateFrom),
        toDate: formatDateToDDMMYYYY(filters.dateTo),
        elvSourced: filters.sourcedFromELV === 'Yes',
      },
    }).then((response: { data: MaterialTileResp, error: null | undefined }) => {
      setMaterialTiles(response.data ? response.data : { list: [] });
    }).catch(() => {
      setMaterialTiles({ list: [] });
    });
  }, [filters, token, userData?.id]);

  useEffect(() => {
    getMaterialTiles()
  }, [getMaterialTiles]);


  const handleSaveTarget = useCallback(async (targetValue: MaterialFiscalYearTargetPayload) => {
    const { materialTypeId, fiscalYear, unit, target } = targetValue
    const payload: MaterialFiscalYearTargetPayload = {
      userId: userData?.id,
      materialTypeId,
      fiscalYear,
      unit,
      target
    }
    await setMaterialTargetApi(payload)
      .then((response: SetMaterialTargetResponse) => {
        if (response.data) {
          getMaterialTiles()
          notification.success({
            message: 'Target Set Successfully',
            description: `Target for ${response.data.materialTypeName} has been updated for ${fiscalYear}.`,
            placement: 'topRight',
            className: '!bg-emerald-50 !border-emerald-200',
            style: { border: '1px solid #a7f3d0', borderRadius: '12px' },
            icon: <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center -ml-2"><Leaf className="w-4 h-4 text-emerald-600" /></div>,
            duration: 4,
          });
        } else {
          notification.error({
            message: 'Target not added',
            placement: 'topRight',
            duration: 4,
          });
        }
      }).catch(() => {
        notification.error({
          message: 'Target not added',
          placement: 'topRight',
          duration: 4,
        });
      });
  }, [getMaterialTiles, userData?.id]);

  const handleFilterChange = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setIsLoading(true);
    setFilters((prev) => {
      if (key === 'fiscalYear') {
        const dateRange = getFiscalYearDateRange(value as FilterState['fiscalYear']);

        return {
          ...prev,
          fiscalYear: value as FilterState['fiscalYear'],
          dateFrom: dateRange?.dateFrom ?? prev.dateFrom,
          dateTo: dateRange?.dateTo ?? prev.dateTo,
        };
      }

      return { ...prev, [key]: value };
    });

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
      children: <MSILTab isLoading={isLoading} filters={filters} customTargets={customTargets} materialTiles={materialTiles} />,
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
    {
      key: 'elv-hotspot',
      label: (
        <span className="flex items-center gap-2">
          <Flame className="w-4 h-4" />
          ELV Hotspot Analysis
        </span>
      ),
      children: <ELVHotspotTab isLoading={isLoading} />,
    },
    {
      key: 'oem-competitor',
      label: (
        <span className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4" />
          OEM Competitor Analysis
        </span>
      ),
      children: <OEMCompetitorTab isLoading={isLoading} />,
    },
    {
      key: 'parts-trace',
      label: (
        <span className="flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          Parts Trace
        </span>
      ),
      children: <PartsTraceTab />,
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
        <DashboardHeader
          filters={filters}
          onFilterChange={handleFilterChange}
          activeTab={activeTab}
          customTargets={customTargets}
          onSaveTarget={handleSaveTarget}
          onTargetUpdated={getMaterialTiles}
          fiscalYearOptions={fiscalYearOptions}
          fiscalYearLoading={fiscalYearLoading}
          materialOptions={materialOptions?.list || []}
          materialOptionsLoading={materialTypeQuery.isLoading}
          materialTiles={materialTiles}
        />

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

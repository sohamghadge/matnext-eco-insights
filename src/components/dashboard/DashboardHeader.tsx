import { Select, Space } from 'antd';
import { Leaf, Bell, Globe } from 'lucide-react';
import { FilterState, filterOptions } from '@/data/dashboardData';

interface DashboardHeaderProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
}

const DashboardHeader = ({ filters, onFilterChange }: DashboardHeaderProps) => {
  return (
    <header className="dashboard-header sticky top-0 z-50 shadow-lg">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">MATNEXT</h1>
            <p className="text-xs text-white/70">Sustainability Analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
            <Bell className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
            <Globe className="w-4 h-4 text-white" />
            <span className="text-sm text-white">English</span>
          </div>
          <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            MN
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass px-6 py-4">
        <div className="flex flex-wrap items-end gap-6">
          {/* Year Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-primary font-semibold opacity-70">
              Fiscal Year
            </label>
            <Select
              value={filters.year}
              onChange={(value) => onFilterChange('year', value)}
              style={{ width: 120 }}
              options={filterOptions.years.map(y => ({ value: y, label: y }))}
              className="filter-select"
            />
          </div>

          {/* Month Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-primary font-semibold opacity-70">
              Month
            </label>
            <Select
              value={filters.month}
              onChange={(value) => onFilterChange('month', value)}
              style={{ width: 100 }}
              options={filterOptions.months.map(m => ({ value: m, label: m }))}
            />
          </div>

          {/* Plant Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-primary font-semibold opacity-70">
              Plant
            </label>
            <Select
              value={filters.plant}
              onChange={(value) => onFilterChange('plant', value)}
              style={{ width: 130 }}
              options={filterOptions.plants.map(p => ({ value: p, label: p }))}
            />
          </div>

          {/* Target Market Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-primary font-semibold opacity-70">
              Target Market
            </label>
            <Select
              value={filters.targetMarket}
              onChange={(value) => onFilterChange('targetMarket', value)}
              style={{ width: 130 }}
              options={filterOptions.targetMarkets.map(t => ({ value: t, label: t }))}
            />
          </div>

          {/* Sourced from ELV Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-primary font-semibold opacity-70">
              Sourced from ELV
            </label>
            <Select
              value={filters.sourcedFromELV}
              onChange={(value) => onFilterChange('sourcedFromELV', value)}
              style={{ width: 100 }}
              options={filterOptions.sourcedFromELV.map(s => ({ value: s, label: s }))}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

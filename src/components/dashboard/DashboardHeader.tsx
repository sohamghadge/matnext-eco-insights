import { useState } from 'react';
import { Select, DatePicker, Tag, Button } from 'antd';
import { Leaf, Bell, Globe, Settings, Eye } from 'lucide-react';
import { FilterState, filterOptions } from '@/data/dashboardData';
import { SetTargetsModal, ViewTargetsModal } from './TargetsModal';
import dayjs, { Dayjs } from 'dayjs';

interface DashboardHeaderProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string | string[] | Date) => void;
}

const DashboardHeader = ({ filters, onFilterChange }: DashboardHeaderProps) => {
  const [setTargetsOpen, setSetTargetsOpen] = useState(false);
  const [viewTargetsOpen, setViewTargetsOpen] = useState(false);
  const [customTargets, setCustomTargets] = useState<{ material: string; fy: string; unit: string; target: number }[]>([]);

  const handleDateChange = (key: 'dateFrom' | 'dateTo', date: Dayjs | null) => {
    if (date) {
      onFilterChange(key, date.toDate());
    }
  };

  const handleSaveTarget = (target: { material: string; fy: string; unit: string; target: number }) => {
    setCustomTargets(prev => [...prev, target]);
  };

  return (
    <>
      <header className="dashboard-header sticky top-0 z-50 shadow-lg">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Welcome Maruti Suzuki India Limited (MSIL)</h1>
              <p className="text-xs text-white/70">Sustainability Analytics Dashboard</p>
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

        {/* Filter Bar - Row 1 */}
        <div className="glass px-6 py-4">
          <div className="flex flex-wrap items-end gap-4">
            {/* Custom Date From */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-primary font-semibold opacity-70">
                Custom Date From
              </label>
              <DatePicker
                value={dayjs(filters.dateFrom)}
                onChange={(date) => handleDateChange('dateFrom', date)}
                format="YYYY/MM/DD"
                style={{ width: 140 }}
                allowClear={false}
              />
            </div>

            {/* Custom Date To */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-primary font-semibold opacity-70">
                Custom Date To
              </label>
              <DatePicker
                value={dayjs(filters.dateTo)}
                onChange={(date) => handleDateChange('dateTo', date)}
                format="YYYY/MM/DD"
                style={{ width: 140 }}
                allowClear={false}
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
          </div>

          {/* Filter Bar - Row 2: Material Selection */}
          <div className="flex flex-wrap items-end gap-4 mt-4">
            <div className="flex flex-col gap-1.5 flex-grow">
              <label className="text-[10px] uppercase tracking-wider text-primary font-semibold opacity-70">
                Select Material
              </label>
              <Select
                mode="multiple"
                value={filters.materials}
                onChange={(value) => onFilterChange('materials', value)}
                style={{ minWidth: 400, maxWidth: '100%' }}
                maxTagCount={3}
                maxTagTextLength={12}
                placeholder="Select materials..."
                options={filterOptions.allMaterials.map(m => ({ value: m, label: m }))}
                tagRender={(props) => (
                  <Tag 
                    closable={props.closable} 
                    onClose={props.onClose}
                    style={{ marginRight: 3, background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981', color: '#10b981' }}
                  >
                    {props.label}
                  </Tag>
                )}
              />
            </div>
            
            <Button 
              type="primary" 
              icon={<Settings className="w-4 h-4" />}
              className="bg-[#4b6043] hover:bg-[#5a7350]"
              onClick={() => setSetTargetsOpen(true)}
            >
              Set Targets
            </Button>

            <Button 
              type="default" 
              icon={<Eye className="w-4 h-4" />}
              onClick={() => setViewTargetsOpen(true)}
            >
              View Targets
            </Button>
          </div>
        </div>
      </header>

      {/* Modals */}
      <SetTargetsModal
        open={setTargetsOpen}
        onClose={() => setSetTargetsOpen(false)}
        onSave={handleSaveTarget}
      />
      <ViewTargetsModal
        open={viewTargetsOpen}
        onClose={() => setViewTargetsOpen(false)}
        customTargets={customTargets}
      />
    </>
  );
};

export default DashboardHeader;

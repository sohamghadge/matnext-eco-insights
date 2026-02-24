import { useState } from 'react';
import { Select, DatePicker, Tag, Button } from 'antd';
import { Settings, Eye, Download } from 'lucide-react';
import { FilterState, filterOptions } from '@/data/dashboardData';
import { SetTargetsModal, ViewTargetsModal } from './TargetsModal';
import dayjs, { Dayjs } from 'dayjs';

interface DashboardHeaderProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string | string[] | Date) => void;
  activeTab?: string;
  customTargets: { material: string; fy: string; unit: string; target: number }[];
  onSaveTarget: (target: { material: string; fy: string; unit: string; target: number }) => void;
}

const DashboardHeader = ({ filters, onFilterChange, activeTab, customTargets, onSaveTarget }: DashboardHeaderProps) => {
  const [setTargetsOpen, setSetTargetsOpen] = useState(false);
  const [viewTargetsOpen, setViewTargetsOpen] = useState(false);

  const handleDateChange = (key: 'dateFrom' | 'dateTo', date: Dayjs | null) => {
    if (date) {
      onFilterChange(key, date.toDate());
    }
  };

  return (
    <>
      <header className="dashboard-header sticky top-0 z-50 shadow-lg">
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

            {activeTab === 'msil' && (
              <>
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
                <Button
                  type="default"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => {
                    import('@/utils/exportUtils').then(mod => {
                      mod.exportToCSV(
                        [{ 'Export': 'Dashboard data exported with current filters applied', 'Date': new Date().toISOString(), 'Plant': filters.plant, 'Market': filters.targetMarket }],
                        'Dashboard_Export',
                        filters
                      );
                    });
                  }}
                >
                  Export
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <SetTargetsModal
        open={setTargetsOpen}
        onClose={() => setSetTargetsOpen(false)}
        onSave={onSaveTarget}
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

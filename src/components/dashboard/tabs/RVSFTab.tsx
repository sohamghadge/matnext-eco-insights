import { useState } from 'react';
import { DatePicker, Select, Button, Table, Tag, Skeleton, Divider } from 'antd';
import { RefreshCw, ExternalLink, MapPin, Lightbulb, Link2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import dayjs from 'dayjs';
import IndiaMap from '../IndiaMap';
import {
  FilterState,
  rvsfFilterOptions,
  rvsfSummaryStats,
  scrapDispatchDetails,
  msilComponentsDispatchDetails,
  monthwiseCDData,
  msilTestVehiclesData,
  fixedTargets,
  rvsfAIInsights,
  steelEPRCreditsStatus,
} from '@/data/dashboardData';

interface RVSFTabProps {
  isLoading: boolean;
  filters: FilterState;
}

const RVSFTab = ({ isLoading, filters: _filters }: RVSFTabProps) => {
  const [dateFrom, setDateFrom] = useState(dayjs('2025-01-01'));
  const [dateTo, setDateTo] = useState(dayjs('2025-12-31'));
  const [elvMake, setElvMake] = useState('Maruti Suzuki');
  const [makeYear, setMakeYear] = useState('2005-06');
  const [source, setSource] = useState('Collection Center');

  // Fixed Targets Table Columns
  const targetColumns = [
    {
      title: 'Target Year',
      dataIndex: 'targetYear',
      key: 'targetYear',
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'Target Vehicles Scrapped',
      dataIndex: 'targetVehiclesScrapped',
      key: 'targetVehiclesScrapped',
      render: (value: number) => <span className="font-semibold text-primary">{value.toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Target Weight Scrapped',
      dataIndex: 'targetWeightScrapped',
      key: 'targetWeightScrapped',
      render: (text: string) => <span className="font-semibold text-accent">{text}</span>,
    },
  ];



  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Filter Bar */}
      <div className="bg-card rounded-xl p-4 shadow-card border border-border">
        <div className="flex flex-wrap items-end gap-4">
          {/* From Date */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">From</label>
            <DatePicker
              value={dateFrom}
              onChange={(date) => date && setDateFrom(date)}
              format="DD-MMM-YYYY"
              style={{ width: 130 }}
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Upto</label>
            <DatePicker
              value={dateTo}
              onChange={(date) => date && setDateTo(date)}
              format="DD-MMM-YYYY"
              style={{ width: 130 }}
            />
          </div>

          {/* ELV Make */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">ELV Make</label>
            <Select
              value={elvMake}
              onChange={setElvMake}
              style={{ width: 140 }}
              options={rvsfFilterOptions.elvMakes.map(m => ({ value: m, label: m }))}
            />
          </div>

          {/* Make Year */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Make Year</label>
            <Select
              value={makeYear}
              onChange={setMakeYear}
              style={{ width: 100 }}
              options={rvsfFilterOptions.makeYears.map(y => ({ value: y, label: y }))}
            />
          </div>

          {/* Source Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Source</label>
            <Select
              value={source}
              onChange={setSource}
              style={{ width: 150 }}
              options={rvsfFilterOptions.sources.map(s => ({ value: s, label: s }))}
            />
          </div>

          <Button icon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>

          <Button
            type="primary"
            className="bg-[#4b6043] hover:bg-[#5a7350]"
            icon={<ExternalLink className="w-4 h-4" />}
            onClick={() => window.open('https://vscrap.parivahan.gov.in/vehiclescrap/vahan/welcome.xhtml', '_blank')}
          >
            ESG Reporting
          </Button>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Card - Vehicle Stats */}
        <div className="bg-emerald-50 border-2 border-emerald-600 rounded-xl p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-800">No. of Vehicles Scrapped =</span>
              <span className="font-bold text-emerald-700">{rvsfSummaryStats.vehiclesScrapped.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-800">Inventory (MT/kg/Nos.) =</span>
              <span className="font-bold text-emerald-700">{rvsfSummaryStats.inventory.value.toLocaleString()} {rvsfSummaryStats.inventory.unit}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-800">No. of COD generated =</span>
              <span className="font-bold text-emerald-700">{rvsfSummaryStats.codGenerated.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-800">No. of MSIL Test Vehicles Scrapped =</span>
              <span className="font-bold text-emerald-700">{rvsfSummaryStats.msilTestVehiclesScrapped.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-800">No. of collection centres (tab - state wise)</span>
              <span className="font-bold text-emerald-700">{rvsfSummaryStats.collectionCentres}</span>
            </div>
          </div>
        </div>

        {/* Center Card - Scrap Dispatch Details */}
        <div className="bg-blue-50 border-2 border-blue-600 rounded-xl p-4">
          <h4 className="font-semibold text-blue-800 underline mb-3">Scrap Dispatch Details:</h4>
          <div className="space-y-2">
            {scrapDispatchDetails.map((item) => (
              <div key={item.material} className="flex justify-between items-center">
                <span className="text-sm text-blue-800">{item.material} ({item.unit}) =</span>
                <span className="font-bold text-blue-700">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card - MSIL Components Dispatch Details */}
        <div className="bg-amber-50 border-2 border-amber-600 rounded-xl p-4">
          <h4 className="font-semibold text-amber-800 underline mb-3">MSIL Components Dispatch Details:</h4>
          <div className="space-y-2">
            {msilComponentsDispatchDetails.map((item) => (
              <div key={item.material} className="flex justify-between items-center">
                <span className="text-sm text-amber-800">{item.material} ({item.unit}) =</span>
                <span className="font-bold text-amber-700">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthwise CD Generated Chart */}
        <div className="bg-card rounded-xl p-5 shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary underline">Monthwise CD Generated</h3>
            <Tag color="default">undefined</Tag>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthwiseCDData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  domain={[0, 900]}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value} nos`, 'CD Generated']}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {monthwiseCDData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <a
            href="https://vscrap.parivahan.gov.in/vehiclescrap/vahan/welcome.xhtml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2"
          >
            <ExternalLink className="w-3 h-3" />
            https://vscrap.parivahan.gov.in/vehiclescrap/vahan/welcome.xhtml
          </a>
        </div>

        {/* MSIL Test Vehicles Scrapped Chart */}
        <div className="bg-card rounded-xl p-5 shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary underline">MSIL Test Vehicles Scrapped</h3>
            <Tag color="default">undefined</Tag>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={msilTestVehiclesData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  domain={[0, 900]}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value} nos`, 'Vehicles Scrapped']}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {msilTestVehiclesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Steel EPR Credits Section */}
      <div className="bg-yellow-50 border-2 border-yellow-500 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-red-600">Steel EPR credits generated (MT) =</span>
            <span className="font-bold text-lg text-red-700">{steelEPRCreditsStatus.creditsGenerated}</span>
          </div>
          <span className="text-sm text-gray-600 italic">(currently to be linked with RVSF steel dispatch volume (MT))</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-red-600 italic font-medium">Linking with CPCB portal</span>
          <a
            href={steelEPRCreditsStatus.cpcbPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            <Link2 className="w-4 h-4" />
            CPCB Portal
          </a>
        </div>
      </div>

      <Divider />

      {/* Fixed Targets Section */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold text-foreground">Fixed Targets</h3>
          <Tag color="blue">View Only</Tag>
        </div>
        <Table
          columns={targetColumns}
          dataSource={fixedTargets.map((item, i) => ({ ...item, key: i }))}
          pagination={false}
          size="middle"
          bordered
        />
      </div>

      {/* India Map Section */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">RVSF Dashboard - Vehicle Origin Map</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Showing density of where vehicles are coming from across India
        </p>
        <IndiaMap />
      </div>

      <Divider />

      {/* AI Insights Section */}
      <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-5 shadow-card border border-indigo-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
            <p className="text-sm text-muted-foreground">AI suggestions to meet targets</p>
          </div>
        </div>

        <div className="space-y-3">
          {rvsfAIInsights.map((insight) => (
            <div
              key={insight.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${insight.impact === 'high'
                ? 'bg-green-50 border-green-200'
                : insight.impact === 'medium'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-gray-50 border-gray-200'
                }`}
            >
              <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 shadow-sm">
                {insight.id}
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{insight.suggestion}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Tag
                    color={insight.impact === 'high' ? 'green' : insight.impact === 'medium' ? 'gold' : 'default'}
                    className="text-xs"
                  >
                    {insight.impact.toUpperCase()} IMPACT
                  </Tag>
                  <Tag color="blue" className="text-xs">{insight.category}</Tag>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RVSFTab;

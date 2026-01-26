import { useEffect, useState } from 'react';
import { Badge, Skeleton, Statistic, Table, Tag, Divider, Button, Space } from 'antd';
import { Link2, Shield, RefreshCw, Zap, CheckCircle, Clock, ExternalLink, Download, FileSpreadsheet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { eprCreditData, portalIntegrations, eprTrendData, FilterState, getFinancialYear } from '@/data/dashboardData';
import { exportToCSV, exportToExcel, prepareEPRDataForExport } from '@/utils/exportUtils';

interface RVSFTabProps {
  isLoading: boolean;
  filters: FilterState;
}

const RVSFTab = ({ isLoading, filters }: RVSFTabProps) => {
  const [displayCredits, setDisplayCredits] = useState(0);
  const financialYear = getFinancialYear(filters.dateFrom);
  
  // Filter EPR data based on selected materials
  const filteredEPRData = filters.materials.length > 0 
    ? eprCreditData.filter(m => filters.materials.includes(m.material))
    : eprCreditData;
    
  const totalCredits = filteredEPRData.reduce((sum, item) => sum + item.creditsGenerated, 0);

  // Animate the counter
  useEffect(() => {
    if (isLoading) return;

    const target = totalCredits;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayCredits(target);
        clearInterval(timer);
      } else {
        setDisplayCredits(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isLoading, totalCredits]);

  // EPR Credits Table Columns with additional columns
  const eprColumns = [
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'EPR Credits Generated',
      dataIndex: 'creditsGenerated',
      key: 'creditsGenerated',
      render: (value: number) => (
        <span className="text-accent font-semibold">{value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      ),
    },
    {
      title: 'Dispatch Volume',
      dataIndex: 'dispatchVolume',
      key: 'dispatchVolume',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Credit Ratio',
      dataIndex: 'creditsGenerated',
      key: 'ratio',
      render: (credits: number, record: typeof eprCreditData[0]) => {
        const ratio = (credits / record.dispatchVolume) * 100;
        return (
          <Tag color={ratio >= 90 ? 'success' : ratio >= 80 ? 'warning' : 'error'}>
            {ratio.toFixed(1)}%
          </Tag>
        );
      },
    },
    {
      title: 'Target Market',
      dataIndex: 'targetMarket',
      key: 'targetMarket',
    },
    {
      title: 'Financial Year',
      dataIndex: 'financialYear',
      key: 'financialYear',
    },
    {
      title: 'Plant',
      dataIndex: 'plant',
      key: 'plant',
    },
    {
      title: 'Sourced from ELV',
      dataIndex: 'sourcedFromELV',
      key: 'sourcedFromELV',
      render: (value: string) => (
        <Tag color={value === 'Yes' ? 'green' : 'default'}>{value}</Tag>
      ),
    },
  ];

  // Portal Integration Columns
  const portalColumns = [
    {
      title: 'Portal Name',
      dataIndex: 'portalName',
      key: 'portalName',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'linked' ? 'success' : status === 'pending' ? 'warning' : 'error'} className="flex items-center gap-1 w-fit">
          {status === 'linked' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Last Sync',
      dataIndex: 'lastSync',
      key: 'lastSync',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Action',
      dataIndex: 'url',
      key: 'action',
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
          View Portal <ExternalLink className="w-3 h-3" />
        </a>
      ),
    },
  ];

  // Chart data for EPR by material
  const barChartData = filteredEPRData.map(item => ({
    name: item.material,
    'Credits Generated': item.creditsGenerated,
    'Dispatch Volume': item.dispatchVolume,
  }));

  // Export handlers
  const handleExportCSV = () => {
    const data = prepareEPRDataForExport(filteredEPRData);
    exportToCSV(data, 'RVSF_EPR_Credits', filters);
  };

  const handleExportExcel = () => {
    exportToExcel(
      [
        { name: 'EPR Credits by Material', data: prepareEPRDataForExport(filteredEPRData) },
        { name: 'Portal Integrations', data: portalIntegrations.map(p => ({
          'Portal Name': p.portalName,
          'Status': p.status,
          'Last Sync': p.lastSync,
          'URL': p.url,
        })) },
      ],
      'RVSF_Scrapping_EPR',
      filters
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Title with Export Buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">RVSFs Overview - Scrapping & EPR</h2>
          <p className="text-sm text-muted-foreground">
            End-of-life vehicle processing and EPR credit generation • FY {financialYear}
          </p>
        </div>
        <Space>
          <Button 
            icon={<Download className="w-4 h-4" />} 
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button 
            type="primary"
            icon={<FileSpreadsheet className="w-4 h-4" />} 
            onClick={handleExportExcel}
            className="bg-[#4b6043] hover:bg-[#5a7350]"
          >
            Export XLSX
          </Button>
        </Space>
      </div>

      {/* Main EPR Credit Generator Widget */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary rounded-2xl p-8 shadow-card border border-primary/20">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">EPR Credit Generator</h3>
              <p className="text-sm text-muted-foreground">Real-time credit accumulation</p>
            </div>
          </div>
          <Badge status="processing" text="Live" className="animate-pulse" />
        </div>

        <div className="text-center py-6">
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
            Total EPR Credits Generated
          </p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl font-bold text-primary tabular-nums animate-counter">
              {displayCredits.toLocaleString('en-IN', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </span>
            <span className="text-2xl font-medium text-muted-foreground">MT</span>
          </div>
        </div>

        {/* Connection indicator */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4 text-muted-foreground animate-spin" style={{ animationDuration: '3s' }} />
          <span className="text-muted-foreground">Syncing with RVSF dispatch volume</span>
        </div>
      </div>

      {/* EPR Credits by Material - Chart + Table */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">EPR Credits by Material Type</h3>
        
        {/* Bar Chart */}
        <div className="h-[300px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Bar dataKey="Dispatch Volume" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Credits Generated" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <Table
          columns={eprColumns}
          dataSource={filteredEPRData.map((item, i) => ({ ...item, key: i }))}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} materials` }}
          size="middle"
          scroll={{ x: 1200 }}
        />
      </div>

      {/* EPR Credit Trend */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">EPR Credit Generation Trend (FY {financialYear})</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={eprTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value.toLocaleString()} MT`, 'Credits']}
              />
              <Area 
                type="monotone" 
                dataKey="credits" 
                stroke="hsl(var(--accent))" 
                fill="hsl(var(--accent) / 0.2)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Divider />

      {/* Portal Integration Section */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Portal Integration Status</h3>
            <p className="text-sm text-muted-foreground">Connected regulatory systems</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="pulse-dot" />
            <span className="text-sm text-accent font-medium">All Systems Linked</span>
          </div>
        </div>

        <Table
          columns={portalColumns}
          dataSource={portalIntegrations.map((item, i) => ({ ...item, key: i }))}
          pagination={false}
          size="middle"
        />
      </div>
    </div>
  );
};

export default RVSFTab;

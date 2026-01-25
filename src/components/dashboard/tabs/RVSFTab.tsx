import { useEffect, useState } from 'react';
import { Badge, Skeleton, Card, Statistic, Table, Tag, Divider } from 'antd';
import { Link2, Shield, RefreshCw, Zap, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { eprCreditData, portalIntegrations, eprTrendData } from '@/data/dashboardData';

interface RVSFTabProps {
  isLoading: boolean;
}

const RVSFTab = ({ isLoading }: RVSFTabProps) => {
  const [displayCredits, setDisplayCredits] = useState(0);
  const totalCredits = eprCreditData.reduce((sum, item) => sum + item.creditsGenerated, 0);

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

  // EPR Credits Table Columns
  const eprColumns = [
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'EPR Credits Generated (MT)',
      dataIndex: 'creditsGenerated',
      key: 'creditsGenerated',
      render: (value: number) => (
        <span className="text-accent font-semibold">{value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      ),
    },
    {
      title: 'Dispatch Volume (MT)',
      dataIndex: 'dispatchVolume',
      key: 'dispatchVolume',
      render: (value: number) => value.toLocaleString(),
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
  const barChartData = eprCreditData.map(item => ({
    name: item.material,
    'Credits Generated': item.creditsGenerated,
    'Dispatch Volume': item.dispatchVolume,
  }));

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">RVSF - Scrapping & EPR</h2>
        <p className="text-sm text-muted-foreground">End-of-life vehicle processing and EPR credit generation</p>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="Dispatch Volume" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Credits Generated" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div>
            <Table
              columns={eprColumns}
              dataSource={eprCreditData.map((item, i) => ({ ...item, key: i }))}
              pagination={false}
              size="middle"
            />
          </div>
        </div>
      </div>

      {/* EPR Credit Trend */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">EPR Credit Generation Trend (FY 2025-26)</h3>
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

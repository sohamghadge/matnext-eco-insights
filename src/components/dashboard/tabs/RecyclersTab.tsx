import { Skeleton, Statistic, Progress } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Recycle, ArrowRight } from 'lucide-react';
import { plasticBreakdown, recyclerStats } from '@/data/dashboardData';

interface RecyclersTabProps {
  isLoading: boolean;
}

const RecyclersTab = ({ isLoading }: RecyclersTabProps) => {
  const pieData = plasticBreakdown.map(item => ({
    name: item.type,
    value: item.quantity,
    color: item.color,
  }));

  const recycleRatio = (recyclerStats.recycledOutput / recyclerStats.totalInput) * 100;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Material Processing (Recyclers)</h2>
        <p className="text-sm text-muted-foreground">Plastic breakdown and recycling efficiency metrics</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Plastic Breakdown */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-6">Plastic Material Breakdown</h3>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${value} MT`}
                  labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} MT`, 'Quantity']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm text-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend with values */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
            {plasticBreakdown.map((item) => (
              <div key={item.type} className="text-center">
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-xs text-muted-foreground">{item.type}</p>
                <p className="text-lg font-semibold">{item.quantity} MT</p>
              </div>
            ))}
          </div>
        </div>

        {/* Input vs Output Comparison */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-6">Total Input vs Recycled Output</h3>

          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-secondary/50 rounded-xl">
                <Statistic
                  title={<span className="text-muted-foreground">Total Material Supplied</span>}
                  value={recyclerStats.totalSupplied}
                  suffix="MT"
                  valueStyle={{ color: 'hsl(var(--foreground))', fontWeight: 700 }}
                />
              </div>
              <div className="text-center p-4 bg-accent/10 rounded-xl">
                <Statistic
                  title={<span className="text-muted-foreground">Recycled Material Weight</span>}
                  value={recyclerStats.recycledWeight}
                  suffix="MT"
                  valueStyle={{ color: 'hsl(var(--accent))', fontWeight: 700 }}
                />
              </div>
            </div>

            {/* Visual Flow */}
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold">{recyclerStats.totalInput}</span>
                </div>
                <p className="text-xs text-muted-foreground">Input (MT)</p>
              </div>
              
              <div className="flex items-center gap-2">
                <ArrowRight className="w-8 h-8 text-accent" />
                <Recycle className="w-10 h-10 text-accent animate-spin" style={{ animationDuration: '8s' }} />
                <ArrowRight className="w-8 h-8 text-accent" />
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-accent">{recyclerStats.recycledOutput}</span>
                </div>
                <p className="text-xs text-muted-foreground">Output (MT)</p>
              </div>
            </div>

            {/* Recycling Efficiency */}
            <div className="p-4 bg-secondary/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Recycling Efficiency</span>
                <span className="text-lg font-bold text-accent">{recycleRatio.toFixed(1)}%</span>
              </div>
              <Progress
                percent={recycleRatio}
                strokeColor={{
                  '0%': '#10b981',
                  '100%': '#059669',
                }}
                trailColor="hsl(var(--muted))"
                showInfo={false}
                strokeWidth={12}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecyclersTab;

import { useEffect, useState } from 'react';
import { Badge, Skeleton, Card, Statistic } from 'antd';
import { Link2, Shield, RefreshCw, Zap } from 'lucide-react';
import { eprData } from '@/data/dashboardData';

interface RVSFTabProps {
  isLoading: boolean;
}

const RVSFTab = ({ isLoading }: RVSFTabProps) => {
  const [displayCredits, setDisplayCredits] = useState(0);

  // Animate the counter
  useEffect(() => {
    if (isLoading) return;

    const target = eprData.steelCredits;
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
  }, [isLoading]);

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

        <div className="text-center py-8">
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
            Steel EPR Credits Generated
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
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {new Date(eprData.lastSync).toLocaleString()}
          </p>
        </div>

        {/* Connection indicator */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4 text-muted-foreground animate-spin" style={{ animationDuration: '3s' }} />
          <span className="text-muted-foreground">Syncing with RVSF dispatch volume</span>
        </div>
      </div>

      {/* Compliance Badge Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-card border-0 bg-card">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              {/* Pulsing dot */}
              <div className="absolute -top-1 -right-1 pulse-dot" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground">Compliance Status</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                  <Link2 className="w-3 h-3 mr-1" />
                  Linked with CPCB Portal
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Connection verified • No action required
              </p>
            </div>
          </div>
        </Card>

        <Card className="shadow-card border-0 bg-card">
          <Statistic
            title="VAHAN Portal Integration"
            value="Active"
            prefix={<Link2 className="w-4 h-4 text-emerald-600" />}
            valueStyle={{ color: '#10b981', fontWeight: 600 }}
          />
          <p className="text-xs text-muted-foreground mt-3">
            Voluntary Vehicle Scrapper system integration active
          </p>
          <a 
            href="https://vscrap.parivahan.gov.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline mt-2 inline-block"
          >
            View VAHAN Dashboard →
          </a>
        </Card>
      </div>
    </div>
  );
};

export default RVSFTab;

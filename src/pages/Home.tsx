import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import {
  UserCircle,
  Building,
  Recycle,
  Factory,
  Store,
  Wrench,
  HardHat,
  Car,
  Truck,
  ClipboardList,
  Package,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickActionCardProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

const QuickActionCard = ({ icon, label, to }: QuickActionCardProps) => (
  <Link
    to={to}
    className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-lg transition-colors"
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

const Home = () => {
  return (
    <AppLayout title="Welcome Maruti Suzuki India Limited(MSIL)">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Home</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Management */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-primary mb-4 border-l-4 border-primary pl-3">
              User Management
            </h3>
            <div className="space-y-3">
              <QuickActionCard icon={<UserCircle className="w-5 h-5" />} label="Admin" to="/user/admin" />
              <QuickActionCard icon={<Building className="w-5 h-5" />} label="Owner" to="/user/owner" />
              <QuickActionCard icon={<Recycle className="w-5 h-5" />} label="Scrapping Facility" to="/user/scrapping" />
              <QuickActionCard icon={<Factory className="w-5 h-5" />} label="Material Producer" to="/user/material-producer" />
              <QuickActionCard icon={<Store className="w-5 h-5" />} label="Trading Company" to="/user/trading" />
              <QuickActionCard icon={<Wrench className="w-5 h-5" />} label="Part Producer" to="/user/part-producer" />
              <QuickActionCard icon={<HardHat className="w-5 h-5" />} label="Part Producer Technician" to="/user/technician" />
              <QuickActionCard icon={<Car className="w-5 h-5" />} label="Maker" to="/user/maker" />
              <QuickActionCard icon={<Truck className="w-5 h-5" />} label="Transport Contractor" to="/user/transport" />
            </div>
          </Card>

          {/* Material Sales */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-primary mb-4 border-l-4 border-primary pl-3">
              Material Sales (Part Producer)
            </h3>
            <div className="space-y-3">
              <QuickActionCard icon={<ClipboardList className="w-5 h-5" />} label="Material Sales (Part Producer)" to="/material-sales" />
            </div>

            <h3 className="text-lg font-semibold text-primary mb-4 mt-6 border-l-4 border-primary pl-3">
              Part Production
            </h3>
            <div className="space-y-3">
              <QuickActionCard icon={<Package className="w-5 h-5" />} label="Part Production" to="/part-production" />
            </div>

            <h3 className="text-lg font-semibold text-primary mb-4 mt-6 border-l-4 border-primary pl-3">
              Part Sales (Part Producer)
            </h3>
            <div className="space-y-3">
              <QuickActionCard icon={<ClipboardList className="w-5 h-5" />} label="Part Sales (Part Producer)" to="/part-sales" />
            </div>
          </Card>

          {/* Active Jobs */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-primary mb-4 border-l-4 border-primary pl-3">
              Active Jobs
            </h3>
            <div className="space-y-3">
              <QuickActionCard icon={<ClipboardList className="w-5 h-5" />} label="Material Sales (Part Producer)" to="/jobs/material-sales" />
              <QuickActionCard icon={<Package className="w-5 h-5" />} label="Part Production" to="/jobs/part-production" />
              <QuickActionCard icon={<ClipboardList className="w-5 h-5" />} label="Part Sales (Part Producer)" to="/jobs/part-sales" />
              <QuickActionCard icon={<Play className="w-5 h-5" />} label="Part Sales (Producer)" to="/jobs/part-sales-producer" />
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;

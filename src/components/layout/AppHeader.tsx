import { Bell, Globe, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  title?: string;
}

const AppHeader = ({ title = "Welcome FFF Moulding" }: AppHeaderProps) => {
  return (
    <header className="h-14 bg-primary flex items-center justify-between px-6 border-b border-primary/20">
      <h1 className="text-lg font-semibold text-primary-foreground">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
          <Bell className="w-5 h-5" />
        </Button>

        {/* User Profile */}
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
          <div className="w-8 h-8 rounded bg-primary-foreground/20 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </Button>

        {/* Language Selector */}
        <div className="flex items-center gap-2 text-primary-foreground">
          <span className="text-sm font-medium">English</span>
          <Globe className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

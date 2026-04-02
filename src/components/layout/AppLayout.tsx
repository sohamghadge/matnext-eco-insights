import { ReactNode } from 'react';
// Sidebar import preserved - only hidden for isolated dashboard view
// import AppSidebar from './AppSidebar';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar removed for isolated dashboard view - code preserved in AppSidebar.tsx */}
      {/* <AppSidebar /> */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

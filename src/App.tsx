import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import DashboardPage from "./pages/DashboardPage";
import IssueManagement from "./pages/IssueManagement";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useAuthStore, type IframeUserData } from "./stores/authStore";

const queryClient = new QueryClient();

const App = () => {
  const setAuthData = useAuthStore((state) => state.setAuthData);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://stg-matnext-in-uat.genbanext.com") {
        return;
      }

      const { type, token, userData } = event.data as {
        type?: string;
        token?: string | null;
        userData?: IframeUserData | null;
      };

      if (type === 'AUTH_DATA') {
        setAuthData({ token, userData });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setAuthData]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/issues" element={<IssueManagement />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
};

export default App;

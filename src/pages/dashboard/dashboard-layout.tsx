import type { CSSProperties } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { DashboardSidebar } from "./dashboard-sidebar";
import DashboardHeader from "./dashboard-header";

const DashboardLayout = () => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as CSSProperties
      }
    >
      <DashboardSidebar />
      <SidebarInset className="animate-in fade-in duration-500">
        <DashboardHeader />

        {/* react Node Render here! */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;

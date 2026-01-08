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
            <SidebarInset>
                <DashboardHeader />

                {/* react Node Render here! */}
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashboardLayout;
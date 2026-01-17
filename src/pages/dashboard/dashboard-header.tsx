import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DashboardHeader = () => {
  return (
    <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4 backdrop-blur-md bg-opacity-90 transition-all duration-300 animate-in fade-in slide-in-from-top duration-500 z-10">
      <SidebarTrigger className="-ml-1 hover:scale-110 transition-transform duration-200 active:scale-95" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="#">Server</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Inbox</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
};

export default DashboardHeader;

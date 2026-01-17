import { Separator } from "@/components/ui/separator";
import { data } from "@/utils/demo-data";
import { Plus } from "lucide-react";
import React from "react";

const DashboardMobileSidebar = () => {
    const [, setActiveItem] = React.useState(data.navMain[0])
    const [, setMails] = React.useState(data.mails);

    return (
        <aside className="w-15 border-r-1 border-neutral-800 flex flex-col items-center py-3 gap-3 md:hidden sticky left-0 top-0">
            <div className="w-full flex flex-col gap-3 items-center">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-black bg-white">
                    <Plus className="size-4" />
                </div>
                <div className="w-full px-3.5">
                    <Separator orientation="horizontal" className="border-[1.5px]" />
                </div>
            </div>

            <div className="w-full flex flex-col gap-2 items-center">
                {data.navMain.map((m, idx) => (
                    <div key={idx} onClick={() => {
                        setActiveItem(m)
                        const mail = data.mails.sort(() => Math.random() - 0.5)
                        setMails(
                            mail.slice(
                                0,
                                Math.max(5, Math.floor(Math.random() * 10) + 1)
                            )
                        )
                    }} className="flex flex-col gap-3 items-center justify-center size-8 rounded-full bg-neutral-800 ">
                        <m.icon size={16} />
                    </div>
                ))}
            </div>
        </aside>
    )
}

export default DashboardMobileSidebar;
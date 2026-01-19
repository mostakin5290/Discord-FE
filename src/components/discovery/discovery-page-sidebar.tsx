import { Globe, MoveRight, Server, Trophy, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router";

interface DiscoveryOption {
    label: string;
    icon: LucideIcon;
    url: string;
}

const dicoveryOptions: DiscoveryOption[] = [
    {
        label: "Apps",
        icon: Globe,
        url: "/discovery/apps"
    },
    {
        label: "Servers",
        icon: Server,
        url: "/discovery/servers"
    },
    {
        label: "Quests",
        icon: Trophy,
        url: "/discovery/quests"
    },
];

const DiscoveryPageSidebar = () => {
    const pathname = useLocation().pathname.split("/").pop();
    return (
        <div className="hidden md:flex flex-col w-60 glass-sidebar">
            <div className="h-13 flex items-center px-4 font-semibold text-white shadow-sm border-b border-[#202225] hover:bg-[#35373c] transition-all duration-300 cursor-pointer text-[15px] backdrop-blur-sm">
                <div className="text-white font-sans text-[16px] font-medium w-full">Discovery</div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e1f22] scrollbar-track-transparent animate-in fade-in slide-in-from-top duration-500 py-2 font-sans">
                {dicoveryOptions.map((option) => (
                    <Link to={option.url} className={`flex items-center justify-between px-3 py-1 mb-1 text-[14px] font-medium tracking-wider text-[#949ba4] hover:text-[#dbdee1] cursor-pointer group ${pathname === option.url.split("/").pop() ? "bg-[#35373c] text-white" : ""}`} key={option.label}>
                        <div className="flex items-center gap-2">
                            <option.icon size={16} />
                            <span>{option.label}</span>
                        </div>
                        <MoveRight
                            size={16}
                            className="text-[#949ba4] hover:text-[#dbdee1] cursor-pointer group"
                        />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default DiscoveryPageSidebar;
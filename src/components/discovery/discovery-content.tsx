import { Bell, Hash, Search, Inbox, HelpCircle } from 'lucide-react';
import Servers from './servers';
import DiscoverSearch from './discover-search';

const DiscoveryContent = ({ tab }: { tab: string }) => {
    return (
        <div className="flex-1 flex-col glass-panel">
            <div className="h-12 px-4 flex items-center justify-between border-b border-[#202225] shadow-sm bg-[#1a1b1e] w-full">
                <div className="flex items-center">
                    <Hash size={24} className="text-[#949ba4] mr-2" />
                    <h3 className="font-bold text-white text-base">{tab.charAt(0).toUpperCase() + tab.slice(1)}</h3>
                    {/* Optional: Add topic description text here later */}
                </div>

                {/* Header Toolbar */}
                <div className="flex items-center gap-4 text-[#b5bac1]">
                    <Bell
                        size={24}
                        className="cursor-pointer hover:text-[#dbdee1] transition-all duration-200 hover:scale-110 active:scale-95"
                    />

                    {/* Search Bar - Mock */}
                    <DiscoverSearch />

                    <Inbox
                        size={24}
                        className="cursor-pointer hover:text-[#dbdee1] transition-all duration-200 hover:scale-110 active:scale-95"
                    />
                    <HelpCircle
                        size={24}
                        className="cursor-pointer hover:text-[#dbdee1] transition-all duration-200 hover:scale-110 active:scale-95"
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col">
               {tab === "apps" && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white text-base">Apps</h3>
                    </div>
                </div>
               )}
               {tab === "servers" && (
                <Servers />
               )}
               {tab === "quests" && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white text-base">Quests</h3>
                    </div>
                </div>
               )}
            </div>
        </div>
    )
}

export default DiscoveryContent;
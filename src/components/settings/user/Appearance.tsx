import { useState } from "react";
import { Check } from "lucide-react";

const Appearance = () => {
    const [theme, setTheme] = useState<"dark" | "light" | "sync">("dark");
    const [messageDisplay, setMessageDisplay] = useState<"cozy" | "compact">("cozy");
    const [zoomLevel, setZoomLevel] = useState(100);

    return (
        <div className="w-full h-full text-[#b5bac1] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-semibold text-white mb-6">Appearance</h2>
            
            <div className="mb-8">
                 <h3 className="text-xs font-bold text-[#b5bac1] uppercase mb-4">Theme</h3>
                 <div className="text-sm text-[#949ba4] mb-4">Theme preferences are saved automatically? Yes. (Well, in this clone they aren't persisted yet)</div>

                 <div className="flex gap-2">
                     {/* Dark Theme */}
                     <div 
                        className={`flex flex-col gap-2 cursor-pointer group`}
                        onClick={() => setTheme("dark")}
                    >
                         <div className={`w-[130px] h-[96px] bg-[#2f3136] rounded-md border-[2px] ${theme === "dark" ? "border-[#5865f2]" : "border-[#2f3136] group-hover:border-[#b5bac1]"} flex items-center justify-center relative overflow-hidden`}>
                             <div className="absolute top-2 left-2 w-16 h-2 bg-[#202225] rounded-full" />
                             <div className="absolute top-6 left-2 w-24 h-2 bg-[#202225] rounded-full" />
                             <div className="absolute top-10 left-2 w-20 h-2 bg-[#202225] rounded-full" />
                             
                             {theme === "dark" && (
                                 <div className="absolute top-2 right-2 w-6 h-6 bg-[#5865f2] rounded-full flex items-center justify-center">
                                     <Check className="w-4 h-4 text-white" strokeWidth={3} />
                                 </div>
                             )}
                         </div>
                         <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-[#b5bac1]"}`}>Dark</span>
                     </div>

                     {/* Light Theme */}
                     <div 
                        className={`flex flex-col gap-2 cursor-pointer group`}
                         onClick={() => setTheme("light")}
                    >
                         <div className={`w-[130px] h-[96px] bg-[#fff] rounded-md border-[2px] ${theme === "light" ? "border-[#5865f2]" : "border-[#b5bac1]/30 group-hover:border-[#b5bac1]"} flex items-center justify-center relative overflow-hidden`}>
                             <div className="absolute top-2 left-2 w-16 h-2 bg-[#e3e5e8] rounded-full" />
                             <div className="absolute top-6 left-2 w-24 h-2 bg-[#e3e5e8] rounded-full" />
                             <div className="absolute top-10 left-2 w-20 h-2 bg-[#e3e5e8] rounded-full" />

                             {theme === "light" && (
                                 <div className="absolute top-2 right-2 w-6 h-6 bg-[#5865f2] rounded-full flex items-center justify-center">
                                     <Check className="w-4 h-4 text-white" strokeWidth={3} />
                                 </div>
                             )}
                         </div>
                         <span className={`text-sm font-medium ${theme === "light" ? "text-white" : "text-[#b5bac1]"}`}>Light</span>
                     </div>

                 </div>
            </div>
             
             <div className="border-t border-[#3f4147] my-8" />
            
             <div className="mb-8">
                 <h3 className="text-xs font-bold text-[#b5bac1] uppercase mb-4">Message Display</h3>
                  <div className="space-y-4">
                     <label className="flex items-center gap-3 cursor-pointer group p-3 rounded hover:bg-[#35373c]/50 transition-colors">
                         <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${messageDisplay === "cozy" ? "border-[#5865f2]" : "border-[#b5bac1] group-hover:border-[#dbdee1]"}`}>
                            {messageDisplay === "cozy" && <div className="w-3 h-3 rounded-full bg-[#5865f2]" />}
                         </div>
                         <input 
                            type="radio" 
                            name="message_display" 
                            className="hidden" 
                            checked={messageDisplay === "cozy"} 
                            onChange={() => setMessageDisplay("cozy")} 
                        />
                         <div className="flex-1">
                             <div className="text-base text-white font-medium">Cozy</div>
                             <div className="text-sm text-[#949ba4]">Modern, beautiful, and easy on your eyes.</div>
                         </div>
                     </label>

                     <label className="flex items-center gap-3 cursor-pointer group p-3 rounded hover:bg-[#35373c]/50 transition-colors">
                         <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${messageDisplay === "compact" ? "border-[#5865f2]" : "border-[#b5bac1] group-hover:border-[#dbdee1]"}`}>
                             {messageDisplay === "compact" && <div className="w-3 h-3 rounded-full bg-[#5865f2]" />}
                         </div>
                          <input 
                            type="radio" 
                            name="message_display" 
                            className="hidden" 
                            checked={messageDisplay === "compact"} 
                            onChange={() => setMessageDisplay("compact")} 
                        />
                         <div className="flex-1">
                             <div className="text-base text-white font-medium">Compact</div>
                             <div className="text-sm text-[#949ba4]">Fit more messages on screen at one time. #IRC</div>
                         </div>
                     </label>
                 </div>
             </div>
             
             <div className="border-t border-[#3f4147] my-8" />

             {/* Zoom Level Placeholder */}
             <div>
                <h3 className="text-xs font-bold text-[#b5bac1] uppercase mb-4">Zoom Level</h3>
                <div className="flex items-center gap-4">
                     <span className="text-white font-medium">{zoomLevel}%</span>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 rounded bg-[#4e5058] hover:bg-[#6d6f78] text-white flex items-center justify-center" onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}>-</button>
                         <button className="w-8 h-8 rounded bg-[#4e5058] hover:bg-[#6d6f78] text-white flex items-center justify-center" onClick={() => setZoomLevel(100)}>R</button>
                        <button className="w-8 h-8 rounded bg-[#4e5058] hover:bg-[#6d6f78] text-white flex items-center justify-center" onClick={() => setZoomLevel(prev => Math.min(200, prev + 10))}>+</button>
                    </div>
                </div>
             </div>

        </div>
    );
};

export default Appearance;

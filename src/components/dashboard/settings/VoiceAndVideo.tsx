import { useState } from "react";
import { Slider } from "@/components/ui/slider";

const VoiceAndVideo = () => {
    const [micVolume, setMicVolume] = useState([70]);
    const [speakerVolume, setSpeakerVolume] = useState([80]);
    const [inputMode, setInputMode] = useState<"voice_activity" | "ptt">("voice_activity");

    return (
        <div className="w-full h-full text-[#b5bac1] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-semibold text-white mb-6">Voice & Video</h2>

            {/* Voice Settings */}
            <h3 className="text-xs font-bold text-[#b5bac1] uppercase mb-4">Voice</h3>
            
            <div className="flex gap-4 mb-6">
                <div className="flex-1">
                    <label className="text-xs font-bold text-[#b5bac1] uppercase mb-2 block">Input Device</label>
                    <div className="bg-[#1e1f22] p-2.5 rounded text-white border border-[#1e1f22] hover:border-[#000] cursor-pointer flex justify-between items-center text-sm">
                        <span>Default</span>
                        <span className="text-xs text-[#b5bac1]">▼</span>
                    </div>
                </div>
                <div className="flex-1">
                    <label className="text-xs font-bold text-[#b5bac1] uppercase mb-2 block">Output Device</label>
                     <div className="bg-[#1e1f22] p-2.5 rounded text-white border border-[#1e1f22] hover:border-[#000] cursor-pointer flex justify-between items-center text-sm">
                        <span>Default</span>
                        <span className="text-xs text-[#b5bac1]">▼</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mb-8">
                 <div className="flex-1">
                    <label className="text-xs font-bold text-[#b5bac1] uppercase mb-2 block">Microphone Volume</label>
                    <Slider 
                        value={micVolume}
                        max={100} 
                        step={1} 
                        className="w-full"
                        onValueChange={setMicVolume}
                    />
                </div>
                 <div className="flex-1">
                    <label className="text-xs font-bold text-[#b5bac1] uppercase mb-2 block">Speaker Volume</label>
                    <Slider 
                        value={speakerVolume} 
                        max={100} 
                        step={1} 
                        className="w-full"
                        onValueChange={setSpeakerVolume}
                    />
                </div>
            </div>

            <div className="mb-8">
                <label className="text-xs font-bold text-[#b5bac1] uppercase mb-2 block">Mic Test</label>
                <div className="text-xs text-[#949ba4] mb-3">Having mic issues? Start a test and say something fun — we'll play your voice back to you.</div>
                
                <div className="bg-[#1e1f22] p-4 rounded-lg flex items-center gap-4">
                     <button className="px-6 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium rounded transition-colors text-sm">
                        Let's Check
                    </button>
                    <div className="flex-1 h-3 bg-[#111214] rounded-full overflow-hidden flex items-center px-1">
                         <div className="w-full flex justify-between gap-0.5">
                             {Array.from({ length: 40 }).map((_, i) => (
                                 <div 
                                    key={i} 
                                    className={`w-1 h-full rounded-full transition-all duration-100 ${
                                         i < 5 ? "bg-[#3ba55d]" : "bg-[#2b2d31]"
                                    }`}
                                 />
                             ))}
                         </div>
                    </div>
                </div>
            </div>
             <p className="text-sm text-[#949ba4] mb-8">Need help with voice or video? Check out our <a href="#" className="text-[#00a8fc] hover:underline">troubleshooting guide</a>.</p>

             <div className="border-t border-[#3f4147] my-8" />
            
             <div className="mb-6">
                 <h3 className="text-xs font-bold text-[#b5bac1] uppercase mb-4">Input Profile</h3>
                 
                 <div className="space-y-4">
                     <div className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full border border-[#b5bac1] bg-transparent hover:border-white cursor-pointer" />
                         <div>
                             <div className="text-white text-base">Voice Isolation</div>
                             <div className="text-xs text-[#949ba4]">Just your beautiful voice: let Discord cut through the noise</div>
                         </div>
                     </div>
                      <div className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full border border-[#b5bac1] bg-transparent hover:border-white cursor-pointer" />
                         <div>
                             <div className="text-white text-base">Studio</div>
                         </div>
                     </div>
                 </div>
             </div>

             <div className="border-t border-[#3f4147] my-8" />
            
             {/* Input Mode */}
             <div className="mb-8">
                <h3 className="text-xs font-bold text-[#b5bac1] uppercase mb-4">Input Mode</h3>
                 <div className="space-y-2">
                     <label className="flex items-center gap-3 cursor-pointer group">
                         <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${inputMode === "voice_activity" ? "border-[#5865f2]" : "border-[#b5bac1] group-hover:border-[#dbdee1]"}`}>
                            {inputMode === "voice_activity" && <div className="w-3 h-3 rounded-full bg-[#5865f2]" />}
                         </div>
                         <input 
                            type="radio" 
                            name="input_mode" 
                            className="hidden" 
                            checked={inputMode === "voice_activity"} 
                            onChange={() => setInputMode("voice_activity")} 
                        />
                         <span className="text-base text-white">Voice Activity</span>
                     </label>

                     <label className="flex items-center gap-3 cursor-pointer group">
                         <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${inputMode === "ptt" ? "border-[#5865f2]" : "border-[#b5bac1] group-hover:border-[#dbdee1]"}`}>
                             {inputMode === "ptt" && <div className="w-3 h-3 rounded-full bg-[#5865f2]" />}
                         </div>
                          <input 
                            type="radio" 
                            name="input_mode" 
                            className="hidden" 
                            checked={inputMode === "ptt"} 
                            onChange={() => setInputMode("ptt")} 
                        />
                         <span className="text-base text-white">Push to Talk</span>
                     </label>
                 </div>
             </div>

        </div>
    );
};

export default VoiceAndVideo;

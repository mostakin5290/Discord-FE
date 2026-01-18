import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { acceptIncomingCall, clearIncomingCall } from "@/store/slices/callSlice";
import { useNavigate } from "react-router";
import { Phone, PhoneOff } from "lucide-react";
import { useEffect, useRef } from "react";

const IncomingCallModal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { incomingCall } = useSelector((state: RootState) => state.call);
    const { friends } = useSelector((state: RootState) => state.friends);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const friend = friends.find((f) => f.friendId === incomingCall?.fromFriendId);
    const friendData = friend?.friend;

    useEffect(() => {
        if (incomingCall) {
            // Play ringtone
            audioRef.current = new Audio("/ringtone.mp3");
            audioRef.current.loop = true;
            audioRef.current.play().catch(() => {});
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [incomingCall]);

    if (!incomingCall) return null;

    const handleAccept = () => {
        dispatch(acceptIncomingCall());
        navigate(`/call/${incomingCall.fromFriendId}/${incomingCall.roomName}`);
    };

    const handleDecline = () => {
        dispatch(clearIncomingCall());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#2b2d31] rounded-xl p-6 w-80 shadow-2xl border border-[#1e1f22] animate-in fade-in zoom-in duration-200">
                {/* Caller Info */}
                <div className="flex flex-col items-center gap-4">
                    {/* Avatar with pulse animation */}
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-[#5865f2] flex items-center justify-center overflow-hidden ring-4 ring-[#5865f2]/30 animate-pulse">
                            {friendData?.imageUrl ? (
                                <img
                                    src={friendData.imageUrl}
                                    alt={friendData.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white text-2xl font-bold">
                                    {incomingCall.fromFriendName?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-4 border-[#2b2d31]">
                            <Phone size={12} className="text-white" />
                        </div>
                    </div>

                    {/* Caller Name */}
                    <div className="text-center">
                        <h3 className="text-white text-lg font-semibold">
                            {friendData?.username || incomingCall.fromFriendName}
                        </h3>
                        <p className="text-[#b5bac1] text-sm mt-1">Incoming call...</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-6 mt-6">
                    <button
                        onClick={handleDecline}
                        className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
                    >
                        <PhoneOff size={24} className="text-white" />
                    </button>
                    <button
                        onClick={handleAccept}
                        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
                    >
                        <Phone size={24} className="text-white" />
                    </button>
                </div>

                {/* Button Labels */}
                <div className="flex justify-center gap-12 mt-2">
                    <span className="text-[#b5bac1] text-xs">Decline</span>
                    <span className="text-[#b5bac1] text-xs">Accept</span>
                </div>
            </div>
        </div>
    );
};

export default IncomingCallModal;


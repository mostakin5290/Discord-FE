import type { RootState, AppDispatch } from '@/store/types';
import { getInitials, getStatusColor } from '@/utils/messageUtils';
import { HelpCircle, Inbox, PhoneOff, Users } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { CallRoomComponent } from '../calls/call-room-component';
import { useEffect } from 'react';
import { clearCall } from '@/store/slices/callSlice';

const DirectCallFriend = ({ userId, onToggleProfile, token, roomName }: { userId: string, onToggleProfile: () => void, token: string, roomName: string }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user: currentUser } = useSelector((state: RootState) => state.auth);
    const { friends } = useSelector((state: RootState) => state.friends);
    const { isLoading } = useSelector((state: RootState) => state.call);

    const friend = friends.find((friend) => friend.friendId === userId);
    const friendData = friend?.friend;

    const handleLeaveCall = () => {
        dispatch(clearCall());
        navigate(`/channels/@me`);
    };

    const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "";

    useEffect(() => {
        if (!isLoading && !token) {
            navigate(`/channels/@me`);
        }
    }, [token, navigate, isLoading]);

    return (
        <div className="flex-1 flex flex-col bg-[#1e1f22]">
            {/* Header */}
            <div className="h-12 px-4 flex items-center justify-between border-b border-[#111214] shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-6 h-6 rounded-full bg-[#5865f2] flex items-center justify-center">
                            {currentUser?.imageUrl ? (
                                <img
                                    src={friendData?.imageUrl}
                                    alt={friendData?.username}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-white text-xs font-semibold">
                                    {getInitials(friendData?.username!)}
                                </span>
                            )}
                        </div>
                        <div
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(
                                "online",
                            )} border-2 border-[#313338] rounded-full`}
                        />
                    </div>
                    <h3 className="font-semibold text-white">{friendData?.username!}</h3>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={handleLeaveCall} className="text-[#ffffff] hover:bg-red-500/80 transition-colors flex items-center bg-red-500 rounded-sm px-2 py-1">
                        <PhoneOff size={20} />
                        <p className="text-[15px] ml-2 font-sans font-semibold tracking-tight">Leave Call</p>
                    </button>

                    {/* Use Users icon for Toggle Member List */}
                    <button
                        onClick={onToggleProfile}
                        className="text-[#b5bac1] hover:text-white transition-colors md:block hidden"
                    >
                        <Users size={20} />
                    </button>

                    <button className="text-[#b5bac1] hover:text-white transition-colors">
                        <Inbox size={20} />
                    </button>
                    <button className="text-[#b5bac1] hover:text-white transition-colors">
                        <HelpCircle size={20} />
                    </button>
                </div>
            </div>
            <CallRoomComponent token={token} serverUrl={serverUrl} roomName={roomName} onDisconnect={handleLeaveCall} />
        </div>
    )
}

export default DirectCallFriend;
"use client";

import {
    LiveKitRoom,
    RoomAudioRenderer,
    ControlBar,
    useTracks,
    ParticipantTile,
    TrackRefContext,
    useParticipants,
    useRoomContext,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useCallback, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/types";

interface VideoRoomProps {
    token: string;
    serverUrl: string;
    roomName: string;
    channelId?: string;
    onDisconnect?: () => void;
}

export function CallGroupComponent({ token, serverUrl, roomName, channelId, onDisconnect }: VideoRoomProps) {
    const navigate = useNavigate();

    const handleDisconnect = useCallback(() => {
        onDisconnect?.();
        navigate("/channels/@me");
    }, [navigate, onDisconnect]);

    // Use channelId in key for more reliable remounting, fallback to roomName
    // This ensures React unmounts the old component and mounts a new one when channel changes
    const roomKey = channelId || roomName;

    return (
        <LiveKitRoom
            key={roomKey}
            token={token}
            serverUrl={serverUrl}
            connect={true}
            audio={true}
            onDisconnected={handleDisconnect}
            data-lk-theme="default"
            className="h-screen w-full bg-zinc-950"
        >
            <RoomContent />
            <RoomAudioRenderer />
        </LiveKitRoom>
    );
}

function RoomContent() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { channelId } = useParams<{ channelId?: string }>();

    const { currentServer, isLoading } = useSelector(
        (state: RootState) => state.server
    );

    const room = useRoomContext();

    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false }
    );

    const participants = useParticipants();

    const currentChannel = useMemo(
        () => currentServer?.channels?.find((c) => c.id === channelId),
        [currentServer, channelId]
    );

    const isAudioChannel = currentChannel?.type === "AUDIO";

    const gridCols = useMemo(() => {
        if (tracks.length <= 1) return "grid-cols-1";
        if (tracks.length <= 4) return "grid-cols-2";
        return "grid-cols-3";
    }, [tracks.length]);

    if (
        isLoading ||
        !currentChannel ||
        !room ||
        room.state !== ConnectionState.Connected
    ) {
        return <VideoRoomSkeleton />;
    }

    return (
        <div className="flex h-full w-full flex-col relative bg-black">

            <div className="flex-1 p-4">
                <div className={`grid h-full gap-4 ${gridCols}`}>
                    {tracks.map((track) => (
                        <TrackRefContext.Provider
                            key={
                                track.publication?.trackSid ??
                                `${track.participant.identity}-${track.source}`
                            }
                            value={track}
                        >
                            <ParticipantTile className="rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800" />
                        </TrackRefContext.Provider>
                    ))}
                </div>
            </div>

            <div className="border-t border-zinc-800 bg-zinc-900/80 p-4 backdrop-blur-sm flex items-center justify-center">
                <ControlBar
                    variation="verbose"
                    controls={{
                        microphone: true,
                        screenShare: true,
                        leave: true,
                        camera: !isAudioChannel,
                        chat: false,
                        settings: false,
                    }}
                    className="flex items-center justify-center gap-3 w-full"
                />
            </div>

            <div className="flex items-center justify-center gap-2 w-full">
                <button
                    onClick={() => setIsChatOpen((prev) => !prev)}
                    className="flex items-center justify-center h-6 w-full bg-neutral-900/50 hover:bg-neutral-800 transition"
                >
                    <p className="text-[12px] text-zinc-400 font-medium">
                        {participants.length} participant
                        {participants.length !== 1 ? "s" : ""}
                    </p>
                </button>
            </div>
        </div>
    );
}

export function VideoRoomSkeleton() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-950">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 opacity-20" />
                    <Loader2 className="absolute inset-0 m-auto h-10 w-10 animate-spin text-violet-400" />
                </div>
                <p className="text-lg font-medium text-zinc-400">Connecting to room...</p>
            </div>
        </div>
    );
}

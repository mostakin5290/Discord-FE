"use client";

import {
    LiveKitRoom,
    VideoConference,
    RoomAudioRenderer,
    ControlBar,
    useTracks,
    ParticipantTile,
    useParticipants,
    useRoomContext,
    TrackRefContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useCallback, useState } from "react";
import { Loader2, Copy, Check, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface VideoRoomProps {
    token: string;
    serverUrl: string;
    roomName: string;
    onDisconnect?: () => void;
}

export function CallGroupComponent({ token, serverUrl, roomName, onDisconnect }: VideoRoomProps) {
    const navigate = useNavigate();
    const { isLoading, groupCall } = useSelector((state: RootState) => state.groupCall);

    console.log(groupCall)

    const handleDisconnect = useCallback(() => {
        onDisconnect?.();
        navigate("/channels/@me");
    }, [navigate, onDisconnect]);

    if (isLoading) {
        return <VideoRoomSkeleton />;
    }

    return (
        <LiveKitRoom
            token={token}
            serverUrl={serverUrl}
            connect={true}
            audio={true}
            onDisconnected={handleDisconnect}
            data-lk-theme="default"
            className="h-screen w-full bg-zinc-950"
        >
            <RoomContent roomName={roomName} />
            <RoomAudioRenderer />
        </LiveKitRoom>
    );
}

function RoomContent({ roomName }: { roomName: string }) {
    const { isLoading } = useSelector((state: RootState) => state.groupCall);
    if (isLoading) {
        return <VideoRoomSkeleton />;
    }

    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false }
    );

    return (
        <div className="flex h-full flex-col w-full">

            {/* Video Grid */}
            <div className="flex-1 p-4">
                <div
                    className={`grid h-full gap-4 ${tracks.length === 1
                        ? "grid-cols-1"
                        : tracks.length === 2
                            ? "grid-cols-2"
                            : tracks.length <= 4
                                ? "grid-cols-2"
                                : "grid-cols-3"
                        }`}
                >
                    {tracks.map((track) => (
                        <TrackRefContext.Provider value={track} key={track.participant.sid + track.source}>
                            <ParticipantTile className="rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800" />
                        </TrackRefContext.Provider>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="border-t border-zinc-800 bg-zinc-900/80 p-4 backdrop-blur-sm">
                <ControlBar
                    variation="verbose"
                    controls={{
                        microphone: true,
                        screenShare: true,
                        leave: true,
                        chat: false,
                        settings: false,
                    }}
                    className="flex items-center justify-center gap-3"
                />
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

import type { AppDispatch, RootState } from '@/store/types';
import { Inbox } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../ui/spinner';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NotificationType } from '@/types';
import { useEffect } from 'react';
import { fetchUserNotifications, markAsReadAll } from '@/store/slices/notificationSlice';

const NotificationTypeColor: Record<NotificationType, string> = {
    SYSTEM_NOTIFICATION: "#3B82F6",          // blue
    FRIEND_REQUEST_NOTIFICATION: "#22C55E",  // green
    SERVER_NOTIFICATION: "#8B5CF6",          // purple
    CHANNEL_NOTIFICATION: "#F59E0B",         // amber
    DM_NOTIFICATION: "#EC4899",              // pink
};

const InboxNofification = () => {
    const { isLoading, notification } = useSelector((state: RootState) => state.notification);
    const dispatch = useDispatch<AppDispatch>();

    // const notification = [
    //     {
    //         id: "notif_001",
    //         createdAt: new Date("2026-02-01T10:15:30Z"),
    //         updatedAt: new Date("2026-02-01T10:15:30Z"),
    //         read: false,
    //         userId: "user_123",
    //         message: "Welcome to the platform! 🎉",
    //         topic: "Welcome",
    //         notifyLink: "/home",
    //         type: "SYSTEM_NOTIFICATION",
    //         readAt: null,
    //     },
    //     {
    //         id: "notif_002",
    //         createdAt: new Date("2026-02-02T08:40:10Z"),
    //         updatedAt: new Date("2026-02-02T08:40:10Z"),
    //         read: true,
    //         userId: "user_123",
    //         message: "Alex sent you a friend request.",
    //         topic: "Friend Request",
    //         notifyLink: "/friends/requests",
    //         type: "FRIEND_REQUEST_NOTIFICATION",
    //         readAt: new Date("2026-02-02T09:00:00Z"),
    //     },
    //     {
    //         id: "notif_003",
    //         createdAt: new Date("2026-02-03T12:05:45Z"),
    //         updatedAt: new Date("2026-02-03T12:05:45Z"),
    //         read: false,
    //         userId: "user_123",
    //         message: "New announcement posted in Dev Server.",
    //         topic: "Server Update",
    //         notifyLink: "/servers/dev-server",
    //         type: "SERVER_NOTIFICATION",
    //         readAt: null,
    //     },
    //     {
    //         id: "notif_004",
    //         createdAt: new Date("2026-02-04T18:22:00Z"),
    //         updatedAt: new Date("2026-02-04T18:22:00Z"),
    //         read: true,
    //         userId: "user_123",
    //         message: "A new message was sent in #general.",
    //         topic: "Channel Message",
    //         notifyLink: "/channels/general",
    //         type: "CHANNEL_NOTIFICATION",
    //         readAt: new Date("2026-02-04T18:30:00Z"),
    //     },
    //     {
    //         id: "notif_005",
    //         createdAt: new Date("2026-02-05T21:10:55Z"),
    //         updatedAt: new Date("2026-02-05T21:10:55Z"),
    //         read: false,
    //         userId: "user_123",
    //         message: "You received a new direct message from Sam.",
    //         topic: "Direct Message",
    //         notifyLink: "/dm/sam",
    //         type: "DM_NOTIFICATION",
    //         readAt: null,
    //     },
    // ];


    if (isLoading) {
        <Spinner />
    };

    const handleMarkAsRead = () => {
        dispatch(markAsReadAll({ id: notification.map((notify) => notify.id) }));
    };

    function timeAgo(input: string | Date): string {
        const now = new Date();
        const time = typeof input === "string" ? new Date(input) : input;

        const diffMs = now.getTime() - time.getTime();

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (years > 0) return `${years}y ago`;
        if (months > 0) return `${months}mo ago`;
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return `just now`;
    }


    useEffect(() => {
        dispatch(fetchUserNotifications());
    }, [dispatch]);

    if (notification.length === 0) {
        return (
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Inbox
                            size={24}
                            className="cursor-pointer hover:text-[#dbdee1] transition-all duration-200 hover:scale-110 active:scale-95"
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-100 h-80 overflow-y-auto" align="center">
                        <DropdownMenuLabel className=''>My Inbox</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <div className='text-[13px] text-neutral-400 w-full h-[80%] flex items-center justify-center'>
                            0 notifications for now
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className='relative'>
                        <Inbox
                            size={24}
                            className="cursor-pointer hover:text-[#dbdee1] transition-all duration-200 hover:scale-110 active:scale-95"
                        />

                        <div className='size-2.5 bg-red-500 rounded-full absolute top-0 right-0'>
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-100 h-80 overflow-y-auto" align="center">
                    <DropdownMenuLabel className='flex items-center justify-between px-2'>
                        <p>My Inbox</p>
                        <button disabled={isLoading} className='bg-purple-600 px-2 py-1 rounded-[5px]' onClick={handleMarkAsRead}>Mark as Read</button>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {notification.map((notify) => {
                        const color = NotificationTypeColor[notify.type as keyof typeof NotificationTypeColor];

                        return (
                            <DropdownMenuGroup key={notify.id}>
                                <DropdownMenuItem
                                    className={`
          flex items-start gap-3 px-3 py-2 rounded-md
          hover:bg-muted focus:bg-muted relative
          ${!notify.read ? "bg-muted/50" : ""}
        `}
                                >
                                    {/* Color indicator */}
                                    <span
                                        className="mt-1 h-2.5 w-2.5 rounded-full shrink-0"
                                        style={{ backgroundColor: color }}
                                    />

                                    {/* Content */}
                                    <div className="flex flex-col gap-0.5 flex-1">
                                        <p className="text-sm font-medium leading-snug">
                                            {notify.message}
                                        </p>

                                        {notify.topic && (
                                            <span className="text-xs text-muted-foreground">
                                                {notify.topic}
                                            </span>
                                        )}
                                    </div>

                                    <div className='flex items-center justify-center absolute right-2 bottom-1'>
                                        <p className='text-[12px] text-muted-foreground'>{timeAgo(notify.createdAt)}</p>
                                    </div>

                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        );
                    })}

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
};

export default InboxNofification;
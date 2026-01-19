
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketService from "@/services/socket.service";
import { addMessage } from "@/store/slices/messageSlice";
import type { RootState } from "@/store/types";

export const useChatSocket = (channelId: string) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!user || !channelId) return;

    socketService.connect();
    socketService.joinChannel(channelId);

    const socket = socketService.getSocket();

    if (socket) {
      socket.on("receive_message", (message: any) => {
        // Only add if it belongs to this channel
        if (message.channelId === channelId) {
            // Check if we already have this message (optimistic update might have added it)
             dispatch(addMessage(message));
        }
      });

      socket.on("user_typing", (data: { userId: string; isTyping: boolean; channelId: string }) => {
        if (data.channelId !== channelId) return;

        setTypingUsers((prev) => {
          if (data.isTyping) {
            return prev.includes(data.userId) ? prev : [...prev, data.userId];
          } else {
            return prev.filter((id) => id !== data.userId);
          }
        });
      });
    }

    return () => {
      socketService.leaveChannel(channelId);
      if (socket) {
        socket.off("receive_message");
        socket.off("user_typing");
      }
    };
  }, [channelId, user, dispatch]);

  const handleTyping = (isTyping: boolean) => {
    socketService.sendTyping(channelId, isTyping);
  };

  return { typingUsers, handleTyping };
};

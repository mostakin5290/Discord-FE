import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Socket: No token found, cannot connect");
      return;
    }
    
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
    let socketUrl = apiUrl.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
    
    if (!socketUrl || socketUrl === "" || !socketUrl.startsWith("http")) {
      socketUrl = "http://localhost:3000";
    }



    this.socket = io(socketUrl, {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
    });

    this.socket.on("connect_error", (err) => {
      console.error("Socket: Connection error", err);
    });

    this.socket.on("disconnect", (_reason) => {
    });

    this.socket.on("reconnect", (_attemptNumber) => {
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  joinChannel(channelId: string) {
    if (this.socket) {
      this.socket.emit("join_channel", channelId);
    }
  }

  leaveChannel(channelId: string) {
    if (this.socket) {
      this.socket.emit("leave_channel", channelId);
    }
  }

  sendMessage(message: any) {
    if (this.socket) {
      this.socket.emit("send_message", message);
    }
  }

  sendTyping(channelId: string, isTyping: boolean) {
    if (this.socket) {
      this.socket.emit("typing", { channelId, isTyping });
    }
  }

  updateLastSeen(channelId: string, messageId: string) {
    if (this.socket) {
      this.socket.emit("update_last_seen", { channelId, messageId });
    }
  }
}

export default new SocketService();

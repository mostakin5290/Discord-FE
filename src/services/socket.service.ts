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
    
    // Derive socket URL from API URL (remove /api/v1 if present)
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
    let socketUrl = apiUrl.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
    
    // If no protocol specified or empty, default to http://localhost:3000
    if (!socketUrl || socketUrl === "" || !socketUrl.startsWith("http")) {
      socketUrl = "http://localhost:3000";
    }

    // console.log("Socket: Connecting to", socketUrl);

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
      // console.log("Socket: Connected to server", this.socket?.id);
    });

    this.socket.on("connect_error", (err) => {
      console.error("Socket: Connection error", err);
    });

    this.socket.on("disconnect", (reason) => {
      // console.log("Socket: Disconnected", reason);
    });

    this.socket.on("reconnect", (attemptNumber) => {
      // console.log("Socket: Reconnected after", attemptNumber, "attempts");
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

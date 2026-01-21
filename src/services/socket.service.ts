import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const socketUrl = "http://localhost:3000";

    this.socket = io(socketUrl, {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {});

    this.socket.on("connect_error", (err) => {
      console.error("Socket connection error", err);
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
}

export default new SocketService();

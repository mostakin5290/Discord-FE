import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return;

    const token = localStorage.getItem("token");
    if (!token) return;
    // Use VITE_API_URL but strip the /api/v1 part to get base URL if needed, 
    // or typically socket runs on the same host:port as the backend.
    // Assuming backend is at http://localhost:3000 based on previous analysis.
    const socketUrl = "http://localhost:3000"; 

    this.socket = io(socketUrl, {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      // console.log("Connected to socket server", this.socket?.id);
    });

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

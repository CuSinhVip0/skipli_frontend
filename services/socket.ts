import { io, Socket } from "socket.io-client"

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000"

class SocketService {
    private socket: Socket | null = null
    private connecting: boolean = false

    connect(): Socket {
        if (this.socket && this.socket.connected) {
            return this.socket
        }

        if (this.connecting) {
            // Wait for existing connection attempt
            return this.socket!
        }

        this.connecting = true

        this.socket = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 10000,
        })

        this.socket.on("connect", () => {
            this.connecting = false
        })

        this.socket.on("disconnect", (reason) => {})

        this.socket.on("connect_error", (error) => {
            this.connecting = false
        })

        this.socket.on("error", (error) => {})

        return this.socket
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
            this.connecting = false
        }
    }

    getSocket(): Socket | null {
        return this.socket
    }

    isConnected(): boolean {
        return this.socket?.connected || false
    }
}

// Singleton instance
export const socketService = new SocketService()

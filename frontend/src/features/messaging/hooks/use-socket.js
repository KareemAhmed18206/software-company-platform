"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { useAuth } from "@/features/auth/hooks/use-auth";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export function useSocket() {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return undefined;
    }

    const nextSocket = io(SOCKET_URL, {
      auth: {
        token
      }
    });

    setSocket(nextSocket);

    return () => {
      nextSocket.disconnect();
      setSocket(null);
    };
  }, [isAuthenticated, token]);

  return socket;
}


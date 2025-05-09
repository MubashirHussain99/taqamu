"use client";
import { Router } from "next/router";
import { useSocket } from "./SocketContext";
import { useEffect } from "react";

export function Event({ event, handler, handleRouterChange = false }) {
  const { getSocket, socketStatus, connected } = useSocket();

  useEffect(() => {
    if (typeof window === "undefined") return null;

    if (!connected()) return handleOffSocket();

    const socket = getSocket();
    Router.events.on("routeChangeComplete", _handleRouteChangeComplete);
    socket?.on(event, handler);

    return handleOffSocket;
  }, [socketStatus]);

  const _handleRouteChangeComplete = () => {
    const socket = getSocket();
    handleRouterChange && socket?.on(event, handler);
  };

  const handleOffSocket = () => {
    const socket = getSocket();
    socket?.off(event, handler);
    Router.events.off("routeChangeComplete", _handleRouteChangeComplete);
  };

  return null;
}
export default Event;

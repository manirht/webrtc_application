import React, { createContext, useEffect, ReactNode } from "react";
import socketIoClient, { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
// Define the type for the context's value
interface IRoomContext {
  ws: Socket;
}

const WS = 'http://localhost:8080';
const ws = socketIoClient(WS);

// Use the interface to create a typed context
export const RoomContext = createContext<IRoomContext | null>(null);

// Type the component props with children
type RoomProviderProps = React.PropsWithChildren<{
  
}>;

export const RoomProvider = ({ children }: RoomProviderProps) => {
  // Declarations and hooks must go inside the function's body
  const navigate = useNavigate();
  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log({ roomId });
    navigate(`/room/${roomId}`);
  };

  useEffect(() => {
    // Add the event listener when the component mounts
    ws.on('room-created', enterRoom);

    // Return a cleanup function to remove the listener
    // This prevents memory leaks
    return () => {
      ws.off('room-created', enterRoom);
    };
  }, []); // The empty array ensures this only runs once

  // Return the JSX
  return (
    <RoomContext.Provider value={{ ws }}>{children}</RoomContext.Provider>
  );
};
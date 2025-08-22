import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";

interface RoomParams {
  roomId: string;
}

export const Room = () => {
  const { roomId } = useParams<RoomParams>();
  const { ws } = useContext(RoomContext);

  useEffect(() => {
    if (ws) {
      ws.emit("join-room", { roomId });
    }
  }, [ws, roomId]);

  return <div>Room ID: {roomId}</div>;
};
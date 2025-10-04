import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
// Assuming you are passing the correct types for RoomContext
import { RoomContext } from "../context/RoomContext"; 
import { VideoPlayer } from "../components/VideoPlayer";
import type { peerState } from "../context/peerReducer";

interface RoomParams {
  roomId: string; // Corrected interface property
}

export const Room = () => {
  // Destructure the correct parameter 'roomId'
  const { roomId } = useParams<Record<keyof RoomParams, string | undefined>>();
  
  // Assuming you are handling the null context with casting/custom hook
  const { ws, me,stream,peers } = useContext(RoomContext)!; 

  useEffect(() => {
    // Check for ws, me, and ensure the Peer has opened and has an ID
    if (ws && roomId && me && me.id) { 
      // Use roomId and the correct PeerJS property (me.id)
      ws.emit("join-room", { roomId: roomId, peerId: me.id });
    }
  }, [roomId, ws, me]);

  // Return the corrected variable
  return (<div>
    Room ID: {roomId}
    <div className="grid grid-cols-4 gap-4">
      <VideoPlayer stream={stream} />
      {Object.values(peers as peerState).map(peer=>(
        <VideoPlayer stream={peer.stream}/>
      ))}
    </div>
  </div>); 
};
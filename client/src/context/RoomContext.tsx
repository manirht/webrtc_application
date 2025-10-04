import React, { createContext, useEffect, useState,useReducer } from "react";
import socketIoClient, { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { Peer } from "peerjs";
import { v4 as uuidV4 } from "uuid";
import { peerReducer } from "./peerReducer";
import { addPeerAction , removePeerAction} from "./peerActions";
// Define the type for the context's value
interface IRoomContext {
  ws: Socket;
  me?: Peer;
  stream?: MediaStream;
  peers: Record<string, { stream: MediaStream }>;
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
  const [me,setMe]=useState<Peer | undefined>();
  const [stream,setStream]=useState<MediaStream | undefined>();
  const [peers,dispatch]=useReducer(peerReducer,{}); // Example of useReducer
  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log({ roomId });
    navigate(`/room/${roomId}`);
  };
  const getUsers=({participants}:{participants:string[]})=>{
    console.log(participants);
  };
  const removePeer=(peerId:string)=>{
    dispatch(removePeerAction(peerId));
  };
  useEffect(() => {

    const meId=uuidV4();
    const peer=new Peer(meId);
    setMe(peer);
    try{
    navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{
      setStream(stream);
    });
    }catch(error){
      console.log(error);
    }
    ws.on('room-created', enterRoom);
    ws.on("get-users", getUsers)
    ws.on('user-disconnected',removePeer);
    
    return () => {
      ws.off('room-created', enterRoom);
    };
  }, []); 

  useEffect(()=>{
    if(!me) return;
    if(!stream) return;
    ws.on("user-joined",({peerId})=>{
      const call =me.call(peerId,stream);
      call.on("stream",(peerStream)=>{
        dispatch(addPeerAction(peerId,peerStream));
      });
    });
    me.on("call",(call)=>{
      call.answer(stream);
      call.on("stream",(peerStream)=>{
        dispatch(addPeerAction(call.peer,peerStream));
      });
    });
  },[me,stream]);

  console.log({peers});

  // Return the JSX
  return (
    <RoomContext.Provider value={{ ws,me ,stream,peers}}>{children}</RoomContext.Provider>
  );
};
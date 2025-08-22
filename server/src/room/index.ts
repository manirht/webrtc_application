import {Socket} from "socket.io"
import {v4 as uuidV4} from 'uuid';

export const roomHandler =(socket : Socket)=>{
    const createRoom=()=>{
        const roomId = uuidV4();
         
        socket.emit('room-created', {roomId});
        console.log('Room created');
    }
    const joinRoom=({roomId}:{roomId:string})=>{
        
        console.log('User joined the room',roomId);
        socket.join(roomId);
    };
    socket.on('create-room',createRoom);
    socket.on('join-room', joinRoom);
}
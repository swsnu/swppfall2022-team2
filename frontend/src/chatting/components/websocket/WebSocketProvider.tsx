import React, { useRef } from 'react';
import { useParams } from 'react-router';

const WebSocketContext = React.createContext<any>(null);
export { WebSocketContext };

interface propsType {
  roomName : string | undefined;
  children : React.ReactNode;
}

const WebSocketProvider : React.FC<propsType> = (props : propsType) => {
  const webSocketUrl = `wss://babchingu.shop:8001`+`/ws/chatroom/`+props.roomName+'/'; 
  let ws = useRef<WebSocket | null>(null);
  const id = useParams();


  if (!ws.current) { 
    console.log(webSocketUrl);
    ws.current = new WebSocket(webSocketUrl);
    console.log(ws.current);

    ws.current.onopen = () => {
      console.log("connected to " + ws.current?.url);
      console.log("done");
    };

    ws.current.onclose = error => {
      console.log("disconnect from " + webSocketUrl);
      console.log(error);
    };
    ws.current.onerror = error => {
      console.log("connection error " + webSocketUrl);
      console.log(error);
    };
  }


  return (
    <WebSocketContext.Provider value = {ws} >
      {props.children}
    </WebSocketContext.Provider>
  );
}

export default WebSocketProvider;
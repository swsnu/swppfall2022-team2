import React, { useRef } from 'react';

const WebSocketContext = React.createContext<any>(null);
export { WebSocketContext };

interface propsType {
  roomName : string | undefined;
  children : React.ReactNode;
}

const WebSocketProvider : React.FC<propsType> = (props : propsType) => {
  const webSocketUrl = `ws://localhost:8000/ws/chatroom/` + props.roomName + `/` 
  let ws = useRef<WebSocket | null>(null);
  

  if (!ws.current) { 
    ws.current = new WebSocket(webSocketUrl);
    ws.current.onopen = () => {
      console.log("connected to " + ws.current?.url);
    }
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
import React, {useContext, useEffect, useRef, useState} from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AppDispatch, RootState } from '../store/index';
import { MyMessage, OtherMessage } from './components/MessagesList/Messages';
import WebSocketProvider, { WebSocketContext } from './components/websocket/WebSocketProvider';
import Chatting from './Chatting';
import { useDispatch, useSelector } from 'react-redux';
import { chatActions, getMessageList, messageType } from '../store/slices/chat';

const ChatRoom = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const chatRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const {id} = useParams();
  const {messageList, user} = useSelector(({user, chat} : RootState) => ({
    messageList : chat.messageList,
    user : user.loggedinuser?.user,
  }));

  useEffect(() => {
    if(chatRef.current){
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
    chatRef.current.scrollIntoView({ behavior: 'smooth',block: 'end', inline: 'nearest'  });
    }
    
  }, [messageList]);

  useEffect(() => {
    return() =>{
      dispatch(getMessageList(id!));
    }
  },[MessageEvent])
  

  return (
    <WebSocketProvider roomName={id} >
      <Chat_Box >
        <ChatWrapper ref={chatRef}>
          {messageList.map(message =>(
            <>
            {message.author === user?.nickname ?(
              <MyMessage message = {message}></MyMessage>
            ) : (
              <OtherMessage message = {message}></OtherMessage>
            )}
            </>
            ))}
        </ChatWrapper>
      </Chat_Box>
      <Chatting></Chatting>
    </WebSocketProvider>
  );
};

export default ChatRoom;

const ChatWrapper = styled.div`
  width: 100%;
  height: cal(100% - 60px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Chat_Box = styled.div`
width: calc(100% - 300px);
height: calc(100vh - 60px);
min-height: 400px;
background-color: #fbfff8;
border-right: 1px solid #d1d1d1;
overflow-y: auto;
&::-webkit-scrollbar {
  display: none;
}

@media all and (max-width: 735px) {
  width: 100%;
  height: calc(100vh - 360px);
  min-height: 300px;
  border: 1px solid #d1d1d1;
  border-bottom: 1px solid #363636;
}`;
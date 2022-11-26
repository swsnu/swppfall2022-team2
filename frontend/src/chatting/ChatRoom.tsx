import React, { SyntheticEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AppDispatch, RootState } from '../store';
import { chatActions, messageType } from '../store/slices/chat';
import { MyMessage, OtherMessage } from './components/MessagesList/Messages';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import WebSocketProvider, { WebSocketContext } from './components/websocket/WebSocketProvider';
import Chatting from './Chatting';

const ChatRoom = () => {
  const ws = useContext(WebSocketContext);
  const [items, setItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const chatRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [messages, setMessages] = useState<messageType[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>('');
  const [id, setId] = useState<number>();
  const [input, setInput] = useState('');
  const { user, socket, chatroomList, messageList } = useSelector(({ user, chat }: RootState) => ({
    user: user.loggedinuser?.user,
    socket: chat.socket,
    chatroomList: chat.chatroomList,
    messageList: chat.messageList,
  }));

  useEffect(() => {
    dispatch(chatActions.getMessageList(messageList));
    setMessages(messageList);
    dispatch(chatActions.setSocket(100));
  }, []);

  useEffect(() => {
    scrollbar();
  }, [messageList]);

  const scrollbar = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
      chatRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  };

  const addItem = (item: string) => {
    setItems([...items, item]);
  };

  const onSendMessage = (e: any) => {
    setInput(e.target.value);
  };

  const onClickedButton = () => {
    ws.send(
      JSON.stringify({
        type: 'chat_message',
        message: input,
      }),
    );
    setInput('');
  };

  return (
    <WebSocketProvider>
      <Chat_Box>
        <ChatWrapper>
          <OtherMessage></OtherMessage>
        </ChatWrapper>
      </Chat_Box>
      <Chatting />
    </WebSocketProvider>
  );
  // return (
  //   <WebSocketProvider>
  //   <Wrapper>
  //     <ChatroomListWrapper>
  //       <ChatroomListText>Chat List</ChatroomListText>
  //     </ChatroomListWrapper>

  //     <Chat_Box >
  //       <ChatWrapper ref={chatRef}>
  //         {messages.map((message) => (
  //           <MyMessage messages={message} />
  //         ))}
  //       </ChatWrapper>
  //       <InputWrapper>
  //         <Input
  //           value={input}
  //           onChange={onSendMessage}
  //           onKeyPress={(e) => {
  //             if (e.key === 'Enter') onClickedButton();
  //           }}
  //           placeholder='입력하세요.'
  //         />
  //         <InputWriteButton onClick={onClickedButton}>보내기</InputWriteButton>
  //       </InputWrapper>
  //       <p className='errorMessage'>{errorMessage}</p>
  //     </Chat_Box>
  //   </Wrapper>
  //   </WebSocketProvider>
  // );
};

export default ChatRoom;

const ChatWrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
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
  background-color: #ffffff;
  border-right: 1px solid #d1d1d1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: ;
  }

  @media all and (max-width: 735px) {
    width: 100%;
    height: calc(100vh - 360px);
    min-height: 300px;
    border: 1px solid #d1d1d1;
    border-bottom: 1px solid #363636;
  }
`;

const Wrapper = styled.div`
  width: 150%;
  max-width: 1200px;
  height: calc(100vh - 60px);
  min-height: 400px;
  display: flex;

  @media all and (max-width: 735px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  width: calc(100% - 45px);
  height: 40px;
  border: 0;
  border-radius: 5px;
  background-color: #ceffa1;
  padding: 0 10px;
  font-size: 16px;
`;

const InputWriteButton = styled.div`
  width: 50px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  background-color: #ceffaf;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s linear;
  svg {
    color: white;
    width: 20px;
    height: 20px;
  }
  &:hover {
    background-color: #525252;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 5px 5px 20px #46464644;
  background-color: #ffffff;
  display: flex;
  border-top: 1px solid #d1d1d1;
`;

const ChatroomListWrapper = styled.div`
  width: 300px;
  height: calc(100vh - 60px);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  border-left: 1px solid #d1d1d1;
  border-right: 1px solid #d1d1d1;
  padding: 20px 0;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  @media all and (max-width: 735px) {
    width: 100%;
    height: 300px;
    min-height: 300px;
    border: 1px solid #d1d1d1;
    border-bottom: 1px solid #363636;
  }
`;
const ChatroomListText = styled.div`
  font-size: 32px;
  font-family: FugazOne;
  padding: 15px;
  border-bottom: 1px solid #d1d1d1;
  margin-bottom: 15px;
`;

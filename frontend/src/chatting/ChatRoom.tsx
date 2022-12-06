import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AppDispatch, RootState } from '../store/index';
import { MyMessage, OtherMessage, Usernames } from './components/MessagesList/Messages';
import WebSocketProvider, { WebSocketContext } from './components/websocket/WebSocketProvider';
import Chatting from './Chatting';
import { useDispatch, useSelector } from 'react-redux';
import { chatActions, getMessageList, messageType } from '../store/slices/chat';
import axios from 'axios';

export interface statusType {
  name: string;
  mbti: string;
  intro: string;
  birth: string;
  gender: string;
  nickname: string;
  temperature: number;
  matched_users: string[];
  blocked_users: string[];
}

const ChatRoom = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const chatRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const { id } = useParams();
  const { messageList, user, chatroom } = useSelector(({ user, chat }: RootState) => ({
    messageList: chat.messageList,
    user: user,
    chatroom: user.chosenchatroom,
  }));

  const [status, handleStatus] = useState<statusType>({
    name: '',
    mbti: '',
    intro: '',
    birth: '',
    gender: '',
    nickname: '',
    matched_users: [],
    blocked_users: [],
    temperature: 0.0,
  });

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
      chatRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }, [messageList]);

  useEffect(() => {
    return () => {
      dispatch(getMessageList(id!));
    };
  }, [MessageEvent]);

  useEffect(() => {
    axios
      .get(`/mypage/get/`)
      .then((response) => {
        handleStatus({
          ...status,
          name: response.data.name,
          mbti: response.data.mbti,
          intro: response.data.intro,
          birth: response.data.birth,
          gender: response.data.gender,
          nickname: response.data.nickname,
          temperature: response.data.temperature,
          matched_users: response.data.matched_users,
          blocked_users: response.data.blocked_users,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleclicked = () => {
    navigate('/main');
    window.location.reload();
  };

  const preventGoBack = () => {
    navigate('/main');
    window.location.reload();
  };

  useEffect(() => {
    (() => {
      history.pushState(null, '', location.href);
      window.addEventListener('popstate', preventGoBack);
    })();

    return () => {
      window.removeEventListener('popstate', preventGoBack);
    };
  }, [chatRef.current]);

  return (
    <>
      <WebSocketProvider roomName={id}>
        <Wrapper>
          <ChatroomListWrapper>
            <button onClick={handleclicked}> 메인으로 </button>
            <>
              {'[채팅방에 있는 유저]'}
              {chatroom?.user_id.map((users) => {
                return (
                  <>
                    <Usernames
                      name={user.userlist.find((u) => u.id === users)?.nickname!}
                    ></Usernames>
                    <Usernames name={'<' + status.intro + '>'}></Usernames>
                  </>
                );
              })}
            </>
          </ChatroomListWrapper>

          <Chat_Box>
            <ChatWrapper ref={chatRef}>
              {messageList.map((message) => (
                <>
                  {message.author === user.loggedinuser?.user.nickname ? (
                    <MyMessage message={message}></MyMessage>
                  ) : (
                    <OtherMessage message={message}></OtherMessage>
                  )}
                </>
              ))}
            </ChatWrapper>
          </Chat_Box>
        </Wrapper>
        <Chatting></Chatting>
      </WebSocketProvider>
    </>
  );
};

export default ChatRoom;

const Name_Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 15px;
  margin: 5px 0;
`;

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
  background-color: #ffe4c4;
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
  }
`;

const ChatroomListWrapper = styled.div`
  width: 300px;
  height: calc(100vh - 60px);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
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

const Wrapper = styled.div`
  width: 100%;
  max-width: 1500px;
  height: calc(100vh - 60px);
  min-height: 400px;
  display: flex;

  @media all and (max-width: 735px) {
    flex-direction: column;
  }
`;

const Username = styled.div`
  font-size: 20px;
  font-family: NanumSquareR;
  margin-right: 10px;
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

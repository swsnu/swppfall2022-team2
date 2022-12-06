import styled from 'styled-components';
import { chatActions, messageType } from '../../../store/slices/chat';
import { useContext } from 'react';
import { WebSocketContext } from '../websocket/WebSocketProvider';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';

interface Props {
  message: messageType;
}

interface testProps {
  name: string;
}

export const MyMessage = (message: Props) => {
  const ws = useContext(WebSocketContext);
  const dispatch = useDispatch<AppDispatch>();

  ws.current.onmessage = (test: MessageEvent) => {
    const Data = JSON.parse(test.data);
    dispatch(chatActions.setMessage({ author: Data.author, content: Data.content }));
    console.log(Data.author);
  };
  return (
    <>
      <MyWrapper>
        <>
          <TopWrapper>
            <Username>{message.message.author}</Username>
          </TopWrapper>
          <Message_Box>{message.message.content}</Message_Box>
        </>
      </MyWrapper>
    </>
  );
};

export const OtherMessage = (message: Props) => {
  const ws = useContext(WebSocketContext);
  const dispatch = useDispatch<AppDispatch>();

  ws.current.onmessage = (test: MessageEvent) => {
    const Data = JSON.parse(test.data);
    dispatch(chatActions.setMessage({ author: Data.author, content: Data.content }));
    console.log(Data.author);
  };

  return (
    <>
      <OtherWrapper>
        <>
          <TopWrapper>
            <Username>{message.message.author}</Username>
          </TopWrapper>
          <Message_Box>{message.message.content}</Message_Box>
        </>
      </OtherWrapper>
    </>
  );
};

export const Usernames = (name: testProps) => {
  return (
    <TopWrapper>
      <Username>{name.name}</Username>
    </TopWrapper>
  );
};
export const Intro = (name: testProps) => {
  return (
      <Introduce>{name.name}</Introduce>
  );
};

const Introduce = styled.div`
  font-size: 20px;
  font-family: NanumSquareR;
  margin-right: 10px;
  padding: 5px;
`;

const Username = styled.div`
  font-size: 20px;
  font-family: NanumSquareR;
  margin-right: 10px;
`;

const TopWrapper = styled.div`
  display: flex;
  position : relative;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const Message_Box = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: #ffffff;
  padding: 10px;
  border-radius: 5px;
  line-height: 25px;
  word-break: break-all;

  @media all and (max-width: 435px) {
    max-width: 280px;
  }
`;

const MyWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 10px 15px;
  margin: 8px 0;
`;

const OtherWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 15px;
  margin: 8px 0;
`;

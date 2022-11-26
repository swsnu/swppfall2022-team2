import { FC } from 'react';
import styled from 'styled-components';
import { messageType } from '../../../store/slices/chat';
import { UserType } from '../../../store/slices/user';
import React, { useContext, useState } from 'react'
import { WebSocketContext } from '../websocket/WebSocketProvider';

interface MessageProps {
  messages: messageType;
}

export const MyMessage: FC<MessageProps> = ({messages}) => {
    console.log(messages)
  return (
              <Wrapper>
                <Message_Box> {messages.content} </Message_Box>
              </Wrapper>
      
  );
};

export const OtherMessage = () => {
  const ws = useContext(WebSocketContext);
  const [items, setItems] = useState<string[]>([]);

  const addItem = (item: string) => {
      setItems([
        ...items,
        item
      ]);
    };

  ws.current.onmessage = (evt: MessageEvent) => {
    const data = JSON.parse(evt.data) 
    addItem(data.message);
    console.log(items)
  };

  return (
    <Wrapper>
      {
        items.map((message) => {
          return (
            <Message_Box>{message}</Message_Box>
          )
        })
      }
      </Wrapper>
  )
};

const Message_Box = styled.div`
  width: 100%;
  max-width: 150px;
  background-color: '#feffb1';
  padding: 10px;
  border-radius: 5px;
  box-shadow: 1px 1px 1px 1px #797979;
  line-height: normal;
  word-break: break-all;

  @media all and (max-width: 435px) {
    max-width: 280px;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: 'flex-end';
  padding: 10px 15px;
  margin: 5px 0;
`;

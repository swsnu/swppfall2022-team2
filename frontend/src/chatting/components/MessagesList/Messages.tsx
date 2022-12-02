import { FC, useEffect } from 'react';
import styled from 'styled-components';
import { chatActions, messageType } from '../../../store/slices/chat';
import React, { useContext, useState } from 'react';
import { WebSocketContext } from '../websocket/WebSocketProvider';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';


interface Props{
  message : messageType
}

export const MyMessage = (message :Props) => {
  const ws = useContext(WebSocketContext);
  const dispatch = useDispatch<AppDispatch>();
  
  ws.current.onmessage = (test : MessageEvent) => {
    const Data = JSON.parse(test.data);
    dispatch(chatActions.setMessage({author : Data.author , content : Data.content}));
    console.log("my")
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

export const OtherMessage = (message : Props) => {
  const ws = useContext(WebSocketContext);
  const dispatch = useDispatch<AppDispatch>();

  ws.current.onmessage = (test: MessageEvent) => {
    const Data = JSON.parse(test.data);
    dispatch(chatActions.setMessage({author : Data.author , content : Data.content}));
    console.log("other")
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

const Username = styled.div`
  font-size: 20px;
  font-family: NanumSquareR;
  margin-right: 10px;
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 8px;
`;

const Message_Box = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: '#feffb1';
  padding: 10px;
  border-radius: 5px;
  box-shadow: 1px 1px 1px 1px #797979;
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


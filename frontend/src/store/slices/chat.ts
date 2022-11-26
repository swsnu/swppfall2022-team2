import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { ChatRoomType, UserType } from './user';
import { put, call, takeLatest } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';

interface ChatState {
  socket: any;
  chatroomList: ChatRoomType[];
  messageList: messageType[];
}

export const initialState: ChatState = {
  socket: null,
  chatroomList: [],
  messageList: [],
};

export type messageType = {
  content: string;
};

export const getChatroomList = async () => {
  const response = await axios.get<ChatRoomType[]>('chat/chatroom/');
  return response.data;
};

export const getMessageList = async (roomId: number) => {
  const response = await axios.get<messageType[]>(`chat/chatroom/${roomId}`);
  return response.data;
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSocket: (state, { payload }) => {
      state.socket = payload;
    },
    addMessage: (state, { payload }) => {
      state.messageList.push(payload);
    },
    getChatroomList: (state, { payload }) => {
      state.chatroomList = payload;
    },
    getMessageList: (state, { payload }) => {
      state.messageList = payload;
    },
  },
});

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
export const userActions = chatSlice.actions;
export const selectChatRoom = (state: RootState) => state.chat;

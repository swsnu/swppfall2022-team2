import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { ChatRoomType, UserType } from './user';
import axios, { AxiosResponse } from 'axios';

interface ChatState {
  chatroomList: ChatRoomType[];
  messageList: messageType[];
}

export const initialState: ChatState = {
  chatroomList: [],
  messageList: [],
};

export type messageType = {
  id : number;
  order : number;
  date : number;
  author: string;
  content: string;
};

export const getChatroomList = async () => {
  const response = await axios.get<ChatRoomType[]>('/chat/chatroom/');
  return response.data;
};

export const getMessageList =  createAsyncThunk(
  'chat/getMessage',
  async (roomId : string ,{dispatch}) => { 
    const response = await axios.get(`/chat/chatroom/${roomId}`);
    dispatch(chatActions.getMessageList(response.data));
    return response;
  }
);

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessage: (state, { payload }) => {
      state.messageList.push(payload);
    },
    getChatroomList: (state, { payload }) => {
      state.chatroomList = payload;
    },
    getMessageList: (state, action : PayloadAction<messageType[]>) => {
      state.messageList = action.payload;
    },
  },
});

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
export const userActions = chatSlice.actions;
export const selectChatRoom = (state: RootState) => state.chat;

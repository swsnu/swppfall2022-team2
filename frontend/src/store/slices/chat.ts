import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import axios, { AxiosResponse } from 'axios';



interface ChatState {
  messageList: messageType[];
}

export const initialState: ChatState = {
  messageList: [],
};

export type messageType = {
  id : number;
  order : number;
  date : number;
  author: string;
  content: string;
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
    getMessageList: (state, action : PayloadAction<messageType[]>) => {
      state.messageList = action.payload;
    },
  },
});



export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
export const userActions = chatSlice.actions;
export const selectChatRoom = (state: RootState) => state.chat;

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import axios from 'axios';
import { TemperatureFormType } from '../../chatting/ChatList';
import { chatActions } from './chat';

export interface MenuType {
  mealtype: string;
  menuplace: string;
  menuname: string;
  menuprice: string;
  menuextra: string;
}

export interface LoginFormType {
  username: string;
  password: string;
}

export interface UserType {
  id: number;
  username: string;
  temperature: number;
}

export interface ChatType {
  id: number;
  order: number;
  chatroom_id: number;
  author: number;
  content: string;
  date: string;
}

export interface ChatRoomType {
  id: number;
  opponent_id: number;
  last_chat: ChatType;
}

export interface LoggedInUserType {
  user: UserType;
  chatrooms: ChatRoomType[];
}

export interface UserInfoType {
  loggedinuser: LoggedInUserType | null;
  userlist: UserType[];
  menulist: MenuType[];
  chosenchatroom: ChatRoomType | null;
}

const initialState: UserInfoType = {
  loggedinuser: null,
  userlist: [],
  menulist: [],
  chosenchatroom: null,
};

export const setSignUp = createAsyncThunk(
  'user/setSignUp',
  async (loginForm: LoginFormType, { dispatch }) => {
    const response = await axios.post('/chat/user/signup/', loginForm);
    return response
  },
);

export const setSignIn = createAsyncThunk(
  'user/setSignIn',
  async (loginForm: LoginFormType, { dispatch }) => {
    const loginResponse = await axios.post('/chat/user/signin/', loginForm);
    if (loginResponse.status === 200) {
      const userlistResponse = await axios.get('/chat/user/');
      const userid: number = loginResponse.data.id;
      const chatroomlistResponse = await axios.get(`/chat/user/${userid}/`);
      const serverdata: LoggedInUserType = {
        user: loginResponse.data,
        chatrooms: chatroomlistResponse.data,
      };
      const menulistResponse = await axios.get('/menu/');
      dispatch(userActions.updateLoggedInUser(serverdata));
      dispatch(userActions.updateUserList(userlistResponse.data));
      dispatch(userActions.updateMenuList(menulistResponse.data));
    } else {
      //  this is not working...
      window.alert('wrong username or password');
    }
  },
);

export const setSignOut = createAsyncThunk(
  'user/setSignOut',
  async (userForm: UserType, { dispatch }) => {
    const response = await axios.get('/chat/user/signout/');
    dispatch(userActions.updateLoggedInUser(null));
    dispatch(userActions.updateUserList([]));
    return response
  },
);

export const createChatRoom = createAsyncThunk(
  'user/createChatRoom',
  async (chatOpponent: number, { dispatch }) => {
    const chatpost = { opponent: chatOpponent };
    const response = await axios.post('chat/chatroom/', chatpost);
    dispatch(chatActions.setSocket(response.data.chatroom_id));
    dispatch(userActions.selectChatRoom(response.data));
    dispatch(userActions.addChatRoom(response.data));
    return response.data.id; // for redirect in matching
  },
);

export const setTemperature = createAsyncThunk(
  'user/setTemperature',
  async (Form: TemperatureFormType, { dispatch }) => {
    const response = await axios.post(`/mypage/temp/${Form.user}/`, {"eval":Form.eval});
    return response
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateLoggedInUser: (state, action: PayloadAction<LoggedInUserType | null>) => {
      state.loggedinuser = action.payload;
    },

    updateUserList: (state, action: PayloadAction<UserType[]>) => {
      state.userlist = action.payload;
    },

    updateMenuList: (state, action: PayloadAction<MenuType[]>) => {
      state.menulist = action.payload;
    },

    selectChatRoom: (state, action: PayloadAction<ChatRoomType>) => {
      state.chosenchatroom = action.payload;
    },
    addChatRoom: (state, action: PayloadAction<ChatRoomType>) => {
      state.loggedinuser?.chatrooms.push(action.payload);
    },
  },
  extraReducers: (builder) => {},
});

export default userSlice.reducer;
export const userActions = userSlice.actions;
export const selectUser = (state: RootState) => state.user;

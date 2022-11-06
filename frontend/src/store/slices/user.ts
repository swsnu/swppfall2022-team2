import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import axios from "axios";

interface LoginFormType {
    username: string;
    password: string;
}

export interface UserType {
    id:number;
    username:string;
}

export interface ChatType {
    id: number;
    order: number;
    chatroom_id:number;
    author:number;
    content:string;
    date:string;
}

export interface ChatRoomType {
    id: number;
    opponent_id: number;
    last_chat: ChatType;
}

export interface LoggedInUserType {
    user : UserType;
    chatrooms : ChatRoomType[];
}


export interface UserInfoType {
    loggedinuser: LoggedInUserType|null;
    userlist : UserType[];
    chosenchatroom: ChatRoomType|null;
}

const initialState: UserInfoType = {
    loggedinuser: null,
    userlist: [],
    chosenchatroom: null
};


export const setSignUp = createAsyncThunk(
    'user/setSignUp', async(loginForm: LoginFormType, {dispatch}) =>{
        const response = await axios.post('/chat/user/signup/', loginForm);
    }
);

export const setSignIn = createAsyncThunk(
    'user/setSignIn', async(loginForm: LoginFormType, {dispatch}) =>{
        const loginResponse = await axios.post('/chat/user/signin/', loginForm)
        if(loginResponse.status ===200){
            const userlistResponse = await axios.get('/chat/user/')
            const userid = loginResponse.data.id;
            const chatroomlistResponse = await axios.get('/chat/user/'+userid+'/')
            const serverdata : LoggedInUserType = {user:loginResponse.data, chatrooms:chatroomlistResponse.data}
            dispatch(userActions.updateLoggedInUser(serverdata))
            dispatch(userActions.updateUserList(userlistResponse.data))
            
        }else{
            //this is not working...
            window.alert("wrong username or password")
        }
    }
);


export const setSignOut = createAsyncThunk(
    'user/setSignOut', async(userForm: UserType, {dispatch}) =>{
        const response = await axios.get('/chat/user/signout/')
        dispatch(userActions.updateLoggedInUser(null))
        dispatch(userActions.updateUserList([]))
    }
);

export const createChatRoom = createAsyncThunk(
    'user/createChatRoom', async(chatOpponent: number, {dispatch}) =>{
        const chatpost = {'opponent':chatOpponent}
        const response = await axios.post('chat/chatroom/', chatpost)
        dispatch(userActions.selectChatRoom(response.data))
        dispatch(userActions.addChatRoom(response.data))
    }
);


export const userSlice = createSlice({
    name:"user",
    initialState,
    reducers: {
        updateLoggedInUser: (state, action: PayloadAction<LoggedInUserType|null>)=>{
            state.loggedinuser = action.payload;
        },

        updateUserList: (state, action: PayloadAction<UserType[]>)=>{
            state.userlist = action.payload;
        },
        selectChatRoom: (state, action:PayloadAction<ChatRoomType>)=>{
            state.chosenchatroom = action.payload;
        },
        addChatRoom: (state, action:PayloadAction<ChatRoomType>)=>{
            state.loggedinuser?.chatrooms.push(action.payload);
        }
    },
    extraReducers: (builder) => {

    }
});


export default userSlice.reducer;
export const userActions = userSlice.actions;
export const selectUser = (state:RootState)=>state.user;
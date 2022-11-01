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

export interface ChatRoomType {
    id: number;
    opponentid: number;
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
        return response.status;
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
            console.log(serverdata)
            dispatch(userActions.updateLoggedInUser(serverdata))
            dispatch(userActions.updateUserList(userlistResponse.data))
            
        }else{
            //this is not working...
            window.alert("wrong username or password")
        }
    }
);


export const setSignOut = createAsyncThunk(
    'user/setSignOut', async() =>{
        const response = await axios.get('/chat/user/signout/')
    }
);

export const createChatRoom = createAsyncThunk(
    'user/createChatRoom', async() =>{

    }
);


export const userSlice = createSlice({
    name:"user",
    initialState,
    reducers: {
        updateLoggedInUser: (state, action: PayloadAction<LoggedInUserType>)=>{
            state.loggedinuser = action.payload;
        },

        updateUserList: (state, action: PayloadAction<UserType[]>)=>{
            state.userlist = action.payload;
        },
        seleteChatRoom: (state, action:PayloadAction<ChatRoomType>)=>{
            state.chosenchatroom = action.payload;
        }
        
    },
    extraReducers: (builder) => {

    }
});


export default userSlice.reducer;
export const userActions = userSlice.actions;
export const selectUser = (state:RootState)=>state.user;
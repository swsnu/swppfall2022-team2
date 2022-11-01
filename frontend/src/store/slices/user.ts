import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
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

export interface LoggedInUserType {
    id: number;
    name: string;
    chatrooms : ChatRoomType[];
}

export interface ChatRoomType {
    id: number;
    opponentid: number;
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
        if(loginResponse.status ===204){
            console.log(loginResponse.data)
            //dispatch() //set login 
        }else{
            console.log("login failed")
            return null;
        }
    }
);


export const setSignOut = createAsyncThunk(
    'user/setSignOut', async() =>{
        const response = await axios.get('/chat/user/signout/')
        return response.data;
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
        //here we create action: action handler pair
        //here we can write mutable code when we change the state.
        
    },
    extraReducers: (builder) => {

    }
});


export default userSlice.reducer;
export const userActions = userSlice.actions;
export const selectUser = (state:RootState)=>state.user;
import { render, screen } from '@testing-library/react';
import {  AnyAction, configureStore, EnhancedStore} from "@reduxjs/toolkit";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";
import reducer, { UserInfoType, LoggedInUserType, LoginFormType, ChatRoomType, ChatType, UserType } from "./user";
import { setSignIn, setSignOut, setSignUp, createChatRoom } from "./user";

jest.mock('axios');

describe("user reducer", () => {
    let store: EnhancedStore<
        { user : UserInfoType },
        AnyAction,
        [ThunkMiddleware<{ user : UserInfoType }, AnyAction, 
        undefined>]
     >;
    
    const loggedinuser: UserType = {
            id: 1,
            username: "user1"
        };
    
    const mychatroom: ChatRoomType = {
        id: 1,
                opponent_id: 2,
                last_chat: {
                    id: 1,
                    order:1,
                    chatroom_id:1,
                    author:1,
                    content:"hello",
                    date: "20220831"
                }
    }
    const mychatrooms: ChatRoomType[] = [
            mychatroom
    ];


    const userlist: UserType[] = [
        {
            id:1,
            username: "user1"
        },
        {
            id:2,
            username: "user2"
        }
    ];

    const loginForm: LoginFormType = {
        username: "user1",
        password: "user1password"
    }

    beforeAll(() => {
     store = configureStore(
     { reducer: { user : reducer } }
     );
     }); // end beforeAll
    
    it("should handle initial state", () => {
        //if you give undefined state and action then you expect to get the initial state
        expect(reducer(undefined, { type: "unknown" })).toEqual({
            loggedinuser: null,
            userlist: [],
            chosenchatroom: null,
        });
    });

    it("should handle setSignUp correctly", async () => {
        (axios.post as jest.Mock).mockResolvedValue({});
        await store.dispatch(setSignUp(loginForm));
    });

    it("should handle setSignIn correctly", async () => {
        (axios.post as jest.Mock).mockResolvedValue({ status:200, data:{id:1, username: "user1"} });
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: userlist});
        (axios.get as jest.Mock).mockResolvedValueOnce({ status:200, data: mychatrooms });
        await store.dispatch(setSignIn(loginForm));
        expect(store.getState().user.loggedinuser).toEqual({user:{id:1, username: "user1"}, chatrooms:mychatrooms});
    });

    it("should handle setSignOut correctly", async () => {
        (axios.get as jest.Mock).mockResolvedValue({ });
        await store.dispatch(setSignOut({id:1, username: "user1"}));
        expect(store.getState().user.loggedinuser).toEqual(null);
        expect(store.getState().user.userlist).toEqual([]);
    });

    it("should handle createChatRoom correctly", async () => {
        (axios.post as jest.Mock).mockResolvedValue({mychatroom});
        await store.dispatch(createChatRoom(2));
        //expect(store.getState().user.chosenchatroom).toEqual(mychatroom);
        //expect(store.getState().user.loggedinuser?.chatrooms).toContainEqual(mychatroom);
    });

    
}); // end describe

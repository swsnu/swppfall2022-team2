import { render, screen } from '@testing-library/react';
import {  AnyAction, configureStore, EnhancedStore} from "@reduxjs/toolkit";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";
import reducer, { MenuType, UserInfoType, LoggedInUserType, LoginFormType, ChatRoomType, ChatType, UserType, SignUpFormType } from "./user";
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
            nickname: 'test1'
        };
    
    const mychatroom: ChatRoomType = {
            id: 1,
            roomtype: '개인',
            user_id: [2],
            name: '',
            last_chat: { id: 0, order: 1, chatroom_id: 1, author: 2, content: 'asd', date: '220202' },
    }

    const mychatrooms: ChatRoomType[] = [
            mychatroom
    ];

    const mymenus: MenuType[] = [
        {
            mealtype: 'lunch',
            menuplace: '기숙사',
            menuname: 'menu1',
            menuprice: '4000',
            menuextra: '',
        },
    ];


    const userlist: UserType[] = [
        {
            id:1,
            nickname: 'test1'
        },
        {
            id:2,
            nickname: 'test2'
        }
    ];

    const loginForm: LoginFormType = {
        username: "user1",
        password: "user1password"
    }

    const signUpForm: SignUpFormType = {
        username: "user1",
        password: "user1password",
        nickname: "test1",
        name: "test1name",
        mbti: "ENTJ",
        gender: "M",
        birth: "990901",
        email: "test1@snu.ac.kr"
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
            menulist: [],
            chosenchatroom: null,
        });
    });

    it("should handle setSignUp correctly", async () => {
        (axios.post as jest.Mock).mockResolvedValueOnce({});
        await store.dispatch(setSignUp(signUpForm));
    });

    it("should handle setSignIn correctly", async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: userlist});
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: loggedinuser});
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mychatrooms });
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mymenus });
        await store.dispatch(setSignIn(1));
        expect(store.getState().user.loggedinuser).toEqual({user:{id:1, nickname: "test1"}, chatrooms:mychatrooms});
        expect(store.getState().user.userlist).toEqual(userlist);
        expect(store.getState().user.menulist).toEqual(mymenus);
    });

    it("should handle setSignOut correctly", async () => {
        (axios.get as jest.Mock).mockResolvedValue({ });
        await store.dispatch(setSignOut({id:1, nickname: "test1"}));
        expect(store.getState().user.loggedinuser).toEqual(null);
        expect(store.getState().user.userlist).toEqual([]);
    });

    it("should handle createChatRoom correctly", async () => {
        (axios.post as jest.Mock).mockResolvedValueOnce({mychatroom});
        await store.dispatch(createChatRoom([1,2]));
        //expect(store.getState().user.chosenchatroom).toEqual(mychatroom);
        //expect(store.getState().user.loggedinuser?.chatrooms).toContainEqual(mychatrooms);
    });

    
}); // end describe

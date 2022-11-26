import ChatList from "./ChatList";
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getMockStore } from '../test-utils/mocks';
import React from 'react';
import {
  UserType,
  ChatType,
  ChatRoomType,
  LoggedInUserType,
  UserInfoType,
} from '../store/slices/user';

import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import axios from 'axios';

const initialState: UserInfoType = {
  loggedinuser: {
    user:{
        id: 1,
        username: "user1",
        temperature : 36.5
    },
    chatrooms:[
        {
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
    ]
  },
  userlist: [
    {
        id:1,
        username: "user1",
        temperature : 36.5
    },
    {
        id:2,
        username: "user2",
        temperature : 36.5
    }
  ],
  chosenchatroom: null,
  menulist: []
};

const mockStore = getMockStore({ user: initialState });

//mock the navigate
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
 ...jest.requireActual("react-router"),
useNavigate: () => mockNavigate,
}));

//mock the dispatch
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
 ...jest.requireActual("react-redux"),
useDispatch: () => mockDispatch,
}));

describe('ChatList', () => {
    let chatlist: JSX.Element;
    beforeEach(() => {
      jest.clearAllMocks();
      chatlist = (
        <Provider store={mockStore}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<ChatList />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    });
    it("should ravigate to main and matching correctly", () => {
        render(chatlist);
        screen.getByText("Chating Rooms");
        screen.getByText("3 months ago");
        screen.getByText("hello");
        const chatroomButton = screen.getByText("user2")
        const tempButton = screen.getByText("36.5 ° C");
        fireEvent.click(chatroomButton!);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });       
});
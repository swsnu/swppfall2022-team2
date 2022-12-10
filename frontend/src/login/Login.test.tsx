import Login from "./Login";
import Main from "../Main";
import { fireEvent, render, screen } from '@testing-library/react';
import { getMockStore } from '../test-utils/mocks';
import userEvent from "@testing-library/user-event";
import React from 'react';
import {
  UserType,
  ChatType,
  ChatRoomType,
  LoggedInUserType,
  UserInfoType,
} from '../store/slices/user';
import {configure, waitFor} from '@testing-library/dom'
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import axios from 'axios';

configure({ testIdAttribute: 'type' })

const initialState: UserInfoType = {
  loggedinuser: null,
  userlist: [],
  chosenchatroom: null,
  menulist: [],
};

const initialState1: UserInfoType = {
  loggedinuser: {
    user: { id: 1, nickname: 'test1' },
    chatrooms: [
      {
        id: 1,
        roomtype: '개인',
        user_id: [2],
        name: '',
        last_chat: { id: 0, order: 1, chatroom_id: 1, author: 2, content: 'asd', date: '220202' },
      },
    ],
  },
  menulist: [
    {
      mealtype: 'lunch',
      menuplace: '학생회관',
      menuname: 'menu1',
      menuprice: '4000',
      menuextra: '',
    },
    {
      mealtype: 'lunch',
      menuplace: '기숙사',
      menuname: 'menu1',
      menuprice: '4000',
      menuextra: '',
    },
  ],
  userlist: [{ id: 1, nickname: 'test1' },{ id: 2, nickname: 'test2' }],
  chosenchatroom: null,
};

const mockStore = getMockStore({ user: initialState });
const mockStore1 = getMockStore({ user: initialState1});

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

jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('Login', () => {
    let login: JSX.Element;
    beforeEach(() => {
      jest.clearAllMocks();
      login = (
        <Provider store={mockStore}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/main' element={<Main />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    });
    it("works well when you type in username and password", async() => {
        jest.spyOn(axios, 'post').mockResolvedValue({
          user: {
            id: 1,
            nickname: "user1nickname",
          },
        });
        render(login);  
        screen.getByText("아이디");
        screen.getByText("비밀번호");
        const usernameInput = screen.getByTestId("username");
        const passwordInput = screen.getByTestId("password");
        const loginButton = screen.getByText("로그인");
        fireEvent.change(usernameInput,{target: {value: "user1"}});
        fireEvent.change(passwordInput,{target:{value: "user1password"}});
        await screen.findByDisplayValue("user1"); //values displayed on the screen
        await screen.findByDisplayValue("user1password"); //values displayed on the screen
        fireEvent.click(loginButton!);
        await waitFor(() => expect(axios.post).toHaveBeenCalled());
    });
    it("goes to main page when you are already logged in", async() => {    
      login = (
        <Provider store={mockStore1}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/main' element={<Main />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      )
      render(login); 
     });
     it("works well with the enter", async() => {
      jest.spyOn(axios, 'post').mockResolvedValue({
        user: {
          id: 1,
          nickname: "user1nickname",
        },
      });
      render(login);  
      screen.getByText("아이디");
      screen.getByText("비밀번호");
      const usernameInput = screen.getByTestId("username");
      const passwordInput = screen.getByTestId("password");
      fireEvent.change(usernameInput,{target: {value: "user1"}});
      userEvent.type(passwordInput, "12345678{enter}");
      await waitFor(() => expect(axios.post).toHaveBeenCalled());
    });
    it("should alert when you do not have password", async() => {
      jest.spyOn(axios, 'post').mockResolvedValue({
        user: {
          id: 1,
          nickname: "user1nickname",
        },
      });
      render(login);  
      screen.getByText("아이디");
      screen.getByText("비밀번호");
      const usernameInput = screen.getByTestId("username");
      const passwordInput = screen.getByTestId("password");
      const loginButton = screen.getByText("로그인");
      fireEvent.change(usernameInput,{target: {value: "user1"}});
      fireEvent.click(loginButton!);
      await waitFor(() => expect(window.alert).toHaveBeenCalled());
    });
    it("should alert when you enter wrong password", async() => {
      jest.spyOn(axios, 'post').mockRejectedValue({});
      render(login);  
      screen.getByText("아이디");
      screen.getByText("비밀번호");
      const usernameInput = screen.getByTestId("username");
      const passwordInput = screen.getByTestId("password");
      const loginButton = screen.getByText("로그인");
      fireEvent.change(usernameInput,{target: {value: "user1"}});
      fireEvent.change(passwordInput,{target:{value: "user1password"}});
      fireEvent.click(loginButton!);
      await waitFor(() => expect(window.alert).toHaveBeenCalled());
    });
    it("should ravigate to SignUp correctly", () => {
        render(login);
        const signuplink = screen.getByText("계정을 만들고 싶습니다.");
        fireEvent.click(signuplink!);
        expect(mockNavigate).toHaveBeenCalledWith('/signup');
    });
});
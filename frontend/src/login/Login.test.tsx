import Login from "./Login";
import { fireEvent, render, screen } from '@testing-library/react';
import { getMockStore } from '../test-utils/mocks';
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

describe('Login', () => {
    let login: JSX.Element;
    beforeEach(() => {
      jest.clearAllMocks();
      login = (
        <Provider store={mockStore}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<Login />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    });
    it("should render correctly", async() => {
        render(login);
        screen.getByText("밥친구");
        screen.getByText("Enter Username");
        screen.getByText("Enter Password");
        const usernameInput = screen.getByTestId("username");
        const passwordInput = screen.getByTestId("password");
        const loginButton = screen.getByText("Login!");
        fireEvent.change(usernameInput,{target: {value: "user1"}});
        fireEvent.change(passwordInput,{target:{value: "user1password"}});
        await screen.findByDisplayValue("user1"); //values displayed on the screen
        await screen.findByDisplayValue("user1password"); //values displayed on the screen
        fireEvent.click(loginButton!);
        await waitFor(()=>expect(mockDispatch).toHaveBeenCalledTimes(1));
    });       
    it("should ravigate to SignUp correctly", () => {
        render(login);
        const signuplink = screen.getByText("Want to create an account?");
        fireEvent.click(signuplink!);
        expect(mockNavigate).toHaveBeenCalledWith('/signup');
    });
});
import SignUp from "./SignUp";
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
  menulist: [],
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

describe('SignUp', () => {
    let signup: JSX.Element;
    beforeEach(() => {
      jest.clearAllMocks();
      signup = (
        <Provider store={mockStore}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<SignUp />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    });
    it("should render correctly", async() => {
        render(signup);
        screen.getByText("밥친구");
        screen.getByText("New Username");
        screen.getByText("New Password");
        const usernameInput = screen.getByTestId("username");
        const passwordInput = screen.getByTestId("password");
        const signupButton = screen.getByText("Sign Up!");
        fireEvent.change(usernameInput,{target: {value: "user1"}});
        fireEvent.change(passwordInput,{target:{value: "user1password"}});
        await screen.findByDisplayValue("user1"); //values displayed on the screen
        await screen.findByDisplayValue("user1password"); //values displayed on the screen
        fireEvent.click(signupButton!);
        await waitFor(()=>expect(mockDispatch).toHaveBeenCalledTimes(1));
        await waitFor(()=>expect(mockNavigate).toHaveBeenCalledWith("/login"));
    });       
    it("should ravigate to Login correctly", () => {
        render(signup);
        const loginlink = screen.getByText("Already have an account?");
        fireEvent.click(loginlink!);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});
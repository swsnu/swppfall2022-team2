import NavBar from "./NavBar";
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getMockStore } from './test-utils/mocks';
import React from 'react';
import {
  UserType,
  ChatType,
  ChatRoomType,
  LoggedInUserType,
  UserInfoType,
} from './store/slices/user';

import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import axios from 'axios';

const initialState: UserInfoType = {
  loggedinuser: null,
  userlist: [],
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

describe('NavBar', () => {
    let navbar: JSX.Element;
    beforeEach(() => {
      jest.clearAllMocks();
      navbar = (
        <Provider store={mockStore}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<NavBar />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    });
    it("should ravigate to main and matching correctly", () => {
        render(navbar);
        const homeButton = screen.getByText("Home");
        fireEvent.click(homeButton!);
        expect(mockNavigate).toHaveBeenCalledWith('/main');
        const matchButton = screen.getByText("Matching");
        fireEvent.click(matchButton!);
        expect(mockNavigate).toHaveBeenCalledWith('/matching');
    });       
    it("should ravigate to mypage correctly", () => {
        render(navbar);
        const mypageButton = screen.getByText("MyPage");
        fireEvent.click(mypageButton!);
        expect(mockNavigate).toHaveBeenCalledWith('/mypage');
    });
    it("should handle logout correctly", async() => {
        render(navbar);
        const logoutButton = screen.getByText("Logout");
        fireEvent.click(logoutButton!);
        await waitFor(()=>expect(mockDispatch).toHaveBeenCalledTimes(1));
    });
});
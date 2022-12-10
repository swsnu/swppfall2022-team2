import NavBar from "./NavBar";
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getMockStore } from './test-utils/mocks';
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
        const homeButton = screen.getByText("홈");
        fireEvent.click(homeButton!);
        expect(mockNavigate).toHaveBeenCalledWith('/main');
        const matchButton = screen.getByText("친구 찾기");
        fireEvent.click(matchButton!);
        expect(mockNavigate).toHaveBeenCalledWith('/matching');
    });       
    it("should ravigate to mypage correctly", () => {
        render(navbar);
        const mypageButton = screen.getByText("마이페이지");
        fireEvent.click(mypageButton!);
        expect(mockNavigate).toHaveBeenCalledWith('/mypage');
    });
    it("should handle logout correctly", async() => {
        render(navbar);
        const logoutButton = screen.getByText("로그아웃");
        fireEvent.click(logoutButton!);
        await waitFor(()=>expect(mockDispatch).toHaveBeenCalled());
        await waitFor(()=>expect(mockNavigate).toHaveBeenCalled());
    });
});
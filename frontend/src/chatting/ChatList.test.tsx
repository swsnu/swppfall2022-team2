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
import {configure} from '@testing-library/dom'
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import axios from 'axios';

configure({ testIdAttribute: 'class' })

const initialState: UserInfoType = {
  loggedinuser: {
    user: { id: 1, nickname: 'test1' },
    chatrooms: [
      {
        id: 1,
        roomtype: '개인',
        user_id: [2],
        name: '',
        last_chat: { id: 0, order: 1, chatroom_id: 1, author: 2, content: 'asd', date: '' },
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

jest.spyOn(window, 'alert').mockImplementation(() => {});

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
    it("should render modal correctly", () => {
        jest.spyOn(axios, 'post').mockResolvedValueOnce({
          status:204
        });
        render(chatlist);
        screen.getByText("채팅방");
        screen.getByText("Invalid date");
        screen.getByText("asd");
        const chatroomButton = screen.getByText("asd")
        const tempButton = screen.getByText("test2님 평가하기")
        fireEvent.click(tempButton!);
        const text1 = screen.findByText("매너 평가를 해주세요")
        const bestButton = screen.getByText("최고")
        fireEvent.click(bestButton!);
        waitFor(() => expect(axios.post).toHaveBeenCalled());
        waitFor(() => expect(window.alert).toHaveBeenCalled());
        fireEvent.click(tempButton!);
        const text2 = screen.findByText("매너 평가를 해주세요")
        const goodButton = screen.getByText("좋음")
        fireEvent.click(goodButton!);
        waitFor(() => expect(axios.post).toHaveBeenCalled());
        waitFor(() => expect(window.alert).toHaveBeenCalled());
        fireEvent.click(tempButton!);
        const text3 = screen.findByText("매너 평가를 해주세요")
        const midButton = screen.getByText("보통")
        fireEvent.click(midButton!);
        waitFor(() => expect(axios.post).toHaveBeenCalled());
        waitFor(() => expect(window.alert).toHaveBeenCalled());
        fireEvent.click(tempButton!);
        const text4 = screen.findByText("매너 평가를 해주세요")
        const badButton = screen.getByText("별로")
        fireEvent.click(badButton!);
        waitFor(() => expect(axios.post).toHaveBeenCalled());
        waitFor(() => expect(window.alert).toHaveBeenCalled());
        fireEvent.click(tempButton!);
        const text5 = screen.findByText("매너 평가를 해주세요")
        const worstButton = screen.getByText("최악")
        fireEvent.click(worstButton!);
        waitFor(() => expect(axios.post).toHaveBeenCalled());
        waitFor(() => expect(window.alert).toHaveBeenCalled());
    });
    it("should ravigate to chatting room correctly", () => {
      render(chatlist);
      screen.getByText("채팅방");
      const chatroomButton = screen.getByText("asd")
      fireEvent.click(chatroomButton!);
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalled();
    });
    it("should close chatting room correctly", () => {
      jest.spyOn(axios, 'get').mockResolvedValueOnce({
        data:{
          id: 1,
          roomtype: '개인',
          user_id: [2],
          name: '',
          last_chat: { id: 0, order: 1, chatroom_id: 1, author: 2, content: 'asd', date: '' },
        }
      });
      render(chatlist);
      screen.getByText("채팅방");
      const closeButton = screen.getByTestId("btn-close");
      fireEvent.click(closeButton!);
      expect(mockDispatch).toHaveBeenCalled();
      waitFor(() => expect(axios.get).toHaveBeenCalled());
  });
});
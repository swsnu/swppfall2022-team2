import Menu from "./Menu";
import {fireEvent, render, screen } from '@testing-library/react';
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
      mealtype: 'breakfast',
      menuplace: '학생식당',
      menuname: 'menu1',
      menuprice: '4000',
      menuextra: '1',
    },
    {
      mealtype: 'lunch',
      menuplace: '기숙사식당',
      menuname: 'menu2',
      menuprice: '5000',
      menuextra: '2',
    },
    {
      mealtype: 'dinner',
      menuplace: '전망대(3식당)',
      menuname: 'menu3',
      menuprice: '6000',
      menuextra: '3',
    }
  ],
  userlist: [{ id: 1, nickname: 'test1' },{ id: 2, nickname: 'test2' }],
  chosenchatroom: null,
};

  
  const mockStore = getMockStore({ user: initialState });
  
  
  describe('Menu', () => {
      let menulist: JSX.Element;
      beforeEach(() => {
        jest.clearAllMocks();
        menulist = (
          <Provider store={mockStore}>
            <MemoryRouter>
              <Routes>
                <Route path='/' element={<Menu />} />
              </Routes>
            </MemoryRouter>
          </Provider>
        );
      });
      it("should render the menus correctly", () => {
          render(menulist);
          const breakfastButton = screen.getByText("아침")
          fireEvent.click(breakfastButton!);
          screen.getByText("학생식당");
          const lunchButton = screen.getByText("점심")
          fireEvent.click(lunchButton!);
          screen.getByText("기숙사식당");
          const dinnerButton = screen.getByText("저녁")
          fireEvent.click(dinnerButton!);
          screen.getByText("전망대(3식당)");
      });       
  });
import Menu from "./Menu";
import {render, screen } from '@testing-library/react';
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
    menulist: [{mealtype:"lunch", menuplace:"학생식당", menuname:"제육덮밥", menuprice:"5000",menuextra:"" }]
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
          screen.getByText("학생식당");
          const breakfasttab = screen.getByText("아침")
          const lunchtab = screen.getByText("점심")
          const dinnertab = screen.getByText("저녁")
      });       
  });
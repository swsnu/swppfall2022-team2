import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getMockStore } from '../test-utils/mocks';
import GroupMatchingStatus from './GroupMatchingStatus';
import React from 'react';
import {
  UserType,
  ChatType,
  ChatRoomType,
  LoggedInUserType,
  UserInfoType,
} from '../store/slices/user';
import { Provider, useDispatch } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import axios from 'axios';
const initialState: UserInfoType = {
  loggedinuser: {
    user: { id: 3, nickname: 'test' },
    chatrooms: [
      {
        id: 77,
        roomtype: '개인',
        user_id: [7],
        name: '',
        last_chat: { id: 0, order: 1, chatroom_id: 2, author: 7, content: 'asd', date: '220202' },
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
  ],
  userlist: [],
  chosenchatroom: null,
};
const mockStore = getMockStore({ user: initialState });
interface matchedOpponentType {
  id: number;
  name: string;
  temperature: string;
}
interface conditionType {
  time: string;
  menu: string;
  num: string;
}
interface propsType {
  matched: boolean;
  matchedOpponents: matchedOpponentType[] | null;
  numMatching: number | null;
  matchedCondition: conditionType;
}
const opponent1: matchedOpponentType = {
  id: 1,
  name: 'name1',
  temperature: '35',
};
const opponent2: matchedOpponentType = {
  id: 2,
  name: 'name2',
  temperature: '35',
};
const opponent3: matchedOpponentType = {
  id: 3,
  name: 'name3',
  temperature: '35',
};
const props: propsType = {
  matched: true,
  matchedOpponents: [opponent1, opponent2],
  numMatching: 3,
  matchedCondition: { time: '1230', menu: 'menu1', num: '34' },
};
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));
const mockDispatch = jest.fn().mockResolvedValue({
  payload: 3,
});
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
describe('MatchingCondition', () => {
  let status: JSX.Element;
  beforeEach(() => {
    jest.clearAllMocks();
    status = (
      <Provider store={mockStore}>
        <MemoryRouter>
          <Routes>
            <Route path='/' element={<GroupMatchingStatus {...props} />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  });
  it('time', async () => {
    render(status);
    const time = ['1130', '1200', '1230', '1300', '1800', '1830', '1900'];

    let propsTime: propsType = {
      matched: false,
      matchedOpponents: [opponent1, opponent2, opponent3],
      numMatching: 3,
      matchedCondition: { time: '1230', menu: 'menu1', num: '3' },
    };
    time.forEach((time) => {
      propsTime.matchedCondition.time = time;
      status = (
        <Provider store={mockStore}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<GroupMatchingStatus {...propsTime} />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
      render(status);
    });
  });
  it('when matched', async () => {
    status = (
      <Provider store={mockStore}>
        <MemoryRouter>
          <Routes>
            <Route path='/' element={<GroupMatchingStatus {...props} />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    render(status);
  });
  it('makechat when exist', async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: [
        { id: 1, user_id: [1, 2] },
        { id: 2, user_id: [1] },
      ],
    });
    render(status);
    const makeChatButton = screen.getByText('그룹채팅시작');
    fireEvent.click(makeChatButton!);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });
  it('makechat when not exist1 : test checkSameChatRoom', async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: [{ id: 7, user_id: [7] }],
    });
    render(status);
    const makeChatButton = screen.getByText('그룹채팅시작');
    fireEvent.click(makeChatButton!);
    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
    // await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });
  it('makechat when not exist2 : test checkSameChatRoom', async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: [
        { id: 7, user_id: [7, 8] },
        { id: 8, user_id: [8] },
      ],
    });
    render(status);
    const makeChatButton = screen.getByText('그룹채팅시작');
    fireEvent.click(makeChatButton!);
    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
  });
  it('makechat when not exist3 : undefined chatRoomId', async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: [],
    });
    render(status);
    const makeChatButton = screen.getByText('그룹채팅시작');
    fireEvent.click(makeChatButton!);
    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
  });
});

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
  loggedinuser: { user: { id: 3, username: 'test', temperature: 36.5 }, chatrooms: [] },
  menulist: [],
  userlist: [],
  chosenchatroom: null,
};
const mockStore = getMockStore({ user: initialState });
interface matchedOpponentType {
  id: number;
  name: string;
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
};
const opponent2: matchedOpponentType = {
  id: 2,
  name: 'name2',
};
const opponent3: matchedOpponentType = {
  id: 3,
  name: 'name3',
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
    const time = ['1200', '1230', '1300', '1800', '1830', '1900'];

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
});
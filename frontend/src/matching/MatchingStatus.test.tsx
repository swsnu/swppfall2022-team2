import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getMockStore } from '../test-utils/mocks';
import MatchingStatus from './MatchingStatus';
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
  loggedinuser: { user: { id: 3, username: 'test' }, chatrooms: [] },
  userlist: [],
  chosenchatroom: null,
};
const mockStore = getMockStore({ user: initialState });
interface matchedOpponentType {
  time: string;
  spaceUser: string; // wanted space of this user
  spaceOpponent: string; // wanted space of matched opponent
  mbti: string;
  gender: string;
  age: string;
  id: number;
  name: string;
}
interface propsType {
  matched: boolean;
  matchedOpponent: matchedOpponentType | null;
  numMatching: number | null;
}
const props: propsType = {
  matched: false,
  matchedOpponent: null,
  numMatching: null,
};
const props2: propsType = {
  matched: false,
  matchedOpponent: null,
  numMatching: 1,
};
const opponent: matchedOpponentType = {
  time: '0',
  spaceUser: '',
  spaceOpponent: '',
  mbti: 'INFP',
  gender: 'M',
  age: '22',
  id: 1,
  name: 'opponame',
};
const props3: propsType = {
  matched: true,
  matchedOpponent: opponent,
  numMatching: 1,
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
            <Route path='/' element={<MatchingStatus {...props3} />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  });
  it('render when not start matching, not matached', () => {
    status = (
      <Provider store={mockStore}>
        <MemoryRouter>
          <Routes>
            <Route path='/' element={<MatchingStatus {...props} />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    render(status);
    expect(screen.getByText('아래의 매칭 버튼을 눌러 매칭을 시작하세요')).toBeInTheDocument();
    status = (
      <Provider store={mockStore}>
        <MemoryRouter>
          <Routes>
            <Route path='/' element={<MatchingStatus {...props2} />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    render(status);
    expect(screen.getByText('매칭 큐에 등록되었습니다')).toBeInTheDocument();
  });
  it('when matched, time', () => {
    render(status);
    const time = ['1200', '1230', '1300', '1800', '1830', '1900'];
    let opponentTime: matchedOpponentType = {
      time: '0',
      spaceUser: '',
      spaceOpponent: '',
      mbti: 'INFP',
      gender: 'M',
      age: '22',
      id: 1,
      name: 'opponame',
    };
    let propsTime: propsType = {
      matched: true,
      matchedOpponent: opponentTime,
      numMatching: 1,
    };
    time.forEach((time) => {
      opponentTime.time = time;
      status = (
        <Provider store={mockStore}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<MatchingStatus {...propsTime} />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
      render(status);
    });
  });
  it('when matched, space', () => {
    render(status);
    const space = ['dormitory', 'student', '301'];
    let opponentSpace: matchedOpponentType = {
      time: '0',
      spaceUser: '',
      spaceOpponent: '',
      mbti: 'INFP',
      gender: 'M',
      age: '22',
      id: 1,
      name: 'opponame',
    };
    let propsSpace: propsType = {
      matched: true,
      matchedOpponent: opponentSpace,
      numMatching: 1,
    };
    space.forEach((space) => {
      opponentSpace.spaceUser = space;
      status = (
        <Provider store={mockStore}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<MatchingStatus {...propsSpace} />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
      render(status);
    });
    space.forEach((space) => {
      opponentSpace.spaceOpponent = space;
      status = (
        <Provider store={mockStore}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<MatchingStatus {...propsSpace} />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
      render(status);
    });
  });
  it('makechat when exist', async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: [
        { id: 1, opponent_id: 3 },
        { id: 2, opponent_id: 1 },
      ],
    });
    render(status);
    const makeChatButton = screen.getByText('채팅시작');
    fireEvent.click(makeChatButton!);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });
  it('makechat when not exist', async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: [{ id: 7, opponent_id: 7 }],
    });
    render(status);
    const makeChatButton = screen.getByText('채팅시작');
    fireEvent.click(makeChatButton!);
    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
    // await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });
});

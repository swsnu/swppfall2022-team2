import { getMockStore } from '../test-utils/mocks';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {
    UserInfoType,
  } from '../store/slices/user';
import BlockUser from './BlockUser';
import { statusType } from './MyPage';

const initialState: UserInfoType = {
    loggedinuser: null,
    userlist: [],
    menulist: [],
    chosenchatroom: null,
  };
interface propsType {
    status: statusType;
    blockSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, nickname:string) => any;
    unblockSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, nickname:string) => any;
}

const blockSumbitMock = jest.fn();
const unblockSumbitMock = jest.fn();

const props: propsType = {
    status: {name: '',
    mbti: '',
    intro: '',
    birth: '',
    gender: '',
    nickname: '',
    matched_users: ['한국'],
    blocked_users: ['가나'],
    temperature: 0.0,},
    blockSubmit: blockSumbitMock,
    unblockSubmit: unblockSumbitMock,
  };

const mockStore = getMockStore({ user: initialState });

describe('BlockUser', () => {
    let blockuser: JSX.Element;
    beforeEach(() => {
      jest.clearAllMocks();
      blockuser = (
        <Provider store={mockStore}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<BlockUser {...props}/>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    });
    it('should render correctly', async () => {
        render(blockuser);
        screen.getByText("한국");
        screen.getByText("가나");
    })
    it('block correctly', async () => {
        render(blockuser);
        const blockClick = screen.getByText("차단");
        fireEvent.click(blockClick!);
        expect(blockSumbitMock).toHaveBeenCalled();
    })
    it('unblock correctly', async () => {
        render(blockuser);
        const unblockClick = screen.getByText("차단 해제");
        fireEvent.click(unblockClick!);
        expect(unblockSumbitMock).toHaveBeenCalled();
    })
});
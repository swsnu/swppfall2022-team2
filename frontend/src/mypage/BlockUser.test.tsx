import { getMockStore } from '../test-utils/mocks';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {
    UserInfoType,
  } from '../store/slices/user';
import BlockUser from './BlockUser';
import { statusType } from './MyPage';
import axios from 'axios';

const initialState: UserInfoType = {
    loggedinuser: null,
    userlist: [],
    menulist: [],
    chosenchatroom: null,
  };
interface propsType {
    status: statusType;
    handleStatus: (a: statusType) => void;
}

const handleStatusMock = jest.fn();

const props: propsType = {
    status: {name: '',
    mbti: '',
    intro: '',
    birth: '',
    gender: '',
    nickname: '',
    matched_users: ['한국','일본'],
    blocked_users: ['가나','스페인'],
    temperature: 0.0,},
    handleStatus: handleStatusMock,
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
    it('block and unblock correctly', async () => {
        jest.spyOn(axios, 'post').mockResolvedValue({
          status: 200, 
        });
        const blockuserRender = render(blockuser);
        const blockClick = blockuserRender.container.querySelector('#한국');
        fireEvent.click(blockClick!);
        await waitFor(() => expect(handleStatusMock).toHaveBeenCalled());
        await waitFor(() => expect(axios.post).toHaveBeenCalled());
        const unblockClick = blockuserRender.container.querySelector('#가나');
        fireEvent.click(unblockClick!);
        await waitFor(() => expect(handleStatusMock).toHaveBeenCalled());
        await waitFor(() => expect(axios.post).toHaveBeenCalled());
    });
});
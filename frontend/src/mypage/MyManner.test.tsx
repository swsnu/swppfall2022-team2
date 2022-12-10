import { getMockStore } from '../test-utils/mocks';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {
    UserInfoType,
  } from '../store/slices/user';
import MyManner from './MyManner';

const initialState: UserInfoType = {
    loggedinuser: null,
    userlist: [],
    menulist: [],
    chosenchatroom: null,
  };

const mockStore = getMockStore({ user: initialState });

describe('MyManner', () => {
    let mymanner: JSX.Element;
    beforeEach(() => {
      jest.clearAllMocks();
      mymanner = (
        <Provider store={mockStore}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<MyManner temperature={36.5}/>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    });
    it('should render correctly', async () => {
        render(mymanner);
        screen.getByText("당신의 매너 온도는 36.5입니다.");
    })
});
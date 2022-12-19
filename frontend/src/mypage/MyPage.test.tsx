import { getMockStore } from '../test-utils/mocks';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {
    LoggedInUserType,
    UserInfoType,
  } from '../store/slices/user';
import MyPage from './MyPage';
import Login from '../login/Login';
import axios from 'axios';

const mockDispatch = jest.fn().mockResolvedValue({
    payload: 3,
  });
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
  }));
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
  }));
const user: LoggedInUserType = {
    user: { id: 77, nickname: 'testuser' },
    chatrooms: [],
  };

const initialState: UserInfoType = {
    loggedinuser: user,
    userlist: [],
    menulist: [],
    chosenchatroom: null,
  };
  const initialStateNull: UserInfoType = {
    loggedinuser: null,
    userlist: [],
    menulist: [],
    chosenchatroom: null,
  };

const mockStore = getMockStore({ user: initialState });
const mockStoreNullUser = getMockStore({ user: initialStateNull });
jest.spyOn(window, 'alert').mockImplementation(() => null);
Object.defineProperty(window, 'location', {
    configurable: true,
    value: { reload: jest.fn() },
  });

describe('MyPage', () => {
    let mypage: JSX.Element;
    beforeEach(() => {
      jest.clearAllMocks();
      mypage = (
        <Provider store={mockStore}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<MyPage/>} />
              <Route path='/login' element={<Login />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    });
    it('should render correctly', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue({
          });
        render(mypage);
        await waitFor(() => expect(axios.get).toHaveBeenCalled());
        screen.getByText("프로필 설정");
        screen.getByText("차단 / 해제하기");
    })
    it('raise error while submit correctly', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue({
            data:{
            name: '',
            mbti: '',
            intro: '',
            birth: '',
            gender: '',
            nickname: '',
            matched_users: [],
            blocked_users: [],
            temperature: 0.0,}
          });
        jest.spyOn(axios, 'post').mockResolvedValue({
            status: 400, 
          });
        render(mypage);
        await waitFor(() => expect(axios.get).toHaveBeenCalled());
        const nameChange = screen.getByPlaceholderText('본인의 실명입니다.');
        fireEvent.input(nameChange,{target: {value: '대한민국'}});
        const sumbitButtonClick = screen.getByText('변경사항 저장하기');
        fireEvent.click(sumbitButtonClick!);
        await waitFor(() => expect(axios.post).toHaveBeenCalled());
        expect(window.alert).toHaveBeenCalledWith('예기치 않은 오류가 발생했습니다.');
    })
    it('submit correctly', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue({
            data:{
                name: '',
                mbti: '',
                intro: '',
                birth: '',
                gender: '',
                nickname: '',
                matched_users: [],
                blocked_users: [],
                temperature: 0.0,},
          });
        jest.spyOn(axios, 'post').mockResolvedValue({
                status: 200, 
            });
        render(mypage);
        await waitFor(() => expect(axios.get).toHaveBeenCalled());
        const nameChange = screen.getByPlaceholderText('본인의 실명입니다.');
        fireEvent.input(nameChange,{target: {value: '대한민국'}});
        const sumbitButtonClick = screen.getByText('변경사항 저장하기');
        fireEvent.click(sumbitButtonClick!);
        await waitFor(() => expect(axios.post).toHaveBeenCalled());
        expect(window.alert).toHaveBeenCalledWith('변경 사항이 저장되었습니다.');
        expect(window.location.reload).toHaveBeenCalled();
    })
    it('navigate to login when loggedinuser is null', async () => {
        mypage = (
          <Provider store={mockStoreNullUser}>
            <MemoryRouter>
              <Routes>
                <Route path='/' element={<MyPage />} />
                <Route path='/login' element={<Login />} />
              </Routes>
            </MemoryRouter>
          </Provider>
        );
        jest.spyOn(axios, 'get').mockResolvedValue({
            data:{
                name: '',
                mbti: '',
                intro: '',
                birth: '',
                gender: '',
                nickname: '',
                matched_users: [],
                blocked_users: [],
                temperature: 0.0,}
          });
        render(mypage);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
      });
    it('auto login when loggedinuser is null and localstorage not null', async () => {
        mypage = (
          <Provider store={mockStoreNullUser}>
            <MemoryRouter>
              <Routes>
                <Route path='/' element={<MyPage />} />
                <Route path='/login' element={<Login />} />
              </Routes>
            </MemoryRouter>
          </Provider>
        );
        jest.spyOn(axios, 'get').mockResolvedValue({
            data:{
                name: '',
                mbti: '',
                intro: '',
                birth: '',
                gender: '',
                nickname: '',
                matched_users: [],
                blocked_users: [],
                temperature: 0.0,}
          });
        const localStorageMock = (function () {
          return {
            getItem(key: string) {
              return '3';
            },
          };
        })();
    
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        render(mypage);
        await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
      });
});
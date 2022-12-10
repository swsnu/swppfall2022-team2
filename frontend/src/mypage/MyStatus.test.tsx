import { getMockStore } from '../test-utils/mocks';
import { Provider } from 'react-redux';
import { fireEvent,render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {
    UserInfoType,
  } from '../store/slices/user';
import MyStatus from './MyStatus';
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
    statusSubmit: (e: React.FormEvent<HTMLFormElement>) => any;
  }
const handleStatusMock = jest.fn();
const statusSubmitMock = jest.fn();
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
    handleStatus: handleStatusMock,
    statusSubmit: statusSubmitMock,
  };

const mockStore = getMockStore({ user: initialState });

describe('MyStatus', () => {
    let mystatus: JSX.Element;
    beforeEach(() => {
      jest.clearAllMocks();
      mystatus = (
        <Provider store={mockStore}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<MyStatus {...props}/>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    });
    it('form test', async () => {
        const mystatusRender = render(mystatus);
        const nameChange = screen.getByPlaceholderText('본인의 실명입니다.');
        fireEvent.input(nameChange,{target: {value: '대'}});
        fireEvent.input(nameChange,{target: {value: '^^^'}});
        fireEvent.input(nameChange,{target: {value: '대한민국'}});
        const birthChange = screen.getByPlaceholderText('YYMMDD 형태로 입력해주세요. 예) 970816');
        fireEvent.input(birthChange ,{target: {value: '0000'}});
        fireEvent.input(birthChange ,{target: {value: '0000xx'}});
        fireEvent.input(birthChange ,{target: {value: '000431'}});
        fireEvent.input(birthChange ,{target: {value: '000230'}});
        fireEvent.input(birthChange ,{target: {value: '010229'}});
        fireEvent.input(birthChange ,{target: {value: '020417'}});
        const genderChange = mystatusRender.container.querySelector('#genderChange');
        fireEvent.change(genderChange!, { target: { value: 'F' } });
        const mbtiChange = mystatusRender.container.querySelector('#mbtiChange');
        fireEvent.change(mbtiChange!, { target: { value: 'ISTP' } });
        const introChange = screen.getByPlaceholderText('소개말');
        fireEvent.input(introChange ,{target: {value: '0'}});
        fireEvent.input(introChange ,{target: {value: ''}});
        fireEvent.input(introChange ,{target: {value: '0'}});
        const nicknameChange = screen.getByPlaceholderText('다른 이용자에게 보여질 이름입니다.');
        fireEvent.input(nicknameChange ,{target: {value: '0'}});
        fireEvent.input(nicknameChange ,{target: {value: 'a    a'}});
        jest.spyOn(axios, 'post').mockResolvedValue({
            data:{dup:true},
            status: 200, 
        });
        fireEvent.input(nicknameChange ,{target: {value: 'testuse'}});
        await waitFor(() => expect(axios.post).toHaveBeenCalled());
        jest.spyOn(axios, 'post').mockResolvedValue({
            data:{dup:false},
            status: 200, 
        });
        fireEvent.input(nicknameChange ,{target: {value: 'testuser'}});
        await waitFor(() => expect(axios.post).toHaveBeenCalled());
        const sumbitButtonClick = screen.getByText('변경사항 저장하기');
        fireEvent.click(sumbitButtonClick!);
    })
});
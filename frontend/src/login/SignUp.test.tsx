import SignUp, {signUpStatusType} from "./SignUp";
import { fireEvent, render, screen } from '@testing-library/react';
import { getMockStore } from '../test-utils/mocks';
import React from 'react';
import {
  UserType,
  ChatType,
  ChatRoomType,
  LoggedInUserType,
  UserInfoType,
} from '../store/slices/user';
import {configure, waitFor} from '@testing-library/dom'
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import axios from 'axios';
import Main from "../Main";

jest.spyOn(window, "alert").mockImplementation(() => null)

configure({ testIdAttribute: 'type' })

const initialStateNull: UserInfoType = {
  loggedinuser: null,
  userlist: [],
  chosenchatroom: null,
  menulist: [],
};
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


const mockStore = getMockStore({ user: initialState });
const mockStoreNullUser = getMockStore({ user: initialStateNull });

//mock the navigate
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
 ...jest.requireActual("react-router"),
useNavigate: () => mockNavigate,
}));

//mock the dispatch
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
 ...jest.requireActual("react-redux"),
useDispatch: () => mockDispatch,
}));

describe('SignUp', () => {
    let signup: JSX.Element;
    beforeEach(() => {
      jest.clearAllMocks();
      signup = (
        <Provider store={mockStoreNullUser}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<SignUp />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    });
    it("should signup correctly", async() => {
        const signupRender = render(signup);
        const usernameInput = screen.getByPlaceholderText("영문, 숫자 (5~20자 이내)");
        fireEvent.input(usernameInput,{target: {value: 'a'}});
        fireEvent.input(usernameInput,{target: {value: 'a가나다라마바사'}});
        jest.spyOn(axios, 'post').mockResolvedValue({
          data:{dup:true},
          status: 200, 
        });
        fireEvent.input(usernameInput ,{target: {value: 'testuse'}});
        await waitFor(() => expect(axios.post).toHaveBeenCalled());
        jest.spyOn(axios, 'post').mockResolvedValue({
            data:{dup:false},
            status: 200, 
        });
        fireEvent.input(usernameInput ,{target: {value: 'testuser'}});
        await waitFor(() => expect(axios.post).toHaveBeenCalled());
        const passwordInput = screen.getByPlaceholderText("영문, 숫자, 특수문자 (8~20자 이내)");
        const passwordconfirmInput = screen.getByPlaceholderText("비밀번호를 재입력해주세요.");
        fireEvent.input(passwordInput,{target: {value: 'a'}});
        fireEvent.input(passwordconfirmInput,{target: {value: 'a'}});
        fireEvent.input(passwordconfirmInput,{target: {value: 'asdf1234'}});
        fireEvent.input(passwordInput,{target: {value: '가나다라마바사아'}});
        fireEvent.input(passwordInput,{target: {value: 'asdf1234'}});
        const nameInput = screen.getByPlaceholderText("본인의 실명입니다.");
        fireEvent.input(nameInput,{target: {value: 'a'}});
        fireEvent.input(nameInput,{target: {value: '^^^'}});
        fireEvent.input(nameInput,{target: {value: '세종대왕'}});
        const emailInput = screen.getByPlaceholderText("youremail");
        fireEvent.input(emailInput,{target: {value: '세종대왕'}});
        fireEvent.input(emailInput,{target: {value: ''}});
        fireEvent.input(emailInput,{target: {value: 'testuser'}});
        const birthChange = screen.getByPlaceholderText('YYMMDD 형태로 입력해주세요. 예) 970816');
        fireEvent.input(birthChange ,{target: {value: '0000'}});
        fireEvent.input(birthChange ,{target: {value: '0000xx'}});
        fireEvent.input(birthChange ,{target: {value: '000431'}});
        fireEvent.input(birthChange ,{target: {value: '000230'}});
        fireEvent.input(birthChange ,{target: {value: '010229'}});
        fireEvent.input(birthChange ,{target: {value: '020417'}});
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
        const genderChange = signupRender.container.querySelector('#genderChoose');
        fireEvent.change(genderChange!, { target: { value: 'F' } });
        const mbtiChange = signupRender.container.querySelector('#mbtiChoose');
        fireEvent.change(mbtiChange!, { target: { value: 'ISTP' } });
        const domainChange = signupRender.container.querySelector('#domainChoose');
        fireEvent.change(domainChange!, { target: { value: '@snu.ac.kr' } });
        jest.spyOn(global.Math, 'random').mockReturnValue(0.0);
        const sendemailButton = screen.getByText("인증 메일 보내기");
        fireEvent.click(sendemailButton!);
        const emailcofirmChange = screen.getByPlaceholderText('인증번호 6자리를 입력해주세요.');
        fireEvent.input(emailcofirmChange,{target: {value: '0'}});
        fireEvent.input(emailcofirmChange,{target: {value: 'aaaaaa'}});
        fireEvent.input(emailcofirmChange,{target: {value: '000001'}});
        const signupButton = screen.getByText("가입하기");
        fireEvent.click(signupButton!);
        expect(window.alert).toHaveBeenCalledWith('인증 번호가 올바르지 않습니다.');

        fireEvent.input(emailcofirmChange,{target: {value: '000000'}});
        fireEvent.click(signupButton!);
        await waitFor(()=>expect(mockDispatch).toHaveBeenCalledTimes(1));
        expect(window.alert).toHaveBeenCalledWith('회원 가입이 정상적으로 완료되었습니다.');
        await waitFor(()=>expect(mockNavigate).toHaveBeenCalledWith("/login"));
    });       
    it("should navigate to Login correctly", () => {
        render(signup);
        const loginlink = screen.getByText("이미 계정이 있습니다.");
        fireEvent.click(loginlink!);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
    /*
    it("auto login properly", async () =>{
      signup = (
        <Provider store={mockStore}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<SignUp />} />
              <Route path='/main' element={<Main />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
      const localStorageMock = (function () {
        return {
          getItem(key: string) {
            return '3';
          },
        };
      })();
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      render(signup);
      await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
    });*/
});
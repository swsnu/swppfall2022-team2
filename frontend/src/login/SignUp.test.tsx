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

jest.spyOn(window, "alert").mockImplementation(() => null)

configure({ testIdAttribute: 'type' })

const initialState: UserInfoType = {
  loggedinuser: null,
  userlist: [],
  chosenchatroom: null,
  menulist: [],
};


const mockStore = getMockStore({ user: initialState });

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
        <Provider store={mockStore}>
          <MemoryRouter>
            <Routes>
              <Route path='/' element={<SignUp />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    });
    it("should render correctly", async() => {
        render(signup);
        screen.getByText("밥친구");
        screen.getByText("아이디");
        screen.getByText("비밀번호");
        screen.getByText("비밀번호 재확인");
        screen.getByText("이름");
        screen.getByText("별명");
        screen.getByText("성별");
        screen.getByText("생년월일");
        screen.getByText("MBTI");
        screen.getByText("이메일");
        const usernameInput = screen.getByPlaceholderText("영문, 숫자 (5~15자 이내)");
        const passwordInput = screen.getByPlaceholderText("영문, 숫자, 특수문자 (8~15자 이내)");
        const signupButton = screen.getByText("가입하기");
        fireEvent.change(usernameInput,{target: {value: "user1"}});
        fireEvent.change(passwordInput,{target:{value: "user1password"}});
        await screen.findByDisplayValue("user1"); //values displayed on the screen
        await screen.findByDisplayValue("user1password"); //values displayed on the screen
        fireEvent.click(signupButton!);
        await waitFor(()=>expect(mockDispatch).toHaveBeenCalledTimes(1));
        expect(window.alert).toHaveBeenCalledWith('회원 가입이 정상적으로 완료되었습니다.')
        await waitFor(()=>expect(mockNavigate).toHaveBeenCalledWith("/login"));
    });       
    it("should navigate to Login correctly", () => {
        render(signup);
        const loginlink = screen.getByText("이미 계정이 있습니다.");
        fireEvent.click(loginlink!);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
    /*
    it('gender', () => {
      const handleMock = jest.fn();
      const useStateMock: any = (useState:any) => [useState, handleMock];
      jest.spyOn(React,'useState').mockImplementation(useStateMock);
      const signupRender = render(signup);
      const genderSelect = signupRender.container.querySelector('#gender');
      fireEvent.change(genderSelect!, { target: { value: 'M' } });
      expect(handleMock).toHaveBeenCalled();
    });*/
});
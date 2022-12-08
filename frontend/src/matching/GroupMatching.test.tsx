import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getMockStore } from '../test-utils/mocks';
import GroupMatching from './GroupMatching';
import GroupMatchingCondition from './GroupMatchingCondition';
import React from 'react';
import {
  UserType,
  ChatType,
  ChatRoomType,
  LoggedInUserType,
  UserInfoType,
} from '../store/slices/user';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import axios from 'axios';
import { nextTick } from 'process';
const initialState: UserInfoType = {
  loggedinuser: null,
  userlist: [],
  menulist: [
    {
      mealtype: 'lunch',
      menuplace: '학생회관',
      menuname: 'menu1',
      menuprice: '4000',
      menuextra: '',
    },
  ],
  chosenchatroom: null,
};
const mockStore = getMockStore({ user: initialState });
interface conditionType {
  time: string;
  menu: string;
  num: string;
}
interface conditionProps {
  matchingCondition: conditionType;
  handleMatchingCondition: (a: conditionType) => void;
}
const props: conditionProps = {
  matchingCondition: { time: '1200', menu: 'menu1', num: '34' },
  handleMatchingCondition: jest.fn(),
};
// jest.mock('./GroupMatchingCondition', () => (p: conditionProps) => (
//   <GroupMatchingCondition {...props} />
// ));
describe('GroupMatching', () => {
  let groupMatching: JSX.Element;
  beforeEach(() => {
    jest.clearAllMocks();
    groupMatching = (
      <Provider store={mockStore}>
        <MemoryRouter>
          <Routes>
            <Route path='/' element={<GroupMatching />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  });
  it('render', async () => {
    jest.spyOn(axios, 'get').mockImplementation((url) => {
      if (url === `matching/group/check/3/`) {
        return Promise.resolve({
          status: 200,
          data: {
            time: '1200',
            menu: 'menu1',
            opponents: [],
          },
        });
      } else if (url === `matching/group/get/`) {
        return Promise.resolve({
          status: 201,
          data: {
            id: 3,
            num_matching: 4,
          },
        });
      } else return Promise.reject();
    });
    render(groupMatching);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    await waitFor(() => screen.getByText('매칭 큐에 등록되었습니다'));
  });
  it('start matching, stop matching', async () => {
    jest.spyOn(axios, 'get').mockImplementation((url) => {
      if (url === `matching/group/check/3/`) {
        return Promise.resolve({
          status: 201,
          data: {
            time: '1200',
            menu: 'menu1',
            opponents: [],
          },
        });
      } else return Promise.reject();
    });
    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        id: 3,
        num_matching: 4,
      },
    });
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const matchingRender = render(groupMatching);
    const startButton = matchingRender.container.querySelector('#startButton');
    fireEvent.click(startButton!);
    const timeSelect = matchingRender.container.querySelector('#timeSelect');
    fireEvent.change(timeSelect!, { target: { value: '1200' } });
    const spaceSelect = matchingRender.container.querySelector('#spaceSelect');
    fireEvent.change(spaceSelect!, { target: { value: '학생회관' } });
    const menuSelect = matchingRender.container.querySelector('#menuSelect');
    fireEvent.change(menuSelect!, { target: { value: 'menu1' } });
    const numSelect = matchingRender.container.querySelector('#numSelect');
    fireEvent.change(numSelect!, { target: { value: '34' } });
    fireEvent.click(startButton!);
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    // from here, stop test
    await waitFor(() => screen.getByText('매칭 큐에 등록되었습니다'));
    jest.spyOn(axios, 'delete').mockRejectedValue({});
    const stopButton = matchingRender.container.querySelector('#stopButton');
    fireEvent.click(stopButton!);
    await waitFor(() => screen.getByText('매칭 큐에 등록되었습니다'));
    jest.spyOn(axios, 'delete').mockResolvedValue({});
    fireEvent.click(stopButton!);
    await waitFor(() => screen.getByText('아래의 매칭 버튼을 눌러 그룹 매칭을 시작하세요'));
  });
  it('end matching', async () => {
    jest.spyOn(axios, 'get').mockImplementation((url) => {
      if (url === `matching/group/check/3/`) {
        return Promise.resolve({
          status: 200,
          data: {
            time: '1200',
            menu: 'menu1',
            opponents: [],
          },
        });
      } else return Promise.reject();
    });
    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        id: 3,
        num_matching: 4,
      },
    });
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockImplementation(() => {
      return true;
    });
    const matchingRender = render(groupMatching);
    const startButton = matchingRender.container.querySelector('#startButton');
    fireEvent.click(startButton!);
    const timeSelect = matchingRender.container.querySelector('#timeSelect');
    fireEvent.change(timeSelect!, { target: { value: '1200' } });
    const spaceSelect = matchingRender.container.querySelector('#spaceSelect');
    fireEvent.change(spaceSelect!, { target: { value: '학생회관' } });
    const menuSelect = matchingRender.container.querySelector('#menuSelect');
    fireEvent.change(menuSelect!, { target: { value: 'menu1' } });
    const numSelect = matchingRender.container.querySelector('#numSelect');
    fireEvent.change(numSelect!, { target: { value: '34' } });
    fireEvent.click(startButton!);
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    await waitFor(() => screen.getByText('매칭 큐에 등록되었습니다'));
    jest.spyOn(axios, 'delete').mockRejectedValue({});
    const stopButton = matchingRender.container.querySelector('#stopButton');
    fireEvent.click(stopButton!);
    await waitFor(() => screen.getByText('매칭이 완료되었습니다'));
    const endButton = matchingRender.container.querySelector('#endButton');
    fireEvent.click(endButton!);
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
  it('get matching ', async () => {
    jest.spyOn(axios, 'get').mockImplementation((url) => {
      if (url === `matching/group/check/3/`) {
        return Promise.resolve({
          status: 200,
          data: {
            time: '1200',
            menu: 'menu1',
            opponents: [],
          },
        });
      } else if (url === `matching/group/get/`) {
        return Promise.resolve({
          status: 200,
          data: {
            id: 3,
            num_matching: 4,
          },
        });
      } else return Promise.reject();
    });
    render(groupMatching);
    await waitFor(() => screen.getByText('매칭이 완료되었습니다'));
  });
  it('group matching condition test when time is dinner(1800)', async () => {
    jest.spyOn(axios, 'get').mockImplementation((url) => {
      if (url === `matching/group/check/3/`) {
        return Promise.resolve({
          status: 201,
          data: {
            time: '1200',
            menu: 'menu1',
            opponents: [],
          },
        });
      } else return Promise.reject();
    });
    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        id: 3,
        num_matching: 4,
      },
    });
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const matchingRender = render(groupMatching);
    const startButton = matchingRender.container.querySelector('#startButton');
    fireEvent.click(startButton!);
    const timeSelect = matchingRender.container.querySelector('#timeSelect');
    fireEvent.change(timeSelect!, { target: { value: '1800' } });
    const spaceSelect = matchingRender.container.querySelector('#spaceSelect');
    fireEvent.change(spaceSelect!, { target: { value: '학생회관' } });
    const menuSelect = matchingRender.container.querySelector('#menuSelect');
    fireEvent.change(menuSelect!, { target: { value: 'menu1' } });
    const numSelect = matchingRender.container.querySelector('#numSelect');
    fireEvent.change(numSelect!, { target: { value: '34' } });
    fireEvent.click(startButton!);
    await waitFor(() => expect(window.alert).toHaveBeenCalled());
  });
});

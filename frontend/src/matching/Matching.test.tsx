import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getMockStore } from '../test-utils/mocks';
import Matching from './Matching';
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
const initialState: UserInfoType = {
  loggedinuser: null,
  userlist: [],
  chosenchatroom: null,
};
const mockStore = getMockStore({ user: initialState });

// In this test, cannot reach the coverage 100 because
// I defined my own funtion 'UseInterval'
// that execute checkmatching every 5seconds
// as the test do not wait 5 second, I cannot cover it
describe('Matching', () => {
  let matching: JSX.Element;
  beforeEach(() => {
    jest.clearAllMocks();
    matching = (
      <Provider store={mockStore}>
        <MemoryRouter>
          <Routes>
            <Route path='/' element={<Matching />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  });
  it('render', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        time: '0',
        space_user: '',
        spaceOpponent: '',
        mbti: 'ESTJ',
        gender: 'M',
        age: '22',
        id: '1',
        last_name: 'a',
        first_name: 'b',
      },
    });
    render(matching);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
  });
  it('render when matched', async () => {
    jest.spyOn(axios, 'get').mockImplementation((url) => {
      if (url === `matching/check/3/`) {
        return Promise.resolve({
          data: {
            time: '0',
            space_user: '',
            spaceOpponent: '',
            mbti: 'ESTJ',
            gender: 'M',
            age: '22',
            id: '1',
            last_name: 'a',
            first_name: 'b',
          },
        });
      } else if (url === `matching/get`) {
        return Promise.resolve({
          status: 200,
          data: {
            time: '0',
            space_user: '',
            spaceOpponent: '',
            mbti: 'ESTJ',
            gender: 'M',
            age: '22',
            id: '1',
            last_name: 'a',
            first_name: 'b',
          },
        });
      } else return Promise.reject();
    });
    render(matching);
    await waitFor(() => expect(axios.get).toHaveBeenCalled);
  });
  it('start matching when not matched, check matching', async () => {
    jest.spyOn(axios, 'get').mockImplementation((url) => {
      if (url === `matching/check/3/`) {
        return Promise.resolve({
          data: {
            time: '0',
            space_user: '',
            spaceOpponent: '',
            mbti: 'ESTJ',
            gender: 'M',
            age: '22',
            id: '1',
            last_name: 'a',
            first_name: 'b',
          },
        });
      } else if (url === `matching/get`) {
        return Promise.resolve({
          status: 201,
          data: {
            id: 3,
            num_matching: 4,
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
    const matchingRender = render(matching);
    const startButton = matchingRender.container.querySelector('#startButton');
    fireEvent.click(startButton!);
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
  it('check matching when matchingId=0', async () => {
    jest.spyOn(axios, 'get').mockImplementation((url) => {
      if (url === `matching/check/3/`) {
        return Promise.resolve({
          data: {
            time: '0',
            space_user: '',
            spaceOpponent: '',
            mbti: 'ESTJ',
            gender: 'M',
            age: '22',
            id: '1',
            last_name: 'a',
            first_name: 'b',
          },
        });
      } else if (url === `matching/get`) {
        return Promise.resolve({
          status: 201,
          data: {
            id: 0,
            num_matching: 4,
          },
        });
      } else return Promise.reject();
    });
    const matchingRender = render(matching);
    await waitFor(() => screen.getByText('Check Matching'));
    const checkButton = matchingRender.container.querySelector('#checkButton');
    fireEvent.click(checkButton!);
  });
  it('check matching when matchingId=3', async () => {
    jest.spyOn(axios, 'get').mockImplementation((url) => {
      if (url === `matching/check/3/`) {
        return Promise.resolve({
          status: 200,
          data: {
            time: '0',
            space_user: '',
            spaceOpponent: '',
            mbti: 'ESTJ',
            gender: 'M',
            age: '22',
            id: '1',
            last_name: 'a',
            first_name: 'b',
          },
        });
      } else if (url === `matching/get`) {
        return Promise.resolve({
          status: 201,
          data: {
            id: 3,
            num_matching: 4,
          },
        });
      } else return Promise.reject();
    });
    const matchingRender = render(matching);
    await waitFor(() => screen.getByText('Check Matching'));
    const checkButton = matchingRender.container.querySelector('#checkButton');
    fireEvent.click(checkButton!);
  });
  xit('useInterval', () => {
    const matchingRender = render(matching);
  });
});

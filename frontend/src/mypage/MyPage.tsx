import React, { useState, useEffect, useCallback } from 'react';
import './MyPage.css';
import MyManner from './MyManner';
import MyStatus from './MyStatus';
import BlockUser from './BlockUser';
import axios from 'axios';
import NavBar from '../NavBar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { setSignIn, selectUser } from '../store/slices/user';
import { Navigate } from 'react-router-dom';

export interface statusType {
  name: string;
  mbti: string;
  intro: string;
  birth: string;
  gender: string;
  nickname: string;
  temperature: number;
  matched_users: string[];
  blocked_users: string[];
}

const MyPage: React.FunctionComponent = () => {
  const userState = useSelector(selectUser);

  const [status, handleStatus] = useState<statusType>({
    name: '',
    mbti: '',
    intro: '',
    birth: '',
    gender: '',
    nickname: '',
    matched_users: [],
    blocked_users: [],
    temperature: 0.0,
  });


  // fetch status from userinfo model
  useEffect(() => {
    axios
      .get(`mypage/get/`)
      .then((response) => {
        handleStatus({
          ...status,
          name: response.data.name,
          mbti: response.data.mbti,
          intro: response.data.intro,
          birth: response.data.birth,
          gender: response.data.gender,
          nickname: response.data.nickname,
          temperature: response.data.temperature,
          matched_users: response.data.matched_users,
          blocked_users: response.data.blocked_users,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const dispatch = useDispatch<AppDispatch>();

  if (userState.loggedinuser === null) {
    if (window.localStorage.getItem('Token') !== null) {
      dispatch(setSignIn(Number(window.localStorage.getItem('id'))));
      console.log(window.localStorage.getItem('id'));
    } else {
      return <Navigate to='/login' />;
    }
  }

  // submit changes
  const statusSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
        await axios
          .post(`mypage/submit/`, {
            name: status.name,
            mbti: status.mbti,
            intro: status.intro,
            birth: status.birth,
            gender: status.gender,
            nickname: status.nickname,
          })
          .then((res) => {
            if (res.status === 200) {
              window.alert('변경 사항이 저장되었습니다.');
              location.reload();
            } else {
              window.alert('예기치 않은 오류가 발생했습니다.');
            }
          })
          .catch((err) => {
          });
      console.log('Submitted User Status:', status);
    },
    [status],
  );

  

  return (
    <div>
      <NavBar />
      <div className='manner'>
        <MyManner temperature={status.temperature} />
      </div>
      <div className='profile card overflow-auto'>
        <div className='card-header'>
          <h5 className='card-title'>프로필 설정</h5>
        </div>
        <div className='pad'>
          <MyStatus status={status} handleStatus={handleStatus} statusSubmit={statusSubmit}/>
        </div>
      </div>
      <div className='block card overflow-auto'>
        <div className='card-header'>
          <h5 className='card-title'>차단 / 해제하기</h5>
        </div>
        <div>
          <BlockUser status={status} handleStatus={handleStatus} />
        </div>
      </div>
    </div>
  );
};

export default MyPage;

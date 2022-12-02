import React, { useState, useEffect, useCallback } from 'react';
import './MyPage.css';
import MyManner from './MyManner';
import MyStatus from './MyStatus';
import BlockUser from './BlockUser';
import axios from 'axios';
import NavBar from '../NavBar';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser } from '../store/slices/user';

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

  if (userState.loggedinuser === null) {
    return <Navigate to='/login' />;
  }

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
  useEffect(()=>{
    axios
    .get(`mypage/get/`)
    .then((response)=>{
      handleStatus({...status, 
      name : response.data.name,
      mbti : response.data.mbti,
      intro : response.data.intro,
      birth : response.data.birth,
      gender : response.data.gender,
      nickname : response.data.nickname,
      temperature : response.data.temperature,
      matched_users : response.data.matched_users,
      blocked_users : response.data.blocked_users,
    });
    })
    .catch((err) => {console.log(err)})
  },[]);
  
  // submit changes
  const statusSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
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
        if (res.status === 200){
          alert("변경 사항이 저장되었습니다.");
          location.reload();
        }
        else{
          alert("예기치 않은 오류가 발생했습니다.");
        }
      })
      .catch((err) => {
        alert("예기치 않은 오류가 발생했습니다.");
        console.log(err.response.data);
      });
    } catch(err){
        alert("예기치 않은 오류가 발생했습니다.");
        console.log(err);}
    console.log('Submitted User Status:', status);
  },[status]
  );

  // block or unblock someone
  const blockSubmit = useCallback(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, nickname:string) => {
    let i = 0;
    for(;;i++)if(status.matched_users[i] === nickname)break;
    for(;i<status.matched_users.length-1;i++)status.matched_users[i]=status.matched_users[i+1];
    status.matched_users.pop();
    status.blocked_users.push(nickname);
    handleStatus({ ...status});
    try {
      await axios
        .post(`mypage/block/`, {
          nickname: nickname,
        })
        .then((res) => {
          if (res.status === 200){
          }
          else{
            alert("예기치 않은 오류가 발생했습니다.");
          }
        })
        .catch((err) => {
          alert("예기치 않은 오류가 발생했습니다.");
          console.log(err.response.data);
        });
      } catch(err){
          alert("예기치 않은 오류가 발생했습니다.");
          console.log(err);}
  },[status]
  );

  // unblock someone
  const unblockSubmit = useCallback(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, nickname:string) => {
    let i = 0;
    for(;;i++)if(status.blocked_users[i] === nickname)break;
    for(;i<status.blocked_users.length-1;i++)status.blocked_users[i]=status.blocked_users[i+1];
    status.blocked_users.pop();
    status.matched_users.push(nickname);
    handleStatus({ ...status});
    try {
      await axios
        .post(`mypage/unblock/`, {
          nickname: nickname,
        })
        .then((res) => {
          if (res.status === 200){
          }
          else{
            alert("예기치 않은 오류가 발생했습니다.");
          }
        })
        .catch((err) => {
          alert("예기치 않은 오류가 발생했습니다.");
          console.log(err.response.data);
        });
      } catch(err){
          alert("예기치 않은 오류가 발생했습니다.");
          console.log(err);}
  },[status]
  );

  return (
    <div>
      <NavBar />
      <div className='manner'>
        <MyManner temperature={status.temperature}/>
      </div>
      <div className='profile card overflow-auto'>
        <div className="card-header">
            <h5 className="card-title">프로필 설정</h5>
        </div>
        <div className='pad'>
            <MyStatus status={status} handleStatus={handleStatus} statusSubmit={statusSubmit}/>
        </div>
      </div>
      <div className='block card overflow-auto'>
      <div className="card-header">
            <h5 className="card-title">차단 / 해제하기</h5>
        </div>
        <div>
            <BlockUser status={status} blockSubmit={blockSubmit} unblockSubmit={unblockSubmit}/>
        </div>
      </div>
    </div>
  );
};

export default MyPage;

import React, { useState, useEffect, useCallback } from 'react';
import './MyPage.css';
import MyManner from './MyManner';
import MyStatus from './MyStatus';
import MyTimeTable from './MyTimeTable';
import axios from 'axios';
import NavBar from '../NavBar';


export interface statusType {
  name: string;
  mbti: string;
  intro: string;
  birth: string;
  gender: string;
  nickname: string;
  timeTable: JSON;
  temperature: number;
}

const MyPage: React.FunctionComponent = () => {
  const [status, handleStatus] = useState<statusType>({
    name: '',
    mbti: '',
    intro: '',
    birth: '',
    gender: '',
    nickname: '',
    timeTable: JSON.parse('{}'),
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
      timeTable : response.data.timeTable,
      temperature : response.data.temperature,});
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
        timeTable: status.timeTable,
      })
      .then((res) => {
        if (res.status === 200){
          alert("변경 사항이 저장되었습니다.");
          location.reload();
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
    } catch(err){console.log(err);}
    console.log('Submitted User Status:', status);
  },[status]
  );
  return (
    <div>
      <NavBar />
      <div className='manner'>
        <MyManner temperature={status.temperature}/>
      </div>
      <div className='others card overflow-auto'>
        <div className="card-header">
            <h5 className="card-title">프로필 설정</h5>
        </div>
        <div className='pad'>
            <div>
                <MyStatus status={status} handleStatus={handleStatus} statusSubmit={statusSubmit}/>
            </div>
            <div>
                <MyTimeTable status={status} handleStatus={handleStatus} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;

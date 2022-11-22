import React, { useState, useEffect } from 'react';
import './MyPage.css';
import MyManner from './MyManner';
import MyStatus from './MyStatus';
import MyTimeTable from './MyTimeTable';
import { Button, Navbar } from 'react-bootstrap';
import axios from 'axios';
import NavBar from '../NavBar';


export interface statusType {
  name: string;
  mbti: string;
  intro: string;
  age: string;
  gender: string;
  nickname: string;
  timeTable: JSON;
}

const MyPage: React.FunctionComponent = () => {
  const [status, handleStatus] = useState<statusType>({
    name: '',
    mbti: '',
    intro: '',
    age: '',
    gender: '',
    nickname: '',
    timeTable: JSON.parse('{}'),
  });

  // fetch status from userinfo model
  useEffect(()=>{
    axios
    .get(`mypage/get/`)
    .then((response)=>{
      status.name = response.data.name;
      status.mbti = response.data.mbti;
      status.intro = response.data.intro;
      status.age = response.data.age;
      status.gender = response.data.gender;
      status.nickname = response.data.nickname;
      status.timeTable = response.data.timeTable;
    })
    .catch((err) => {console.log(err)})
  },[]);
  
  const statusSubmit = (): void => {
    axios
      .post(`mypage/submit/`, {
        name: status.name,
        mbti: status.mbti,
        intro: status.intro,
        age: status.age,
        gender: status.gender,
        nickname: status.nickname,
        timeTable: status.timeTable,
      })
      .catch((err) => {
        console.log(err.response.data);
      });
    alert("변경 사항이 저장되었습니다.");
    console.log('Submitted User Status:', status);
  };
  return (
    <div>
      <NavBar />
      <div className='manner'>
        <MyManner />
      </div>
      <div className='others card overflow-auto'>
        <div className="card-header">
            <h5 className="card-title">프로필 설정</h5>
        </div>
        <div className='pad'>
            <div>
                <MyTimeTable status={status} handleStatus={handleStatus} />
            </div>
            <div>
                <MyStatus status={status} handleStatus={handleStatus} />
                <Button variant='secondary' className='submitbutton' onClick={statusSubmit}>
                    <span className='buttonText'>변경사항 저장하기</span>
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;

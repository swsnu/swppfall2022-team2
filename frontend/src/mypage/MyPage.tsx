import React, { useState } from 'react';
import './MyPage.css';
import MyManner from './MyManner';
import MyStatus from './MyStatus';
import MyTimeTable from './MyTimeTable';
import { useNavigate } from 'react-router';
import homeImg from '../img/home.png';
import { Button, Navbar } from 'react-bootstrap';
import axios from 'axios';
import NavBar from '../NavBar';

export interface timeTableDataType {
  mon: boolean[];
  tue: boolean[];
  wed: boolean[];
  thu: boolean[];
  fri: boolean[];
}
export interface statusType {
  first_name: string;
  last_name: string;
  mbti: string;
  intro: string;
  age: string;
  gender: string;
}

const MyPage: React.FunctionComponent = () => {
  const [timeTable, handleTimeTable] = useState<timeTableDataType>({
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
  });

  const [status, handleStatus] = useState<statusType>({
    first_name: '',
    last_name: '',
    mbti: '',
    intro: '',
    age: '',
    gender: '',
  });
  const navigate = useNavigate();
  const toMain = (): void => {
    navigate('/main');
  };
  const statusSubmit = (): void => {
    axios
      .post(`mypage/submit/`, {
        first_name: status.first_name,
        last_name: status.last_name,
        mbti: status.mbti,
        intro: status.intro,
        age: status.age,
        gender: status.gender,
      })
      .catch((err) => {
        console.log(err.response.data);
      });
    console.log('User Status:', status);
  };
  return (
    <div>
      <NavBar />
      <div className='manner'>
        <MyManner />
      </div>
      <div className='others'>
        <div>
          <MyTimeTable timeTable={timeTable} handleTimeTable={handleTimeTable} />
        </div>
        <div>
          <MyStatus status={status} handleStatus={handleStatus} />
          <Button variant='secondary' className='submitbutton' onClick={statusSubmit}>
            <span className='buttonText'>Submit changes</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;

import React, { useEffect, useState } from 'react';
import './MatchingStatus.css';
import { Button } from 'react-bootstrap';
import profileImg from '../img/profile.png';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { createChatRoom, selectUser, userActions } from '../store/slices/user';
import { useNavigate } from 'react-router';
import axios from 'axios';
interface matchedOpponentType {
  time: string;
  spaceUser: string; // wanted space of this user
  spaceOpponent: string; // wanted space of matched opponent
  mbti: string;
  gender: string;
  age: string;
  id: number;
  name: string;
}
interface shownType {
  time: string;
  spaceUser: string;
  spaceOpponent: string;
}
interface propsType {
  matched: boolean;
  matchedOpponent: matchedOpponentType | null;
  numMatching: number | null;
}
const MatchingStatus: React.FC<propsType> = (props) => {
  const { matched, matchedOpponent, numMatching } = props;
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector(selectUser);
  const navigate = useNavigate();
  const [shownStatus, handleShownStatus] = useState<shownType | null>(null);
  useEffect(() => {
    if (matched && matchedOpponent !== null) {
      const ti = matchedOpponent.time;
      const su = matchedOpponent.spaceUser;
      const so = matchedOpponent.spaceOpponent;
      let time, spaceUser, spaceOpponent;
      switch (ti) {
        case '1200':
          time = '12:00';
          break;
        case '1230':
          time = '12:30';
          break;
        case '1300':
          time = '13:00';
          break;
        case '1800':
          time = '18:00';
          break;
        case '1830':
          time = '18:30';
          break;
        case '1900':
          time = '19:00';
          break;
        default:
          time = '미정';
          break;
      }
      switch (su) {
        case 'dormitory':
          spaceUser = '기숙사';
          break;
        case 'student':
          spaceUser = '학생회관';
          break;
        case '301':
          spaceUser = '301동';
          break;
        default:
          spaceUser = '미정';
          break;
      }
      switch (so) {
        case 'dormitory':
          spaceOpponent = '기숙사';
          break;
        case 'student':
          spaceOpponent = '학생회관';
          break;
        case '301':
          spaceOpponent = '301동';
          break;
        default:
          spaceOpponent = '미정';
          break;
      }
      handleShownStatus({ time: time, spaceUser: spaceUser, spaceOpponent: spaceOpponent });
    }
  }, [matched]);
  const makeChat: () => void = () => {
    if (matchedOpponent !== null && userState.loggedinuser?.user !== undefined) {
      axios
        .get(`/chat/user/${userState.loggedinuser?.user.id}/`)
        .then((response) => {
          if (userState.loggedinuser?.user !== undefined) {
            dispatch(
              userActions.updateLoggedInUser({
                user: userState.loggedinuser?.user,
                chatrooms: response.data,
              }),
            );
            const chatRoomId = response.data.find(
              (chatroom: any) =>
                chatroom.opponent_id === matchedOpponent.id ||
                chatroom.opponent_id === userState.loggedinuser?.user.id,
            )?.id;
            if (chatRoomId !== undefined) {
              navigate(`/chatroom/${chatRoomId}`);
            } else {
              void dispatch(createChatRoom(matchedOpponent.id)).then((response) => {
                // there is a problem in testing below navigate
                // eslint-disable-next-line
                navigate(`/chatroom/${response.payload}`);
              });
            }
          }
        })
        .catch(() => {});
    }
  };
  return matched ? (
    <div>
      <div>
        <p></p>
        <h3>매칭이 완료되었습니다</h3>
        <img src={profileImg} width='80' />
        <h3>{matchedOpponent?.name}</h3>
        <h3>시간:{shownStatus ? shownStatus.time : '미정'}</h3>
        <h3>내가 원하는 장소:{shownStatus ? shownStatus.spaceUser : '미정'}</h3>
        <h3>
          상대가 원하는 장소:
          {shownStatus ? shownStatus.spaceOpponent : '미정'}
        </h3>
        <h3>나이: {matchedOpponent?.age}</h3>
        <h3>성별: {matchedOpponent?.gender}</h3>
        <h3>MBTI: {matchedOpponent?.mbti}</h3>
        <Button className='chatButton' variant='secondary' size='lg' onClick={makeChat}>
          채팅시작
        </Button>
      </div>
    </div>
  ) : (
    <div>
      {numMatching !== null ? (
        <div>
          <h3>매칭 큐에 등록되었습니다</h3>
          <h3>{numMatching}명의 사람들이 현재 매칭 중입니다</h3>
          {/* https://codepen.io/domsammut/pen/kQjQvq */}
          <div className='loading-container'>
            <div className='loading'></div>
            <div id='loading-text'>매칭중</div>
          </div>
        </div>
      ) : (
        <h3>아래의 매칭 버튼을 눌러 매칭을 시작하세요</h3>
      )}
    </div>
  );
};

export default MatchingStatus;

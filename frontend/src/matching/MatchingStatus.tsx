import React, { useEffect, useState } from 'react';
import './MatchingStatus.css';
import { Button } from 'react-bootstrap';
import profileImg from '../img/profile.png';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { createChatRoom, selectUser, userActions, ChatRoomType } from '../store/slices/user';
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
  temperature: string;
  intro: string;
}
interface shownType {
  time: string;
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
      let time;
      switch (ti) {
        case '1130':
          time = '11:30';
          break;
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
      handleShownStatus({ time }); // object-shorthand
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
            const chatRoomId: number | undefined = response.data.find(
              (chatroom: ChatRoomType) =>
                chatroom.user_id.length === 1 && chatroom.user_id.includes(matchedOpponent.id),
            )?.id;
            if (chatRoomId !== undefined) {
              navigate(`/chatroom/${chatRoomId}`);
            } else {
              void dispatch(
                createChatRoom([userState.loggedinuser.user.id, matchedOpponent.id]),
              ).then((response) => {
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
        <h3>
          {matchedOpponent?.name} : {matchedOpponent?.temperature}&#176;C
        </h3>
        <div className='matchingStatusFont'>
          시간:{shownStatus !== null ? shownStatus.time : '미정'}
        </div>
        <div className='matchingStatusFont'>
          내가 원하는 장소:{matchedOpponent?.spaceUser ? matchedOpponent?.spaceUser : '미정'}
        </div>
        <div className='matchingStatusFont'>
          상대가 원하는 장소:
          {matchedOpponent?.spaceOpponent ? matchedOpponent?.spaceOpponent : '미정'}
        </div>
        <div className='matchingStatusFont'>나이: {matchedOpponent?.age}</div>
        <div className='matchingStatusFont'>성별: {matchedOpponent?.gender}</div>
        <div className='matchingStatusFont'>MBTI: {matchedOpponent?.mbti}</div>
        <div className='matchingStatusFont'>
          한 줄 소개:
          {matchedOpponent?.intro ?? null}
        </div>
        <Button className='chatButton' variant='secondary' size='lg' onClick={makeChat}>
          채팅시작
        </Button>
      </div>
    </div>
  ) : (
    <div>
      {numMatching !== null ? (
        <div>
          <div>매칭 큐에 등록되었습니다</div>
          <div>{numMatching}명의 사람들이 현재 매칭 중입니다</div>
          {/* https://codepen.io/domsammut/pen/kQjQvq */}
          <div className='loading-container'>
            <div className='loading'></div>
            <div id='loading-text'>매칭중</div>
          </div>
        </div>
      ) : (
        <div>아래의 매칭 버튼을 눌러 1대1 매칭을 시작하세요</div>
      )}
    </div>
  );
};

export default MatchingStatus;

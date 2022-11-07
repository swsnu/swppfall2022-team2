import React from 'react';
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
            const chatRoomId = userState.loggedinuser?.chatrooms.find(
              (chatroom) =>
                chatroom.opponent_id === matchedOpponent.id ||
                chatroom.opponent_id === userState.loggedinuser?.user.id,
            )?.id;
            if (chatRoomId !== undefined) {
              navigate(`/chatroom/${chatRoomId}`);
            } else {
              void dispatch(createChatRoom(matchedOpponent.id)).then((response) => {
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
        <h3>이름</h3>
        <h3>시간:{matchedOpponent?.time === '0' ? '미정' : matchedOpponent?.time}</h3>
        <h3>
          내가 원하는 장소:{matchedOpponent?.spaceUser === '' ? '미정' : matchedOpponent?.spaceUser}
        </h3>
        <h3>
          상대가 원하는 장소:
          {matchedOpponent?.spaceOpponent === '' ? '미정' : matchedOpponent?.spaceOpponent}
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

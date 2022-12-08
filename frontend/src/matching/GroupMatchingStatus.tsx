import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { AppDispatch } from '../store';
import { createChatRoom, selectUser, userActions, ChatRoomType } from '../store/slices/user';
import './MatchingStatus.css';
interface matchedOpponentType {
  id: number;
  name: string;
  temperature: string;
}
interface conditionType {
  time: string;
  menu: string;
  num: string;
}
interface propsType {
  matched: boolean;
  matchedOpponents: matchedOpponentType[] | null;
  numMatching: number | null;
  matchedCondition: conditionType;
}
const GroupMatchingStatus: React.FC<propsType> = (props) => {
  const { matched, matchedOpponents, numMatching, matchedCondition } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector(selectUser);

  const [shownTime, handleShownTime] = useState<string>('');
  useEffect(() => {
    let time;
    switch (String(matchedCondition.time)) {
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
    handleShownTime(time);
  });
  const checkSameChatRoom: (arr1: number[], arr2: number[]) => boolean = (arr1, arr2) => {
    // checks whether the two array is same regardless of order
    if (arr1.length === arr2.length) {
      for (let i = 0; i < arr1.length; i++) {
        if (!arr2.includes(arr1[i])) {
          return false;
        }
      }
    }
    return true;
  };
  const makeChat: () => void = () => {
    if (matchedOpponents !== null && userState.loggedinuser?.user !== undefined) {
      axios
        .get(`/chat/user/${userState.loggedinuser?.user.id}/`)
        .then((response) => {
          const matchedOpponentsIds: number[] = matchedOpponents.map((opponent) => opponent.id);
          if (userState.loggedinuser?.user !== undefined) {
            dispatch(
              userActions.updateLoggedInUser({
                user: userState.loggedinuser?.user,
                chatrooms: response.data,
              }),
            );
            const chatRoomId = response.data.find((chatroom: ChatRoomType) =>
              checkSameChatRoom(chatroom.user_id, matchedOpponentsIds),
            )?.id;
            if (chatRoomId !== undefined) {
              const chatroom: ChatRoomType = userState.loggedinuser.chatrooms.find(
                (chatroom) => chatroom.id === chatRoomId,
              )!;
              dispatch(userActions.selectChatRoom(chatroom!));
              navigate(`/chatroom/${chatRoomId}`);
            } else {
              void dispatch(
                createChatRoom([userState.loggedinuser.user.id, ...matchedOpponentsIds]),
              ).then((response) => {
                // there is a problem in testing below
                const chatroom: ChatRoomType = userState.loggedinuser!.chatrooms.find(
                  (chatroom) => chatroom.id === response.payload,
                )!;
                dispatch(userActions.selectChatRoom(chatroom!));
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
        <div className='matchingStatusFont'>시간: {shownTime}</div>
        <div className='matchingStatusFont'>메뉴: {matchedCondition.menu}</div>
        <div className='matchingStatusFont'>{matchedCondition.num}명이 함께 매칭되었습니다</div>
        {matchedOpponents?.map((opponent) => (
          <div className='matchingStatusFont' key={opponent.id}>
            {opponent.name} : {opponent.temperature}&#176;C
          </div>
        ))}
        <Button className='chatButtonGroup' variant='secondary' size='lg' onClick={makeChat}>
          그룹채팅시작
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
        <div>아래의 매칭 버튼을 눌러 그룹 매칭을 시작하세요</div>
      )}
    </div>
  );
};

export default GroupMatchingStatus;

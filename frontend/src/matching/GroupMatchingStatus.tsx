import React, { useEffect, useState } from 'react';
import './MatchingStatus.css';
interface matchedOpponentType {
  id: number;
  name: string;
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
  const [shownTime, handleShownTime] = useState<string>('');
  useEffect(() => {
    let time;
    switch (matchedCondition.time) {
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
  return matched ? (
    <div>
      <div>
        <p></p>
        <h3>매칭이 완료되었습니다</h3>
        <h3>시간: {shownTime}</h3>
        <h3>메뉴: {matchedCondition.menu}</h3>
        <h3>{matchedCondition.num}명과 매칭되었습니다</h3>
        {matchedOpponents?.map((opponent) => (
          <h3 key={opponent.id}>{opponent.name}</h3>
        ))}
        {/*
        <Button className='chatButton' variant='secondary' size='lg' onClick={makeChat}>
          채팅시작
        </Button> */}
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
        <h3>아래의 매칭 버튼을 눌러 그룹 매칭을 시작하세요</h3>
      )}
    </div>
  );
};

export default GroupMatchingStatus;

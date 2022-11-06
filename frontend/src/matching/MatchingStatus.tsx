import React from 'react';
import { Button } from 'react-bootstrap';
interface matchedOpponentType {
  time: string;
  spaceUser: string; // wanted space of this user
  spaceOpponent: string; // wanted space of matched opponent
  mbti: string;
  gender: string;
  age: string;
}
interface propsType {
  checkMatching: () => void;
  matched: boolean;
  matchedOpponent: matchedOpponentType | null;
  numMatching: number | null;
}
const MatchingStatus: React.FC<propsType> = (props) => {
  const { checkMatching, matched, matchedOpponent, numMatching } = props;

  return matched ? (
    <div>
      <h1>Matching Status</h1>
      <div>
        <h2>Information about Your matched Opponent</h2>
        <div>(Currently It always show the same because we do not make the user interface yet)</div>
        <h3>(name would be here)</h3>
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
        <h3>(button to start chatting with him/her should be here)</h3>
      </div>
    </div>
  ) : (
    <div>
      <h1>Matching Status</h1>
      {numMatching !== null ? (
        <div>
          <h3>You are not matched yet</h3>
          <h3>{numMatching} people is matching now!</h3>
        </div>
      ) : (
        <h3>Start the matching to see how many peoples are matching now!</h3>
      )}

      <Button variant='secondary' onClick={checkMatching}>
        <span className='buttonText'>Check Matching</span>
      </Button>
    </div>
  );
};

export default MatchingStatus;

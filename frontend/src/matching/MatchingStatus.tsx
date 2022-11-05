import React from 'react';
import { Button } from 'react-bootstrap';
interface matchedOpponentType {
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
        <h3>Age: {matchedOpponent?.age}</h3>
        <h3>Gender: {matchedOpponent?.gender}</h3>
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

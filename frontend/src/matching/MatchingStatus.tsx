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
}
const MatchingStatus: React.FC<propsType> = (props) => {
  const { checkMatching, matched, matchedOpponent } = props;

  return matched ? (
    <div>
      <p>Matching Status</p>
      <div>
        <div>information about the matched Opponent</div>
        <div>Currently It always show the same because we do not make the user interface yet</div>
        <div>profile image</div>
        <div>MBTI: {matchedOpponent?.mbti}</div>
        <div>Gender: {matchedOpponent?.gender}</div>
        <div>Age: {matchedOpponent?.age}</div>
      </div>
    </div>
  ) : (
    <div>
      <p>Matching Status</p>
      <div>not matched yet</div>
      <div>Num of people matching now</div>
      <Button variant='secondary' onClick={checkMatching}>
        <span className='buttonText'>Check Matching</span>
      </Button>
    </div>
  );
};

export default MatchingStatus;

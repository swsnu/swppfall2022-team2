import React, { useState } from 'react';
import MatchingCondition from './MatchingCondition';
import MatchingStatus from './MatchingStatus';
import './Matching.css';
import { Button } from 'react-bootstrap';
import axios from 'axios';

export interface conditionType {
  // this is temporary because another type for time and space is needed
  time: null | number;
  space: null | string;
  mbti: null | string;
  gender: null | string;
  age: null | { from: string | null; to: string | null };
}
interface matchedOpponentType {
  mbti: string;
  gender: string;
  age: string;
}
const Matching: React.FunctionComponent = () => {
  const [matchingCondition, handleMatchingCondition] = useState<conditionType>({
    time: null,
    space: null,
    mbti: null,
    gender: null,
    age: null,
  });
  // eslint-disable-next-line
  const [matched, handleMatched] = useState(false); // for check whether matching is done, maybe should be changed to use Redux
  const [matchingId, handleMatchingId] = useState<number>(0);
  const [matchedOpponent, handleMatchedOpponent] = useState<matchedOpponentType | null>(null);
  const checkMatching = (): void => {
    // check whether matching is completed or not
    if (matchingId === 0) {
      return;
    }
    axios
      .get(`http://localhost:8000/matching/check/${matchingId}/`)
      .then((response) => {
        if (response.status === 200) {
          // when matching succeed
          console.log(response.data);
          handleMatched(true);
          handleMatchedOpponent({
            mbti: response.data.mbti,
            gender: response.data.gender,
            age: response.data.age,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const startMatching = (): void => {
    handleMatched(false);
    axios // include the information of user is needed???
      .post(`http://localhost:8000/matching/start/`, {
        condition: matchingCondition,
      })
      .then((response) => {
        handleMatchingId(response.data.id);
        checkMatching();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <div className='status'>
        <MatchingStatus
          checkMatching={checkMatching}
          matched={matched}
          matchedOpponent={matchedOpponent}
        />
      </div>
      <div className='condition'>
        <MatchingCondition
          matchingCondition={matchingCondition}
          handleMatchingCondition={handleMatchingCondition}
        />
      </div>
      <Button variant='secondary' className='button' onClick={startMatching}>
        <span className='buttonText'>Start Matching</span>
      </Button>
    </div>
  );
};

export default Matching;

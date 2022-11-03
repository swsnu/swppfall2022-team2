import React, { useEffect, useState } from 'react';
import MatchingCondition from './MatchingCondition';
import MatchingStatus from './MatchingStatus';
import './Matching.css';
import { Button } from 'react-bootstrap';
import axios from 'axios';

export interface conditionType {
  // this is temporary because another type for time and space is needed
  time: string;
  space: string;
  mbti: string[];
  gender: string;
  age: { from: string; to: string };
}
interface matchedOpponentType {
  mbti: string;
  gender: string;
  age: string;
}
const Matching: React.FunctionComponent = () => {
  const [matchingCondition, handleMatchingCondition] = useState<conditionType>({
    time: '0',
    space: '',
    mbti: [],
    gender: '',
    age: { from: '0', to: '100' },
  });
  const [matched, handleMatched] = useState(false); // for check whether matching is done, maybe should be changed to use Redux
  const [matchingId, handleMatchingId] = useState<number>(0);
  const [matchedOpponent, handleMatchedOpponent] = useState<matchedOpponentType | null>(null);
  const checkMatching = (): void => {
    // check whether matching is completed or not
    if (matchingId === 0) {
      return;
    }
    axios
      .get(`matching/check/${matchingId}/`)
      .then((response) => {
        if (response.status === 200) {
          // when matching succeed
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
      .post(`matching/start/`, {
        condition: matchingCondition,
      })
      .then((response) => {
        handleMatchingId(response.data.id);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log('matchingcondition:', matchingCondition);
  };
  useEffect(() => {
    // after start matching, automatically called
    if (matchingId !== 0) {
      checkMatching();
    }
  }, [matchingId]);
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

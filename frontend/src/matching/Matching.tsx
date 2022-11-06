import React, { useEffect, useState } from 'react';
import MatchingCondition from './MatchingCondition';
import MatchingStatus from './MatchingStatus';
import './Matching.css';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router';

export interface conditionType {
  // this is temporary because another type for time and space is needed
  time: string;
  space: string;
  mbti: string[];
  gender: string;
  age: { from: string; to: string };
}
interface matchedOpponentType {
  time: string;
  spaceUser: string; // wanted space of this user
  spaceOpponent: string; // wanted space of matched opponent
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
  const [numMatching, handlenumMatching] = useState<number | null>(null);
  const navigate = useNavigate();
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
            time: String(response.data.time),
            spaceUser: response.data.space_user,
            spaceOpponent: response.data.space_opponent,
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
        handlenumMatching(Number(response.data.num_matching));
      })
      .catch((err) => {
        console.log(err);
      });
    console.log('matchingcondition:', matchingCondition);
  };
  const toMain = (): void => {
    navigate('/main');
  };
  useEffect(() => {
    // after start matching, automatically called
    if (matchingId !== 0) {
      checkMatching();
    }
  }, [matchingId]);
  return (
    <div>
      <Button variant='primary' onClick={toMain}>
        Main
      </Button>
      <div className='status'>
        <MatchingStatus
          checkMatching={checkMatching}
          matched={matched}
          matchedOpponent={matchedOpponent}
          numMatching={numMatching}
        />
      </div>
      <div className='condition'>
        <MatchingCondition
          matchingCondition={matchingCondition}
          handleMatchingCondition={handleMatchingCondition}
        />
      </div>

      <Button variant='secondary' className='button' onClick={startMatching} disabled={matched}>
        <span className='buttonText'>Start Matching</span>
        {/* we should also disable this button when first clicked this button
        currently did not implemented for testing purpose
        */}
      </Button>
    </div>
  );
};

export default Matching;

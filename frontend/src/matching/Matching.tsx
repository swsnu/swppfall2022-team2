import React, { useEffect, useState, useRef } from 'react';
import MatchingCondition from './MatchingCondition';
import MatchingStatus from './MatchingStatus';
import './Matching.css';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router';
import homeImg from '../img/home.png';
import NavBar from '../NavBar';
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
  id: number;
  name: string;
}
function useInterval(callback: () => void, delay: number): void {
  // https://overreacted.io/making-setinterval-declarative-with-react-hooks/
  const savedCallback = useRef<typeof callback | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick(): void {
      if (savedCallback.current !== null) {
        savedCallback.current();
      }
    }
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
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
    if (matched) {
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
            id: response.data.id,
            name: response.data.last_name + response.data.first_name,
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
    // for re-logined
    // get previous matching info
    axios
      .get(`matching/get`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          handleMatched(true);
          handleMatchedOpponent({
            time: String(response.data.time),
            spaceUser: response.data.space_user,
            spaceOpponent: response.data.space_opponent,
            mbti: response.data.mbti,
            gender: response.data.gender,
            age: response.data.age,
            id: response.data.id,
            name: response.data.last_name + response.data.first_name,
          });
        } else if (response.status === 201) {
          console.log(response);
          handleMatchingId(response.data.id);
          handlenumMatching(response.data.num_matching);
        }
      })
      .catch(() => {});
  }, []); // only executed when rendered
  useEffect(() => {
    // after start matching, automatically called
    if (matchingId !== 0) {
      checkMatching();
    }
  }, [matchingId]);
  useInterval(() => {
    // every 5 second, check whether matched
    checkMatching();
  }, 5000);
  return (
    <div>
      <NavBar />
      {/* <button onClick={toMain}>
        <img src={homeImg} width='35' />
      </button> */}
      <div className='status'>
        <MatchingStatus
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

      {numMatching !== null ? (
        <Button variant='secondary' className='button' onClick={checkMatching} disabled={matched}>
          <span className='buttonTextM'>Check Matching</span>
        </Button>
      ) : (
        <Button variant='secondary' className='button' onClick={startMatching} disabled={matched}>
          <span className='buttonTextM'>Start Matching</span>
        </Button>
      )}
    </div>
  );
};

export default Matching;

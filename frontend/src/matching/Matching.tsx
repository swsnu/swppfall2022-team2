import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSignIn, selectUser } from '../store/slices/user';
import MatchingCondition from './MatchingCondition';
import MatchingStatus from './MatchingStatus';
import './Matching.css';
import { Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../NavBar';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import GroupMatching from './GroupMatching';
import { AppDispatch } from '../store';
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
export function useInterval(callback: () => void, delay: number): void {
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
  const userState = useSelector(selectUser);

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
            name: String(response.data.name),
          });
        }
      })
      .catch(() => {});
  };
  const startMatching = (): void => {
    handleMatched(false);
    axios
      .post(`matching/start/`, {
        condition: matchingCondition,
      })
      .then((response) => {
        handleMatchingId(response.data.id);
        handlenumMatching(Number(response.data.num_matching));
      })
      .catch(() => {});
  };
  const stopMatching = (): void => {
    axios
      .delete(`matching/stop/`)
      .then(() => {
        handleMatchingId(0);
        handlenumMatching(null);
      })
      .catch(() => {
        // already matching is done
        checkMatching();
      });
  };
  const endMatching = (): void => {
    if (window.confirm('정말로 매칭을 종료하시겠습니까?')) {
      axios
        .post(`matching/end/`)
        .then(() => {
          handleMatchingId(0);
          handlenumMatching(null);
          handleMatched(false);
        })
        .catch(() => {});
    }
  };
  useEffect(() => {
    // for re-logined
    // get previous matching info
    axios
      .get(`matching/get`)
      .then((response) => {
        if (response.status === 200) {
          handleMatched(true);
          handleMatchedOpponent({
            time: String(response.data.time),
            spaceUser: response.data.space_user,
            spaceOpponent: response.data.space_opponent,
            mbti: response.data.mbti,
            gender: response.data.gender,
            age: response.data.age,
            id: response.data.id,
            name: String(response.data.name),
          });
        } else if (response.status === 201) {
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

  const dispatch = useDispatch<AppDispatch>();
  if (userState.loggedinuser === null) {
    if (window.localStorage.getItem('Token') !== null) {
      dispatch(setSignIn(Number(window.localStorage.getItem('id'))));
      console.log(window.localStorage.getItem('id'));
    } else {
      return <Navigate to='/login' />;
    }
  }

  return (
    <div>
      <NavBar />
      <Tabs defaultActiveKey='one' id='tabs' className='mb-3' justify>
        <Tab eventKey='one' title='1대1매칭' className='one'>
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
          {matched ? (
            <Button
              id='endButton'
              variant='secondary'
              className='button'
              onClick={endMatching}
              disabled={!matched}
            >
              <span className='buttonTextM'>매칭 끝내기</span>
            </Button>
          ) : numMatching !== null ? (
            <Button
              id='stopButton'
              variant='light'
              className='button'
              onClick={stopMatching}
              disabled={matched}
            >
              <span className='buttonTextM'>Stop Matching</span>
            </Button>
          ) : (
            <Button
              id='startButton'
              variant='secondary'
              className='button'
              onClick={startMatching}
              disabled={matched}
            >
              <span className='buttonTextM'>Start Matching</span>
            </Button>
          )}
        </Tab>
        <Tab eventKey='group' title='그룹매칭' className='group'>
          <GroupMatching />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Matching;

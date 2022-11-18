import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import GroupMatchingCondition from './GroupMatchingCondition';
import GroupMatchingStatus from './GroupMatchingStatus';
import { useInterval } from './Matching';
interface matchedOpponentType {
  id: number;
  name: string;
}
interface conditionType {
  time: string;
  menu: string;
  num: string;
}
const GroupMatching: React.FC = () => {
  const [matched, handleMatched] = useState<boolean>(false);
  const [matchedOpponents, handleMatchedOpponents] = useState<matchedOpponentType[]>([]);
  const [numMatching, handlenumMatching] = useState<number | null>(null);
  const [matchingId, handleMatchingId] = useState<number>(0);
  const [matchingCondition, handleMatchingCondition] = useState<conditionType>({
    time: '0',
    menu: '',
    num: '',
  });
  const [matchedCondition, handleMatchedCondition] = useState<conditionType>({
    time: '0',
    menu: '',
    num: '',
  });
  const checkMatching = (): void => {
    // check whether matching is completed or not
    if (matchingId === 0) {
      return;
    }
    if (matched) {
      return;
    }
    axios
      .get(`matching/group/check/${matchingId}/`)
      .then((response) => {
        if (response.status === 200) {
          // when matching succeed
          handleMatched(true);
          handleMatchedOpponents(response.data.opponents);
          handleMatchedCondition({
            time: response.data.time,
            menu: response.data.menu,
            num: String(Number(response.data.opponents.length) + 1),
          });
          // re-store at here for re-enter matching, should call checkMatching in useEffect
        }
      })
      .catch(() => {});
  };
  const startMatching = (): void => {
    // should check condition and open a modal if not selected
    // I think in group matching the condition should be selected
    handleMatched(false);
    axios
      .post(`matching/group/start/`, {
        condition: matchingCondition,
      })
      .then((response) => {
        handleMatchingId(response.data.id);
        handlenumMatching(Number(response.data.num_matching));
      })
      .catch(() => {});
  };
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
      <div className='status'>
        <GroupMatchingStatus
          matched={matched}
          matchedOpponents={matchedOpponents}
          numMatching={numMatching}
          matchedCondition={matchedCondition}
        />
      </div>
      <div className='condition'>
        <GroupMatchingCondition
          matchingCondition={matchingCondition}
          handleMatchingCondition={handleMatchingCondition}
        />
      </div>
      {numMatching !== null ? (
        <Button
          id='checkButton'
          variant='secondary'
          className='button'
          onClick={checkMatching}
          disabled={matched}
        >
          <span className='buttonTextM'>Check Matching</span>
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
    </div>
  );
};
export default GroupMatching;

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
        }
      })
      .catch(() => {});
  };
  const startMatching = (): void => {
    if (
      matchingCondition.time === '0' ||
      matchingCondition.menu === '' ||
      matchingCondition.num === ''
    ) {
      window.alert('그룹 매칭은 조건을 반드시 선택해야합니다.');
      return;
    }
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
  const stopMatching = (): void => {
    axios
      .delete(`matching/group/stop/`)
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
        .post(`matching/group/end/`)
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
      .get(`matching/group/get/`)
      .then((response) => {
        if (response.status === 200) {
          handleMatched(true);
          handleMatchedOpponents(response.data.opponents);
          handleMatchedCondition({
            time: response.data.time,
            menu: response.data.menu,
            num: String(Number(response.data.opponents.length) + 1),
          });
        } else if (response.status === 201) {
          handleMatchingId(response.data.id);
          handlenumMatching(Number(response.data.num_matching));
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
    </div>
  );
};
export default GroupMatching;

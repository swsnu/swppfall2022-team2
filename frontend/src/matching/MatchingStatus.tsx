import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
interface propsType {
  checkMatching: () => void;
}
const MatchingStatus: React.FC<propsType> = (props) => {
  const { checkMatching } = props;
  // eslint-disable-next-line
  const [matched, handleMatched] = useState(false); // for check whether matching is done, maybe should be changed to use Redux
  return matched ? (
    <div>
      <p>Matching Status</p>
      <div>
        information about the succeed matching
        <div>ex:profile image, gender, age</div>
      </div>
      <div>Num of people matching now</div>
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

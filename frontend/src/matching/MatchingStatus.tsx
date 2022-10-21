import { useState } from "react";

const MatchingStatus = () => {
  const [matched, handleMatched] = useState(false);
  //for check whether matching is done, maybe should be changed to use Redux
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
    </div>
  );
};

export default MatchingStatus;

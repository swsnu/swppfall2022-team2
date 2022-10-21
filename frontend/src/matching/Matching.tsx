import React from "react";
import MatchingCondition from "./MatchingCondition";
import MatchingStatus from "./MatchingStatus";
import "./Matching.css";
const startMatching = (): void => {
  //tell to server
};
const Matching = () => {
  return (
    <div>
      <div className="status">
        <MatchingStatus />
      </div>
      <div className="condition">
        <MatchingCondition />
      </div>
      <button className="button">Start Matching</button>
    </div>
  );
};

export default Matching;

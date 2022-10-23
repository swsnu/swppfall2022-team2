import React from "react";
import MatchingCondition from "./MatchingCondition";
import MatchingStatus from "./MatchingStatus";
import "./Matching.css";
import { Button } from "react-bootstrap";
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
      <Button variant="secondary" className="button">
        <span className="buttonText">Start Matching</span>
      </Button>
    </div>
  );
};

export default Matching;

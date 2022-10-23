import React, { useState } from "react";
import MatchingCondition from "./MatchingCondition";
import MatchingStatus from "./MatchingStatus";
import "./Matching.css";
import { Button } from "react-bootstrap";
import axios from "axios";

export type conditionType = {
  //this is temporary because another type for time and space is needed
  time: null | number;
  space: null | string;
  mbti: null | string;
  gender: null | string;
  age: null | { from: string | null; to: string | null };
};

const Matching = () => {
  const [matchingCondition, handleMatchingCondition] = useState<conditionType>({
    time: null,
    space: null,
    mbti: null,
    gender: null,
    age: null,
  });
  const startMatching = (): void => {
    axios // include the information of user is needed???
      .post(`http://localhost:8000/matching/start/`, {
        condition: matchingCondition,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <div className="status">
        <MatchingStatus />
      </div>
      <div className="condition">
        <MatchingCondition
          matchingCondition={matchingCondition}
          handleMatchingCondition={handleMatchingCondition}
        />
      </div>
      <Button variant="secondary" className="button" onClick={startMatching}>
        <span className="buttonText">Start Matching</span>
      </Button>
    </div>
  );
};

export default Matching;

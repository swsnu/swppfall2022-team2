import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

interface NotfoundProps {}

const Notfound: React.FC<NotfoundProps> = () => {
  const history = useNavigate();
  console.log({ history });
  return (
    <div className="container">
      <h2>Oups! Not found page!!</h2>
      <button className="goBack" onClick={() => history("/")}>
        Go back
      </button>
    </div>
  );
};

export default Notfound;

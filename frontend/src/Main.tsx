import React from 'react';
import ChatList from './chatting/ChatList';
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { selectUser } from './store/slices/user';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Main: React.FunctionComponent = () => {
  const userState = useSelector(selectUser);
  const navigate = useNavigate();

  if(userState.loggedinuser==null){
    return(
        <Navigate to="/login"/>
    )
  }

  const handleRedirect = () => {
    navigate('/matching')
  }

  const handleMyPage = () => {
    navigate('/mypage')
  }


  return(
    <div>
      <Button className="mb-3" variant='primary' onClick={handleRedirect}>Go To Matching</Button>
      <Button className="mb-3" variant="secondary" onClick={handleMyPage}>Go To My Page</Button>
      <p>This is Main Page!</p>
      <ChatList/>
    </div>
  )

};

export default Main;

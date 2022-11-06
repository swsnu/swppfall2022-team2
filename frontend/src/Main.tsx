import React from 'react';
import ChatList from './chatting/ChatList';
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from './store/slices/user';
import { AppDispatch } from './store';

const Main: React.FunctionComponent = () => {
  const userState = useSelector(selectUser);

  if(userState.loggedinuser==null){
    return(
        <Navigate to="/login"/>
    )
  }

  return(
    <div>
       <p>This is Main Page!</p>
        <ChatList/>
    </div>
  )

};

export default Main;

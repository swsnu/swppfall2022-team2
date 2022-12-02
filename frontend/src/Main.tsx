import React from 'react';
import ChatList from './chatting/ChatList';
import Menu from './menus/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser, setSignIn } from './store/slices/user';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css';
import NavBar from './NavBar';
import { AppDispatch } from './store';

const Main: React.FunctionComponent = () => {
  const userState = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  if (userState.loggedinuser === null) {
    if (window.localStorage.getItem('Token') !== null) {
      dispatch(setSignIn(Number(window.localStorage.getItem('id'))));
      console.log(window.localStorage.getItem('id'));
    } else {
      return <Navigate to='/login' />;
    }
  }

  return (
    <div>
      <NavBar />
      <div className='chat-list'>
        <ChatList />
      </div>
      <div className='menu-list'>
        <Menu />
      </div>
    </div>
  );
};

export default Main;

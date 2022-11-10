import React from 'react';
import ChatList from './chatting/ChatList';
import Menu from './menus/Menu';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser } from './store/slices/user';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css';
import NavBar from './NavBar';

const Main: React.FunctionComponent = () => {
  const userState = useSelector(selectUser);

  if (userState.loggedinuser === null) {
    return <Navigate to='/login' />;
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

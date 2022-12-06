import React, { useEffect, useState } from 'react';
import ChatList from './chatting/ChatList';
import Menu from './menus/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { selectUser, setSignIn, userActions } from './store/slices/user';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css';
import NavBar from './NavBar';
import { AppDispatch } from './store';
import { isImportTypeAssertionContainer } from 'typescript';

const Main: React.FunctionComponent = () => {
  const userState = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  useEffect(() => {
    if (userState.loggedinuser === null) {
      if (window.localStorage.getItem('Token') !== null) {
        dispatch(setSignIn(Number(window.localStorage.getItem('id'))));
      } else {
        navigate('/login');
      }
    }
  }, [userState.loggedinuser]);

  return (
      <div>
        <div>
          <NavBar />
        </div>
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

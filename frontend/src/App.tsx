import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Main from './Main';
import Matching from './matching/Matching';
import Login from './login/Login'
import ChatRoom from './chatting/ChatRoom'
import SignUp from './login/SignUp'
import MyPage from './mypage/MyPage'
import Chat from './chatting/components/Chat/Chat';
import { Socket } from 'socket.io-client';
import { UserType } from './store/slices/user';

interface IUser {
  username: string;
  room: string;
}

function App(): any {

  const [socket, setSocket] = useState<Socket | null>(null);
  const [user, setUser] = useState<UserType>();


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/login' element={<Login/>} />
        <Route path="/chatroom/:id" element={<Chat setUser={setUser} setSocket={setSocket}/>}/>
        <Route path='/main' element={<Main />} />
        <Route path='/matching' element={<Matching />} />
        <Route path='/mypage' element={<MyPage />} />
        {/* need to add components at here */}
        <Route path='*' element={<Navigate replace to={'/main'} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

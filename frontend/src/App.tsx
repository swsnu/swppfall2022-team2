import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Main from './Main';
import Matching from './matching/Matching';
import Login from './login/Login'
import ChatRoom from './chatting/ChatRoom'
import SignUp from './login/SignUp'
import MyPage from './mypage/MyPage'

function App(): any {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/login' element={<Login/>} />
        <Route path="/chatroom/:id" element={<ChatRoom/>}/>
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

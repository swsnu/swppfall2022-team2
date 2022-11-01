import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Main from './Main';
import Matching from './matching/Matching';
import Login from './login/Login'
import ChatList from './chatting/ChatList'
import ChatRoom from './chatting/ChatRoom'

function App(): any {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path="/chatroom/:id" element={<ChatRoom/>}/>
        <Route path='/main' element={<Main />} />
        <Route path='/matching' element={<Matching />} />
        {/* need to add components at here */}
        <Route path='*' element={<Navigate replace to={'/main'} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

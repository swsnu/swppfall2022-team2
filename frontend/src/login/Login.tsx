import { selectUser, setSignIn, UserInfoType, UserType } from '../store/slices/user';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import { AppDispatch } from '../store';
import './Login.css';
import { Button, Form, Card, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import logoImg from '../images/logo.jpg';
import axios from 'axios';

export default function Login() {
  const userState = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  if (userState.loggedinuser === null) {
    if (window.localStorage.getItem('Token') !== null) {
      dispatch(setSignIn(Number(window.localStorage.getItem('id'))));
      console.log(window.localStorage.getItem('id'));
      return <Navigate to='/main' />;
    }
  }

  const handleLogin = () => {
    axios
      .post('/chat/user/signin/', { username: username, password: password })
      .then((response) => {
        if (response.status === 200) {
          //   const user: UserType = response.data;
          window.localStorage.setItem('Token', response.data.Token);
          window.localStorage.setItem('id', response.data.id);
          window.localStorage.setItem('nickname', response.data.nickname);
          dispatch(setSignIn(response.data.id));
        } else {
          console.log('login failure');
        }
      })
      .catch(function (error) {
        window.alert('비밀번호나 아이디가 잘못되었습니다.');
      });
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleRedirect = () => {
    navigate('/signup');
  };

  if (userState.loggedinuser !== null) {
    return <Navigate to='/main' />;
  }

  return (
    <div className='sign-in d-flex justify-content-center align-items-center'>
      <Card>
        <Card.Header>
          <h3>
            <Image className='me-2' src={logoImg} alt='' width='60' height='48' />
            밥친구
          </h3>
        </Card.Header>
        <Card.Body>
          <Form className='rounded p-4 p-sm-3'>
            <Form.Group className='mb-3'>
              <Form.Label>Enter Username</Form.Label>
              <Form.Control
                type='username'
                placeholder='username'
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Enter Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='password'
                onKeyDown={(event) => {
                  handleKeyDown(event);
                }}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Form.Group>
            <Button className='mb-3' variant='primary' onClick={handleLogin}>
              Login!
            </Button>
            <Form.Group className='mb-3'>
              <a onClick={handleRedirect} className='link-primary'>
                Want to create an account?
              </a>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

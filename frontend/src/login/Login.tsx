import { selectUser, setSignIn, UserInfoType, UserType } from '../store/slices/user';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { AppDispatch } from '../store';
import './Login.css';
import { Button, Form, Card, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import logoImg from '../images/babchingu_signupin_logo.png';
import axios from 'axios';

export default function Login() {
  const userState = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // if (userState.loggedinuser === null) {
  //   if (window.localStorage.getItem('Token') !== null) {
  //     dispatch(setSignIn(Number(window.localStorage.getItem('id'))));
  //     return <Navigate to='/main' />;
  //   }
  // }
  useEffect(() => {
    if (userState.loggedinuser === null) {
      if (window.localStorage.getItem('Token') !== null) {
        dispatch(setSignIn(Number(window.localStorage.getItem('id'))));
        // navigate('/main');
      }
    }
  }, [userState.loggedinuser]);

  const handleLogin = () => {
    if(username === '' || password === '')
      window.alert('아이디와 비밀번호를 제대로 입력해주세요.');
    else{
      axios
        .post('/chat/user/signin/', { username: username, password: password })
        .then((response) => {
            //   const user: UserType = response.data;
            window.localStorage.setItem('Token', response.data.Token);
            window.localStorage.setItem('id', response.data.id);
            window.localStorage.setItem('nickname', response.data.nickname);
            dispatch(setSignIn(response.data.id));
            navigate(`/main`);
        })
        .catch(function (error) {
          window.alert('아이디 혹은 비밀번호가 잘못되었습니다.');
        });}
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
            <Image className='image-logo-center' src={logoImg} alt='' width='130' height='100' />
          </h3>
        </Card.Header>
        <Card.Body>
          <Form className='rounded p-4 p-sm-3'>
            <Form.Group className='mb-3'>
              <Form.Label>아이디</Form.Label>
              <Form.Control
                type='username'
                placeholder=''
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type='password'
                placeholder=''
                onKeyDown={(event) => {
                  handleKeyDown(event);
                }}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Form.Group>
            <Button className='mb-3' variant='secondary' onClick={handleLogin}>
              로그인
            </Button>
            <Form.Group className='mb-3'>
              <a onClick={handleRedirect} className='link-secondary'>
                계정을 만들고 싶습니다.
              </a>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

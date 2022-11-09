import { createChatRoom, selectUser, setSignIn } from '../store/slices/user';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import React, { useState } from "react";
import { AppDispatch } from '../store';
import './Login.css';
import { Button, Form, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import logoImg from '../images/logo.jpg';

export default function Login(){
    const userState = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const handleLogin = () => {
        dispatch(setSignIn({username: username, password: password}))
            .catch(err=>console.log(err))
            .then()
    }

    const handleRedirect = () => {
        navigate('/signup')
    }


    if(userState.loggedinuser!==null){
        return(
            <Navigate to="/main"/>
        )
    }

    return(
          <div className="sign-in d-flex justify-content-center align-items-center">
            <Card>
                <Card.Header>
                <h3>
                    <img
                        src={logoImg}
                        alt=''
                        width='60'
                        height='48'
                    />
                    밥친구
                </h3>
                </Card.Header>
                <Card.Body>
                    <Form className="rounded p-4 p-sm-3">
                        <Form.Group className="mb-3">
                            <Form.Label>Enter Username</Form.Label>
                            <Form.Control type="username" placeholder="username" onChange={event => setUsername(event.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Enter Password</Form.Label>
                            <Form.Control type="password" placeholder="password" onChange={event => setPassword(event.target.value)}/>
                        </Form.Group>
                        <Button className="mb-3" variant='primary' onClick={handleLogin}>
                            Login!
                        </Button>
                        <Form.Group className="mb-3">
                            <a onClick={handleRedirect} className="link-primary">Want to create an account?</a>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
         </div>
    )
}


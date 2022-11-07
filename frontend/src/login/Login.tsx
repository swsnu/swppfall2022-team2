import { selectUser } from '../store/slices/user';
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import { AppDispatch } from '../store';
import { setSignIn } from '../store/slices/user';
import React from 'react';
import './Login.css';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login(){
    //need to use the input email and password
    const userState = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    //handles the login event by checking the email and password
    //has to dispatch action to get user info and set login
    //also has to dispatch action to load in the articles and comments

    const handleLogin = () => {
        dispatch(setSignIn({username: username, password: password}))
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
         </div>
    )
}


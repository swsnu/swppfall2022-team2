import { selectUser,setSignUp  } from '../store/slices/user';
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import React, { useState } from "react";
import { AppDispatch } from '../store';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';

export default function SignUp(){
    //need to use the input email and password
    const userState = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    //handles the login event by checking the email and password
    //has to dispatch action to get user info and set login
    //also has to dispatch action to load in the articles and comments

    const handleSignUp = () => {
        dispatch(setSignUp({username: username, password: password}))
        navigate('/login')
    }

    const handleRedirect = () => {
        navigate('/login')
    }



    if(userState.loggedinuser!==null){
        return(
            <Navigate to="/main"/>
        )
    }

    return(
        <div className="sign-up d-flex justify-content-center align-items-center">
            <Form className="rounded p-4 p-sm-3">
                <Form.Group className="mb-3">
                    <Form.Label>New Username</Form.Label>
                    <Form.Control type="username" placeholder="new username" onChange={event => setUsername(event.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="new password" onChange={event => setPassword(event.target.value)}/>
                </Form.Group>
                <Button className="mb-3" variant='primary' onClick={handleSignUp}>
                    Sign Up!
                </Button>
                <Form.Group className="mb-3">
                    <a onClick={handleRedirect} className="link-primary">Already have an account?</a>
                </Form.Group>
            </Form>
        </div>
    )
}
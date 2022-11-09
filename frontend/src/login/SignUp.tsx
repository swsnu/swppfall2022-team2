import { selectUser,setSignUp  } from '../store/slices/user';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import React, { useState } from "react";
import { AppDispatch } from '../store';
import { Button, Form, Card, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';
import logoImg from '../images/logo.jpg';

export default function SignUp(){
    const userState = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

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
            <Card>
                <Card.Header>
                <h3>
                    <Image
                        className="me-2"
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
                </Card.Body>
            </Card>
        </div>
    )
}
import { selectUser } from '../store/slices/user';
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import { AppDispatch } from '../store';
import { setSignUp } from '../store/slices/user';

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

    const handleLogin = () => {
        dispatch(setSignUp({username: username, password: password}))
        navigate('/login')
    }


    if(userState.loggedinuser!==null){
        return(
            <Navigate to="/main"/>
        )
    }

    return(
        <div className="Login">
            <input id="username-input" onChange={event => setUsername(event.target.value)}/>
            <input id="pw-input" onChange={event => setPassword(event.target.value)}/>
            <button id="login-button" onClick={handleLogin}>Sign Up!</button>
        </div>
    )
}
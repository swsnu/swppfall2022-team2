import { selectUser,setSignUp  } from '../store/slices/user';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import React, { useState } from "react";
import { AppDispatch } from '../store';
import { Button, Form, Card, Image, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';
import logoImg from '../images/babchingu_signupin_logo.png';
import axios from 'axios';

export interface signUpStatusType{
    name: string;
    mbti: string;
    gender: string;
    nickname: string;
    birth: string;
    email: string;
    domain: string;
}

export default function SignUp(){
    const userState = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [emailConfirm, setEmailConfirm] = useState("");
    const [signUpStatus, handleSignUpStatus] = useState<signUpStatusType>({
        name: '',
        mbti: '',
        gender: '',
        nickname: '',
        birth: '',
        email: '',
        domain: '',
    });


    const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>('');
    const [usernameIsValid, setUsernameIsValid] = useState<boolean>(false);

    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
    const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);

    const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState<string>('');
    const [passwordConfirmIsValid, setPasswordConfirmIsValid] = useState<boolean>(false);

    const [nameErrorMessage, setNameErrorMessage] = useState<string>('');
    const [nameIsValid, setNameIsValid] = useState<boolean>(false);

    const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>('');
    const [nicknameIsValid, setNicknameIsValid] = useState<boolean>(false);

    const [birthErrorMessage, setBirthErrorMessage] = useState<string>('');
    const [birthIsValid, setBirthIsValid] = useState<boolean>(false);

    const [emailErrorMessage, setEmailErrorMessage] = useState<string>('???????????? ??????????????????.');
    const [emailIsValid, setEmailIsValid] = useState<boolean>(false);

    const [genderErrorMessage, setGenderErrorMessage] = useState<string>('????????? ??????????????????.');
    const [genderIsSelected, setGenderIsSelected] = useState<boolean>(false);

    const [mbtiErrorMessage, setMbtiErrorMessage] = useState<string>('MBTI??? ??????????????????.');
    const [mbtiIsSelected, setMbtiIsSelected] = useState<boolean>(false);

    const [domainErrorMessage, setDomainErrorMessage] = useState<string>('???????????? ??????????????????.');
    const [domainIsSelected, setDomainIsSelected] = useState<boolean>(false);

    const [emailConfirmErrorMessage, setEmailConfirmErrorMessage] = useState<string>('');
    const [emailConfirmIsCorrect, setEmailConfirmIsCorrect] = useState<boolean>(false);

    const [emailConfirmNumber, setEmailCofirmNumber] = useState<string>('000000');

    const [emailIsSent, setEmailIsSent] = useState<boolean>(false);

    const handleUsername = (e: React.BaseSyntheticEvent) : void => {
        setUsername(e.target.value);
        // TODO: check username whether it is duplicated
        const usernameReg = /^[a-zA-Z0-9]{5,20}$/ 
        if(e.target.value.length < 5){
            setUsernameErrorMessage('???????????? ?????? ????????????.');
            setUsernameIsValid(false);
        }
        /*
        else if(e.target.value.length > 20){
            setUsernameErrorMessage('????????? ?????? ?????????.');
            setUsernameIsValid(false);
        */
        else if (!usernameReg.test(e.target.value)) {
            setUsernameErrorMessage('???????????? ?????? ????????? ???????????? ????????????.')
            setUsernameIsValid(false);
        }
        else{
            axios
                .post(`mypage/id/`,{username:e.target.value})
                .then((response) => {
                    if(response.data.dup === true){
                        setUsernameErrorMessage('?????? ???????????? ?????? ?????? ??????????????????.');
                        setUsernameIsValid(false);
                    }
                    else{
                        setUsernameErrorMessage('');
                        setUsernameIsValid(true);
                    }
                })
                .catch(() => {
                });   
        }
    };

    const handlePassword = (e: React.BaseSyntheticEvent) : void => {
        setPassword(e.target.value);
        const passwordReg = /^[!-~]{8,20}$/
        // ?????? ?????????, ??????, ???????????? ??? ??? ?????? ???????????? ??????. ??? ?????? ????????? ??????+??????????????? ????????? ??? ????????? ????????? ??????
        if(e.target.value.length < 8){
            setPasswordErrorMessage('??????????????? ?????? ????????????.');
            setPasswordIsValid(false);
        }
        else if(!passwordReg.test(e.target.value)){
            setPasswordErrorMessage('???????????? ?????? ????????? ???????????? ????????????.');
            setPasswordIsValid(false);
        }
        else{
            setPasswordErrorMessage('');
            setPasswordIsValid(true);
        }
        if(e.target.value !== passwordConfirm){
            setPasswordConfirmErrorMessage('??????????????? ????????? ??????????????????.');
            setPasswordConfirmIsValid(false);
        }
        else{
            setPasswordConfirmErrorMessage('');
            setPasswordConfirmIsValid(true);
        }
    };

    const handlePasswordConfirm = (e: React.BaseSyntheticEvent) : void => {
        setPasswordConfirm(e.target.value);
        if(e.target.value !== password){
            setPasswordConfirmErrorMessage('??????????????? ????????? ??????????????????.');
            setPasswordConfirmIsValid(false);
        }
        else{
            setPasswordConfirmErrorMessage('');
            setPasswordConfirmIsValid(true);
        }
    };

    const handleName = (e: React.BaseSyntheticEvent) : void => {
        handleSignUpStatus({ ...signUpStatus, name: e.target.value });
        const nameReg = /^[???-???a-zA-Z\\. ]{2,30}$/
        if(e.target.value.length < 2){
            setNameErrorMessage('????????? ?????? ????????????.');
            setNameIsValid(false);
        }
        /*
        else if(e.target.value.length > 30){
            setNameErrorMessage('????????? ?????? ?????????.');
            setNameIsValid(false);
        */
        else if (!nameReg.test(e.target.value)) {
            setNameErrorMessage('???????????? ?????? ????????? ???????????? ????????????.');
            setNameIsValid(false);
        }
        else{
            setNameErrorMessage('');
            setNameIsValid(true);
        }
    };
    const handleMBTI: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
        handleSignUpStatus({ ...signUpStatus, mbti: e.target.value });
        setMbtiErrorMessage('');
        setMbtiIsSelected(true);
    };
    const handleGender: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
        handleSignUpStatus({ ...signUpStatus, gender: e.target.value });
        setGenderErrorMessage('');
        setGenderIsSelected(true);
    };
    const handleNickname = (e: React.BaseSyntheticEvent) : void => {
        handleSignUpStatus({ ...signUpStatus, nickname: e.target.value });
        // TODO: check nickname whether it is duplicated
        const nicknameReg = /^[a-zA-Z???-???0-9]{2,10}$/;
        if(e.target.value.length < 2){
            setNicknameErrorMessage('????????? ?????? ????????????.');
            setNicknameIsValid(false);
        }
        /*
        else if(e.target.value.length > 10){
            setNicknameErrorMessage('????????? ?????? ?????????.');
            setNicknameIsValid(false);
        */
        else if (!nicknameReg.test(e.target.value)) {
            setNicknameErrorMessage('???????????? ?????? ????????? ???????????? ????????????.');
            setNicknameIsValid(false);
        }
        else{
            axios
                .post(`mypage/nick/`,{nickname:e.target.value})
                .then((response) => {
                    if(response.data.dup === true){
                        setNicknameErrorMessage('?????? ???????????? ?????? ?????? ???????????????.');
                        setNicknameIsValid(false);
                    }
                    else{
                        setNicknameErrorMessage('');
                        setNicknameIsValid(true);
                    }
                })
                .catch(() => {
                });   
        }
    };
    const handleBirth = (e: React.BaseSyntheticEvent) : void => {
        handleSignUpStatus({ ...signUpStatus, birth: e.target.value });
        const birthReg = /^[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
        if(e.target.value.length < 6){
            setBirthErrorMessage('????????? ???????????? ??????????????????.');
            setBirthIsValid(false);
        }
        else if (!birthReg.test(e.target.value)) {
            setBirthErrorMessage('????????? ???????????? ??????????????????.');
            setBirthIsValid(false);
        }
        else if(+e.target.value%100 === 31 && 
            ((~~(+e.target.value/100))%100 === 4 || (~~(+e.target.value/100))%100 === 6 || (~~(+e.target.value/100))%100 === 9 || (~~(+e.target.value/100))%100 === 11)) {
            setBirthErrorMessage('????????? ???????????? ??????????????????.');
            setBirthIsValid(false);
        }
        else if((~~(+e.target.value/100))%100 === 2 && (~~(+e.target.value/10))%10 === 3) {
            setBirthErrorMessage('????????? ???????????? ??????????????????.');
            setBirthIsValid(false);
        }
        else if((~~(+e.target.value/100))%100 === 2 && (~~(+e.target.value))%100 === 29 && (~~(+e.target.value/10000))%4 !== 0) {
            setBirthErrorMessage('????????? ???????????? ??????????????????.');
            setBirthIsValid(false);
        }
        else{
            setBirthErrorMessage('');
            setBirthIsValid(true);
        }
    };
    const handleEmail = (e: React.BaseSyntheticEvent) : void => {
        handleSignUpStatus({ ...signUpStatus, email: e.target.value });
        const emailReg = /^[a-zA-Z0-9\\.]{1,100}$/;
        if(e.target.value.length < 1){
            setEmailErrorMessage('???????????? ??????????????????.');
            setEmailIsValid(false);
        }
        else if (!emailReg.test(e.target.value)) {
            setEmailErrorMessage('???????????? ?????? ????????? ???????????? ????????????.')
            setEmailIsValid(false);
        }
        else{
            setEmailErrorMessage('');
            setEmailIsValid(true);
        }
    };
    const handleDomain: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
        handleSignUpStatus({ ...signUpStatus, domain: e.target.value });
        setDomainErrorMessage('');
        setDomainIsSelected(true);
    };
    const handleEmailConfirm = (e: React.BaseSyntheticEvent) : void => {
        setEmailConfirm(e.target.value );
        const emailConfirmReg = /^[0-9]{6}$/;
        if(e.target.value.length < 6){
            setEmailConfirmErrorMessage('?????? ????????? ??????????????????.');
            setEmailConfirmIsCorrect(false);
        }
        else if (!emailConfirmReg.test(e.target.value)) {
            setEmailConfirmErrorMessage('???????????? ?????? ????????? ???????????? ????????????.')
            setEmailConfirmIsCorrect(false);
        }
        else{
            setEmailConfirmErrorMessage('');
            setEmailConfirmIsCorrect(true);
        }
    };

    const sendEmail = () => {
        const rand = Math.floor(1000000 + Math.random()*999999);
        setEmailCofirmNumber(rand.toString().slice(1));
        axios
            .post(`chat/user/send_email/`,{email:(signUpStatus.email+signUpStatus.domain), rand:rand.toString().slice(1)})
            .catch(() => {
            });   

        setEmailConfirmErrorMessage('??????????????? ??????????????????.');
        setEmailIsSent(true);
    }

    const navigate = useNavigate();

    const handleSignUp = () => {
        if(emailConfirmNumber !== emailConfirm){
            window.alert('?????? ????????? ???????????? ????????????.');
            return;
        }

        try{dispatch(setSignUp({username: username, password: password, name: signUpStatus.name,
            mbti: signUpStatus.mbti, gender: signUpStatus.gender, nickname: signUpStatus.nickname,
            birth: signUpStatus.birth, email: (signUpStatus.email+signUpStatus.domain)}));
            window.alert('?????? ????????? ??????????????? ?????????????????????.');
            navigate('/login');
        
        }
        catch(err){
        }
    }

    const handleRedirect = () => {
        navigate('/login');
    }



    if(userState.loggedinuser!==null){
        return(
            <Navigate to="/main"/>
        )
    }

    return(
        <div className="sign-up d-flex justify-content-center align-items-center">
            <Card style={{width:"50%", height:"80%"}}>
                <Card.Header>
                <h3>
                    <Image
                        className="image-logo-center"
                        src={logoImg}
                        alt=''
                        width='72'
                        height='58'
                    />
                </h3>
                </Card.Header>
                <Card.Body className='p-0'>
                    <Form className="rounded p-4 p-sm-8">
                        <Form.Group className="mb-3">
                            <Form.Label>?????????</Form.Label>
                            <Form.Control type="username" placeholder="??????, ?????? (5~20??? ??????)" onChange={handleUsername} maxLength={20}/>
                            {<span className='errormessage'> {usernameErrorMessage}</span>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>????????????</Form.Label>
                            <Form.Control type="password" placeholder="??????, ??????, ???????????? (8~20??? ??????)" onChange={handlePassword} maxLength={20}/>
                            {<span className='errormessage'> {passwordErrorMessage}</span>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>???????????? ?????????</Form.Label>
                            <Form.Control type="password" placeholder="??????????????? ?????????????????????." onChange={handlePasswordConfirm} maxLength={20}/>
                            {<span className='errormessage'> {passwordConfirmErrorMessage}</span>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>??????</Form.Label>
                            <Form.Control type="text" placeholder="????????? ???????????????." maxLength={30} onChange={handleName}/>
                            {<span className='errormessage'> {nameErrorMessage}</span>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>??????</Form.Label>
                            <Form.Control type="text" placeholder="?????? ??????????????? ????????? ???????????????." maxLength={10} onChange={handleNickname}/>
                            {<span className='errormessage'> {nicknameErrorMessage}</span>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>??????</Form.Label>
                            <Form.Select name='gender' id="genderChoose" defaultValue={''} onChange={handleGender}>
                                <option value = '' disabled>?????? ??????</option>
                                <option value = 'M'>??????</option>
                                <option value = 'F'>??????</option>
                            </Form.Select>
                            {<span className='errormessage'> {genderErrorMessage}</span>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>????????????</Form.Label>
                            <Form.Control type="text" placeholder="YYMMDD ????????? ??????????????????. ???) 970816" maxLength={6} onChange={handleBirth}/>
                            {<span className='errormessage'> {birthErrorMessage}</span>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>MBTI</Form.Label>
                            <Form.Select name='mbti' id='mbtiChoose' defaultValue={''} onChange={handleMBTI}>
                                <option value = '' disabled>?????? ??????</option>
                                <option value = 'ENTJ'>ENTJ</option>
                                <option value = 'ENTP'>ENTP</option>
                                <option value = 'ENFJ'>ENFJ</option>
                                <option value = 'ENFP'>ENFP</option>
                                <option value = 'ESTJ'>ESTJ</option>
                                <option value = 'ESTP'>ESTP</option>
                                <option value = 'ESFJ'>ESFJ</option>
                                <option value = 'ESFP'>ESFP</option>
                                <option value = 'INTJ'>INTJ</option>
                                <option value = 'INTP'>INTP</option>
                                <option value = 'INFJ'>INFJ</option>
                                <option value = 'INFP'>INFP</option>
                                <option value = 'ISTJ'>ISTJ</option>
                                <option value = 'ISTP'>ISTP</option>
                                <option value = 'ISFJ'>ISFJ</option>
                                <option value = 'ISFP'>ISFP</option>
                            </Form.Select>
                            {<span className='errormessage'> {mbtiErrorMessage}</span>}
                        </Form.Group>
                        <Row className='mb-3'>
                            <Form.Label>?????? ?????????</Form.Label>
                            <Form.Group as={Col}>
                                <Form.Control type="text" placeholder="youremail" maxLength={100} onChange={handleEmail}
                                disabled={(emailIsSent)}/>
                                {<span className='errormessage'> {emailErrorMessage}</span>}
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Select name='domain' id='domainChoose' defaultValue={''} onChange={handleDomain}
                                disabled={(emailIsSent)}>
                                <option value = '' disabled>?????? ??????</option>
                                <option value = '@korea.ac.kr' disabled>@korea.ac.kr (???????????????)</option>
                                <option value = '@snu.ac.kr'>@snu.ac.kr (???????????????)</option>
                                <option value = '@yonsei.ac.kr' disabled>@yonsei.ac.kr (???????????????)</option>
                                <option value = '@kaist.ac.kr' disabled>@kaist.ac.kr (KAIST)</option>
                                </Form.Select>
                                {<span className='errormessage'> {domainErrorMessage}</span>}
                            </Form.Group>
                        </Row>
                        <Row className='mb-3'>
                            <Form.Label>?????? ??????</Form.Label>
                            <Form.Group as={Col}>
                                <Form.Control type="text" placeholder="???????????? 6????????? ??????????????????." 
                                maxLength={6} onChange={handleEmailConfirm}
                                disabled={!(emailIsValid && domainIsSelected && emailIsSent)}/>
                                {<span className='errormessage'> {emailConfirmErrorMessage}</span>}
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Button className="mb-3" variant='secondary' onClick={sendEmail}
                                disabled={!(emailIsValid && domainIsSelected && !emailIsSent)}>
                                    ?????? ?????? ?????????
                                </Button>
                            </Form.Group>
                        </Row>
                        <Button className="mb-3" variant='secondary' onClick={handleSignUp} style={{verticalAlign:'bottom'}}
                        disabled={!(usernameIsValid && passwordIsValid && passwordConfirmIsValid && nicknameIsValid && emailConfirmIsCorrect
                        && nameIsValid && birthIsValid && emailIsValid && domainIsSelected && mbtiIsSelected && genderIsSelected)}>
                            ????????????
                        </Button>
                        <Form.Group className="mb-3" style={{verticalAlign:'bottom'}}>
                            <a onClick={handleRedirect} className="link-secondary">?????? ????????? ????????????.</a>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}
import { selectUser,setSignUp  } from '../store/slices/user';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import React, { useState } from "react";
import { AppDispatch } from '../store';
import { Button, Form, Card, Image, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';
import logoImg from '../images/logo.jpg';

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

    const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
    const [emailIsValid, setEmailIsValid] = useState<boolean>(false);

    const [domainIsSelected, setDomainIsSelected] = useState<boolean>(false);

    const handleUsername = (e: React.BaseSyntheticEvent) : void => {
        setUsername(e.target.value);
        // TODO: check username whether it is duplicated
        const usernameReg = /^[a-zA-Z0-9]{5,20}$/ 
        if(e.target.value.length < 5){
            setUsernameErrorMessage('아이디가 너무 짧습니다.');
            setUsernameIsValid(false);
        }
        /*
        else if(e.target.value.length > 20){
            setUsernameErrorMessage('이름이 너무 깁니다.');
            setUsernameIsValid(false);
        */
        else if (!usernameReg.test(e.target.value)) {
            setUsernameErrorMessage('허용되지 않는 문자가 포함되어 있습니다.')
            setUsernameIsValid(false);
        }
        else{
            setUsernameErrorMessage('');
            setUsernameIsValid(true);
        }
    };

    const handlePassword = (e: React.BaseSyntheticEvent) : void => {
        setPassword(e.target.value);
        const passwordReg = /^[!-~]{8,20}$/
        // 영어 알파벳, 숫자, 자판으로 칠 수 있는 특수문자 허용. 그 외의 문자도 복사+붙여넣기로 입력할 수 있으니 거르는 역할
        if(e.target.value.length < 8){
            setPasswordErrorMessage('비밀번호가 너무 짧습니다.');
            setPasswordIsValid(false);
        }
        else if(!passwordReg.test(e.target.value)){
            setPasswordErrorMessage('허용되지 않는 문자가 포함되어 있습니다.');
            setPasswordIsValid(false);
        }
        else{
            setPasswordErrorMessage('');
            setPasswordIsValid(true);
        }
        if(e.target.value !== passwordConfirm){
            setPasswordConfirmErrorMessage('비밀번호를 똑같이 입력해주세요.');
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
            setPasswordConfirmErrorMessage('비밀번호를 똑같이 입력해주세요.');
            setPasswordConfirmIsValid(false);
        }
        else{
            setPasswordConfirmErrorMessage('');
            setPasswordConfirmIsValid(true);
        }
    };

    const handleName = (e: React.BaseSyntheticEvent) : void => {
        handleSignUpStatus({ ...signUpStatus, name: e.target.value });
        const nameReg = /^[가-힣a-zA-Z\. ]{2,30}$/
        if(e.target.value.length < 2){
            setNameErrorMessage('이름이 너무 짧습니다.');
            setNameIsValid(false);
        }
        /*
        else if(e.target.value.length > 30){
            setNameErrorMessage('이름이 너무 깁니다.');
            setNameIsValid(false);
        */
        else if (!nameReg.test(e.target.value)) {
            setNameErrorMessage('허용되지 않는 문자가 포함되어 있습니다.')
            setNameIsValid(false);
        }
        else{
            setNameErrorMessage('');
            setNameIsValid(true);
        }
    };
    const handleMBTI: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
        handleSignUpStatus({ ...signUpStatus, mbti: e.target.value });
    };
    const handleGender: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
        handleSignUpStatus({ ...signUpStatus, gender: e.target.value });
    };
    const handleNickname = (e: React.BaseSyntheticEvent) : void => {
        handleSignUpStatus({ ...signUpStatus, nickname: e.target.value });
        // TODO: check nickname whether it is duplicated
        const nicknameReg = /^[a-zA-Z가-힣0-9]{2,10}$/;
        if(e.target.value.length < 2){
            setNicknameErrorMessage('별명이 너무 짧습니다.');
            setNicknameIsValid(false);
        }
        /*
        else if(e.target.value.length > 10){
            setNicknameErrorMessage('별명이 너무 깁니다.');
            setNicknameIsValid(false);
        */
        else if (!nicknameReg.test(e.target.value)) {
            setNicknameErrorMessage('허용되지 않는 문자가 포함되어 있습니다.')
            setNicknameIsValid(false);
        }
        else{
            setNicknameErrorMessage('');
            setNicknameIsValid(true);
        }
    };
    const handleBirth = (e: React.BaseSyntheticEvent) : void => {
        handleSignUpStatus({ ...signUpStatus, birth: e.target.value });
        const birthReg = /^[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
        if(e.target.value.length < 6){
            setBirthErrorMessage('올바른 형식으로 입력해주세요.');
            setBirthIsValid(false);
        }
        else if (!birthReg.test(e.target.value)) {
            setBirthErrorMessage('올바른 형식으로 입력해주세요.')
            setBirthIsValid(false);
        }
        else if(+e.target.value%100 === 31 && 
            ((~~(+e.target.value/100))%100 === 4 || (~~(+e.target.value/100))%100 === 6 || (~~(+e.target.value/100))%100 === 9 || (~~(+e.target.value/100))%100 === 11)) {
            setBirthErrorMessage('올바른 형식으로 입력해주세요.')
            setBirthIsValid(false);
        }
        else if((~~(+e.target.value/100))%100 === 2 && (~~(+e.target.value/10))%10 === 3) {
            setBirthErrorMessage('올바른 형식으로 입력해주세요.')
            setBirthIsValid(false);
        }
        else{
            setBirthErrorMessage('');
            setBirthIsValid(true);
        }
    };
    const handleEmail = (e: React.BaseSyntheticEvent) : void => {
        handleSignUpStatus({ ...signUpStatus, email: e.target.value });
        const emailReg = /^[a-zA-Z0-9\.]{1,100}$/;
        if(e.target.value.length < 1){
            setEmailErrorMessage('이메일을 입력해주세요.');
            setEmailIsValid(false);
        }
        else if (!emailReg.test(e.target.value)) {
            setEmailErrorMessage('허용되지 않는 문자가 포함되어 있습니다.')
            setEmailIsValid(false);
        }
        else{
            setEmailErrorMessage('');
            setEmailIsValid(true);
        }
    };
    const handleDomain: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
        handleSignUpStatus({ ...signUpStatus, domain: e.target.value });
        setDomainIsSelected(true);
    };
    const navigate = useNavigate();

    const handleSignUp = () => {
        try{dispatch(setSignUp({username: username, password: password, name: signUpStatus.name,
            mbti: signUpStatus.mbti, gender: signUpStatus.gender, nickname: signUpStatus.nickname,
            birth: signUpStatus.birth, email: (signUpStatus.email+signUpStatus.domain)}));
            alert('회원 가입이 정상적으로 완료되었습니다.');
            navigate('/login');
        
        }
        catch(err){
            alert('예기치 않은 오류가 발생했습니다.');
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
                            <Form.Label>아이디</Form.Label>
                            <Form.Control type="username" placeholder="영문, 숫자 (5~20자 이내)" onChange={handleUsername} maxLength={20}/>
                            {<span className='errormessage'> {usernameErrorMessage}</span>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control type="password" placeholder="영문, 숫자, 특수문자 (8~20자 이내)" onChange={handlePassword} maxLength={20}/>
                            {<span className='errormessage'> {passwordErrorMessage}</span>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>비밀번호 재확인</Form.Label>
                            <Form.Control type="password" placeholder="비밀번호를 재입력해주세요." onChange={handlePasswordConfirm} maxLength={20}/>
                            {<span className='errormessage'> {passwordConfirmErrorMessage}</span>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>이름</Form.Label>
                            <Form.Control type="text" placeholder="본인의 실명입니다." maxLength={30} onChange={handleName}/>
                            {<span className='errormessage'> {nameErrorMessage}</span>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>별명</Form.Label>
                            <Form.Control type="text" placeholder="다른 이용자에게 보여질 이름입니다." maxLength={10} onChange={handleNickname}/>
                            {<span className='errormessage'> {nicknameErrorMessage}</span>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>성별</Form.Label>
                            <Form.Select id="gender" defaultValue={''} onChange={handleGender}>
                                <option value = '' disabled>선택 안함</option>
                                <option value = 'M'>남자</option>
                                <option value = 'F'>여자</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>생년월일</Form.Label>
                            <Form.Control type="text" placeholder="YYMMDD 형태로 입력해주세요. 예) 970816" maxLength={6} onChange={handleBirth}/>
                            {<span className='errormessage'> {birthErrorMessage}</span>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>MBTI</Form.Label>
                            <Form.Select name='mbti' defaultValue={''} onChange={handleMBTI}>
                                <option value = '' disabled>선택 안함</option>
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
                        </Form.Group>
                        <Row className='mb-3'>
                            <Form.Label>학교 이메일</Form.Label>
                            <Form.Group as={Col}>
                                <Form.Control type="text" placeholder="youremail" maxLength={100} onChange={handleEmail}/>
                                {<span className='errormessage'> {emailErrorMessage}</span>}
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Select name='domain' defaultValue={''} onChange={handleDomain}>
                                <option value = '' disabled>선택 안함</option>
                                <option value = '@snu.ac.kr'>@snu.ac.kr (서울대학교)</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Button className="mb-3" variant='primary' onClick={handleSignUp}
                        disabled={!(usernameIsValid && passwordIsValid && passwordConfirmIsValid && nicknameIsValid 
                        && nameIsValid && birthIsValid && emailIsValid && domainIsSelected)}>
                            가입하기
                        </Button>
                        <Form.Group className="mb-3">
                            <a onClick={handleRedirect} className="link-primary">이미 계정이 있습니다.</a>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}
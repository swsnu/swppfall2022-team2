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
}

export default function SignUp(){
    const userState = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [signUpStatus, handleSignUpStatus] = useState<signUpStatusType>({
        name: '',
        mbti: '',
        gender: '',
        nickname: '',
        birth: '',
        email: '',
    });
    const handleName = (e: React.BaseSyntheticEvent) : void => {
        handleSignUpStatus({ ...signUpStatus, name: e.target.value });
    };
    const handleMBTI: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
        handleSignUpStatus({ ...signUpStatus, mbti: e.target.value });
    };
    const handleGender: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
        handleSignUpStatus({ ...signUpStatus, gender: e.target.value });
    };
    const handleNickname = (e: React.BaseSyntheticEvent) : void => {
        handleSignUpStatus({ ...signUpStatus, nickname: e.target.value });
    };
    const handleBirth = (e: React.BaseSyntheticEvent) : void => {
        handleSignUpStatus({ ...signUpStatus, birth: e.target.value });
    };
    const navigate = useNavigate();

    const handleSignUp = () => {
        try{dispatch(setSignUp({username: username, password: password, name: signUpStatus.name,
            mbti: signUpStatus.mbti, gender: signUpStatus.gender, nickname: signUpStatus.nickname,
            birth: signUpStatus.birth, email: signUpStatus.email}))
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
                            <Form.Control type="username" placeholder="영문, 숫자 (5~15자 이내)" onChange={event => setUsername(event.target.value)} maxLength={15}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control type="password" placeholder="영문, 숫자, 특수문자 (8~15자 이내)" onChange={event => setPassword(event.target.value)} maxLength={15}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>비밀번호 재확인</Form.Label>
                            <Form.Control type="password" placeholder="비밀번호를 재입력해주세요." maxLength={15}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>이름</Form.Label>
                            <Form.Control type="text" placeholder="본인의 실명입니다." maxLength={30} onChange={handleName}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>별명</Form.Label>
                            <Form.Control type="text" placeholder="다른 이용자에게 보여질 이름입니다." maxLength={10} onChange={handleNickname}/>
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
                        <Form.Group className="mb-3">
                            <Form.Label>이메일</Form.Label>
                            <Form.Control type="text" placeholder="youremail@snu.ac.kr" maxLength={100}/>
                        </Form.Group>
                        <Button className="mb-3" variant='primary' onClick={handleSignUp}>
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
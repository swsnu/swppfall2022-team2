import React, {useState, useEffect} from 'react';
import {Form, Row, Col, FormControlProps, FormControl} from 'react-bootstrap';
import {statusType} from './MyPage'
import uuid from "react-uuid"
import { Button} from 'react-bootstrap';

interface propsType {
    status: statusType;
    handleStatus: (a: statusType) => void;
    statusSubmit: (e: React.FormEvent<HTMLFormElement>) => any;
  }
const MyStatus: React.FC<propsType> = (props:propsType) => {
    const {status, handleStatus, statusSubmit} = props;
    
    const [somethingModified, setSomethingModified] = useState<boolean>(false);

    const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>('');
    const [nicknameIsValid, setNicknameIsValid] = useState<boolean>(true);

    const [nameErrorMessage, setNameErrorMessage] = useState<string>('');
    const [nameIsValid, setNameIsValid] = useState<boolean>(true);

    const [birthErrorMessage, setBirthErrorMessage] = useState<string>('');
    const [birthIsValid, setBirthIsValid] = useState<boolean>(true);

    const [introErrorMessage, setIntroErrorMessage] = useState<string>('');
    const [introIsValid, setIntroIsValid] = useState<boolean>(true);


    const handleName = (e: React.BaseSyntheticEvent) : void => {
        handleStatus({ ...status, name: e.target.value });
        setSomethingModified(true);
        const nameReg = /^[가-힣]{2,30}$/ //외국 이름? /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/; 
        if(e.target.value.length < 2){
            setNameErrorMessage('이름이 너무 짧습니다.');
            setNameIsValid(false);
        }
        /*
        else if(e.target.value.length > 30){
            setNicknameErrorMessage('이름이 너무 깁니다.');
            setNicknameIsValid(false);
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
    const handleBirth = (e: React.BaseSyntheticEvent) : void => {
        handleStatus({ ...status, birth: e.target.value });
        setSomethingModified(true);
        const birthReg = /^[0-9]{6}$/; //수정 필요
        if(e.target.value.length < 6){
            setBirthErrorMessage('올바른 형식으로 입력해주세요.');
            setBirthIsValid(false);
        }
        else if (!birthReg.test(e.target.value)) {
            setBirthErrorMessage('올바른 형식으로 입력해주세요.')
            setBirthIsValid(false);
        }
        else{
            setBirthErrorMessage('');
            setBirthIsValid(true);
        }
    };
    const handleGender: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
        handleStatus({ ...status, gender: e.target.value });
        setSomethingModified(true);
    };
    const handleIntro = (e: React.BaseSyntheticEvent) : void => {
        handleStatus({ ...status, intro: e.target.value });
        setSomethingModified(true);
        const introReg = /./; //전부 허용할 것인가?
        if (!introReg.test(e.target.value)) {
            setIntroErrorMessage('올바른 형식으로 입력해주세요.')
            setIntroIsValid(false);
        }
        else{
            setIntroErrorMessage('');
            setIntroIsValid(true);
        }
    };
    const handleMBTI: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
        handleStatus({ ...status, mbti: e.target.value });
        setSomethingModified(true);
    };
    const handleNickname = (e: React.BaseSyntheticEvent) : void => {
        //TODO: check nickname whether it is duplicated
        handleStatus({ ...status, nickname: e.target.value });
        setSomethingModified(true);
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

    return (
        <Form onSubmit={statusSubmit}>
            <Row className='mb-3'>
                <Form.Group as={Col}>
                    <Form.Label>별명</Form.Label>
                    <Form.Control name="nickname" defaultValue={status.nickname} placeholder='다른 이용자에게 보여질 이름입니다.' onChange={handleNickname} maxLength={10}/>
                    {<span className='errormessage'> {nicknameErrorMessage}</span>}
                </Form.Group>
            </Row>

            <Row className='mb-3'>
                <Form.Group as={Col}>
                    <Form.Label>이름</Form.Label>
                    <Form.Control name="name" defaultValue={status.name} type="text" placeholder='본인의 실명입니다.' onChange={handleName} maxLength={30}/>
                    {<span className='errormessage'> {nameErrorMessage}</span>}
                </Form.Group>
            </Row>

            <Row className='mb-3'>
                <Form.Group as={Col}>
                    <Form.Label>생년월일</Form.Label>
                    <Form.Control name="birth" defaultValue={status.birth} type="text" placeholder='YYMMDD 형태로 입력해주세요. 예) 970816' onChange={handleBirth} maxLength={3}/>
                    {<span className='errormessage'> {birthErrorMessage}</span>}
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>성별</Form.Label>
                    <Form.Select name="gender" key={uuid()} defaultValue={status.gender} onChange={(e) => handleGender(e)}>
                        <option value = '' disabled>선택 안함</option>
                        <option value = 'M'>남자</option>
                        <option value = 'F'>여자</option>
                    </Form.Select>
                </Form.Group>
            </Row>

            <Row className='mb-3'>
                <Form.Group>
                    <Form.Label>한 줄 소개(100자 이내)</Form.Label>
                    <Form.Control name="intro" defaultValue={status.intro} type="text" placeholder='소개말' onChange={handleIntro} maxLength={100}/>
                    {<span className='errormessage'> {introErrorMessage}</span>}
                </Form.Group>
            </Row>

            <Form.Group>
                <Form.Label>MBTI</Form.Label>
                <Form.Select name='mbti' key={uuid()} defaultValue={status.mbti} onChange={(e) => handleMBTI(e)}>
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
            <Button type="submit" variant='secondary' className='submitbutton'
             disabled={!(somethingModified && nicknameIsValid && nameIsValid && birthIsValid && introIsValid)}>
                <span className='buttonText'>변경사항 저장하기</span>
            </Button>
        </Form>
    );
}
export default MyStatus;
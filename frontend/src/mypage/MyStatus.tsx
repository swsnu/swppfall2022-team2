import React, {useState, useEffect} from 'react';
import {Form, Row, Col, FormControlProps, FormControl} from 'react-bootstrap';
import {statusType} from './MyPage'

interface propsType {
    status: statusType;
    handleStatus: (a: statusType) => void;
  }
const MyStatus: React.FC<propsType> = (props:propsType) => {
    const {status, handleStatus } = props;
    const handleName = (e: React.BaseSyntheticEvent) : void => {
        handleStatus({ ...status, name: e.target.value });
    };
    const handleAge = (e: React.BaseSyntheticEvent) : void => {
        handleStatus({ ...status, age: e.target.value });
    };
    const handleGender: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
        handleStatus({ ...status, gender: e.target.value });
    };
    const handleIntro = (e: React.BaseSyntheticEvent) : void => {
        handleStatus({ ...status, intro: e.target.value });
    };
    const handleMBTI: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
        handleStatus({ ...status, mbti: e.target.value });
    };
    const handleNickname = (e: React.BaseSyntheticEvent) : void => {
        handleStatus({ ...status, nickname: e.target.value });
    };
    //useEffect(()=>{},[status]);
    return (
        <div>
        <Form>
            <p>
                별명을 입력해주세요
            </p>
            <Row className='mb-3'>
                <Form.Group as={Col}>
                    <Form.Control name="nickname" defaultValue={status.nickname} type="text" placeholder='별명' onChange={handleNickname} maxLength={30}/>
                </Form.Group>
            </Row>

            <p>
                이름을 입력해주세요
            </p>
            <Row className='mb-3'>
                <Form.Group as={Col}>
                    <Form.Control name="name" defaultValue={status.name} type="text" placeholder='이름' onChange={handleName} maxLength={30}/>
                </Form.Group>
            </Row>

            <p>
                나이, 성별을 입력해주세요
            </p>
            <Row className='mb-3'>
                <Form.Group as={Col}>
                    <Form.Control name="age" defaultValue={status.age} type="text" placeholder='나이' onChange={handleAge} maxLength={3}/>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Select name="gender" defaultValue={status.gender} onChange={(e) => handleGender(e)}>
                        <option value = ''>선택 안함</option>
                        <option value = 'M'>남자</option>
                        <option value = 'F'>여자</option>
                    </Form.Select>
                </Form.Group>
            </Row>

            <p>
                한 줄 소개를 적어주세요(100자 이내)
            </p>
            <Row className='mb-3'>
                <Form.Group>
                    <Form.Control name="intro" defaultValue={status.intro} type="text" placeholder='소개말' onChange={handleIntro} maxLength={100}/>
                </Form.Group>
            </Row>

            <p>
                자신의 MBTI를 선택해주세요
            </p>
            <Form.Select name='mbti' defaultValue={status.mbti} onChange={(e) => handleMBTI(e)}>
                <option value = ''>선택 안함</option>
                <option value = 'ENTJ'>ENTJ</option>
                <option value = 'ENTP'>ENTP</option>
                <option value = 'ENFJ'>ENFJ</option>
                <option value = 'ENFP'>ENFP</option>
                <option value = 'ESTJ'>ESTJ</option>
                <option value = 'ESFJ'>ESFJ</option>
                <option value = 'ESTP'>ESTP</option>
                <option value = 'ESFP'>ESFP</option>
                <option value = 'INTJ'>INTJ</option>
                <option value = 'INTP'>INTP</option>
                <option value = 'INFJ'>INFJ</option>
                <option value = 'INFP'>INFP</option>
                <option value = 'ISTJ'>ISTJ</option>
                <option value = 'ISFJ'>ISFJ</option>
                <option value = 'ISTP'>ISTP</option>
                <option value = 'ISFP'>ISFP</option>
            </Form.Select>
        </Form>
        </div>
    );
}
export default MyStatus;
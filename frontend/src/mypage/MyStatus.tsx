import React, {useState, useEffect} from 'react';
import {Form, Row, Col, FormControlProps, FormControl} from 'react-bootstrap';
import {statusType} from './MyPage'
import uuid from "react-uuid"

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
    return (
        <div>
        <Form>
            <Row className='mb-3'>
                <Form.Group as={Col}>
                    <Form.Label>별명</Form.Label>
                    <Form.Control name="nickname" defaultValue={status.nickname} type="text" placeholder='10자 이내' onChange={handleNickname} maxLength={10}/>
                </Form.Group>
            </Row>

            <Row className='mb-3'>
                <Form.Group as={Col}>
                    <Form.Label>이름</Form.Label>
                    <Form.Control name="name" defaultValue={status.name} type="text" placeholder='' onChange={handleName} maxLength={30}/>
                </Form.Group>
            </Row>

            <Row className='mb-3'>
                <Form.Group as={Col}>
                    <Form.Label>나이</Form.Label>
                    <Form.Control name="age" defaultValue={status.age} type="text" placeholder='' onChange={handleAge} maxLength={3}/>
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
        </Form>
        </div>
    );
}
export default MyStatus;
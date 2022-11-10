import React, {useState, useEffect} from 'react';
import {Form, Row, Col, FormControlProps, FormControl} from 'react-bootstrap';
import {statusType} from './MyPage'

interface propsType {
    status: statusType;
    handleStatus: (a: statusType) => void;
  }
const MyStatus: React.FC<propsType> = (props:propsType) => {
    const {status, handleStatus } = props;
    const handleLastName = (e: React.BaseSyntheticEvent) : void => {
        handleStatus({ ...status, last_name: e.currentTarget.value as string});
    };
    const handleFirstName = (e: React.BaseSyntheticEvent) : void => {
        handleStatus({ ...status, first_name: e.target.value });
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

    return (
        <div>
        <Form>
            <p>
                이름을 입력해주세요
            </p>
            <Row className='mb-3'>
                <Form.Group as={Col}>
                    <Form.Control type="text" placeholder='성' onChange={handleLastName} maxLength={30} />
                </Form.Group>

                <Form.Group as={Col}>
                    <Form.Control type="text" placeholder='이름' onChange={handleFirstName} maxLength={30}/>
                </Form.Group>
            </Row>

            <p>
                나이, 성별을 입력해주세요
            </p>
            <Row className='mb-3'>
                <Form.Group as={Col}>
                    <Form.Control type="text" placeholder='나이' onChange={handleAge} maxLength={3}/>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Select onChange={(e) => handleGender(e)}>
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
                    <Form.Control type="text" placeholder='소개말' onChange={handleIntro} maxLength={100}/>
                </Form.Group>
            </Row>

            <p>
                자신의 MBTI를 선택해주세요
            </p>
            <Form.Select onChange={(e) => handleMBTI(e)}>
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
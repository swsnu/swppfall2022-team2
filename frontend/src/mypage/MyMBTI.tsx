import React from 'react';
import {Form } from 'react-bootstrap';

const MyMBTI: React.FC = () => {
    return (
        <div>
            <p>
                자신의 MBTI를 선택해주세요
            </p>
            <Form.Select>
                <option value = {1}>ENTJ</option>
                <option value = {2}>ENTP</option>
                <option value = {3}>ENFJ</option>
                <option value = {4}>ENFP</option>
                <option value = {5}>ESTJ</option>
                <option value = {6}>ESFJ</option>
                <option value = {7}>ESTP</option>
                <option value = {8}>ESFP</option>
                <option value = {9}>INTJ</option>
                <option value = {9}>INTP</option>
                <option value = {9}>INFJ</option>
                <option value = {9}>INFP</option>
                <option value = {9}>ISTJ</option>
                <option value = {9}>ISFJ</option>
                <option value = {9}>ISTP</option>
                <option value = {9}>ISFP</option>
            </Form.Select>

        </div>
    );
}
export default MyMBTI;
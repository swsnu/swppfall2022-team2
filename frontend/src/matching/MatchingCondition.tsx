import React from 'react';
import { Button, Form } from 'react-bootstrap';
import './MatchingCondition.css';
import { conditionType } from './Matching';
import Multiselect from 'multiselect-react-dropdown';
import { selectUser, MenuType } from '../store/slices/user';
import { useSelector } from 'react-redux';
interface propsType {
  matchingCondition: conditionType;
  handleMatchingCondition: (a: conditionType) => void;
}
interface selectType {
  name: string;
  id: number;
}
const MatchingCondition: React.FC<propsType> = (props: propsType) => {
  const { matchingCondition, handleMatchingCondition } = props;
  const mbti = [
    { name: 'ENTJ', id: 1 },
    { name: 'ENTP', id: 2 },
    { name: 'ENFJ', id: 3 },
    { name: 'ENFP', id: 4 },
    { name: 'ESTJ', id: 5 },
    { name: 'ESFJ', id: 6 },
    { name: 'ESTP', id: 7 },
    { name: 'ESFP', id: 8 },
    { name: 'INTJ', id: 9 },
    { name: 'INTP', id: 10 },
    { name: 'INFJ', id: 11 },
    { name: 'INFP', id: 12 },
    { name: 'ISTJ', id: 13 },
    { name: 'ISFJ', id: 14 },
    { name: 'ISTP', id: 15 },
    { name: 'ISFP', id: 16 },
  ];
  const age = [
    { name: '20', id: 1 },
    { name: '21', id: 2 },
    { name: '22', id: 3 },
    { name: '23', id: 4 },
    { name: '24', id: 5 },
    { name: '25', id: 6 },
    { name: '26', id: 7 },
    { name: '27', id: 8 },
    { name: '28', id: 9 },
    { name: '29', id: 10 },
  ];
  const handleTime: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
    handleMatchingCondition({ ...matchingCondition, time: e.target.value });
  };
  const handleSpace: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
    handleMatchingCondition({ ...matchingCondition, space: e.target.value });
  };
  const handleMBTI: (e: selectType[]) => void = (e) => {
    handleMatchingCondition({
      ...matchingCondition,
      mbti: e.map((mbti) => mbti.name),
    });
  };
  const handleGender: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
    handleMatchingCondition({ ...matchingCondition, gender: e.target.value });
  };
  const handleAge: (e: selectType[]) => void = (e) => {
    let min = 0;
    let max = 100;
    e.forEach((select) => {
      if (min === 0 || min > Number(select.name)) {
        min = Number(select.name);
      }
      if (max === 100 || max < Number(select.name)) {
        max = Number(select.name);
      }
    });
    handleMatchingCondition({
      ...matchingCondition,
      age: {
        from: String(min),
        to: String(max),
      },
    });
  };
  const userState = useSelector(selectUser);
  const menulist: MenuType[] = userState.menulist;
  const set = new Set(menulist.map((menu) => menu.menuplace));
  const spaces = Array.from(set);
  return (
    <div>
      <div className='conditions'>
        <p className='conditionP'>시간</p>
        <label className='selectLabel'>
          <Form.Select id='timeSelect' className='select' onChange={(e) => handleTime(e)}>
            <option value='0'>선택</option>
            <option value='1130'>11:30</option>
            <option value='1200'>12:00</option>
            <option value='1230'>12:30</option>
            <option value='1300'>13:00</option>
            <option value='1800'>18:00</option>
            <option value='1830'>18:30</option>
            <option value='1900'>19:00</option>
          </Form.Select>
        </label>
      </div>
      <div className='conditions'>
        <p className='conditionP'>장소</p>
        <label className='selectLabel'>
          <Form.Select id='spaceSelect' className='select' onChange={(e) => handleSpace(e)}>
            <option value=''>선택</option>
            {spaces.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Form.Select>
        </label>
      </div>
      <div className='conditionsMBTI'>
        <p className='conditionP'>선호하는 MBTI</p>
        <Multiselect
          options={mbti}
          onSelect={(e) => handleMBTI(e)}
          onRemove={(e) => handleMBTI(e)}
          displayValue='name'
        />
      </div>
      <div className='conditions'>
        <p className='conditionP'>선호하는 성별</p>
        <Form.Select id='genderSelect' className='select' onChange={(e) => handleGender(e)}>
          <option value=''>상관없음</option>
          <option value='M'>남자</option>
          <option value='F'>여자</option>
        </Form.Select>
      </div>
      <div className='conditionsAge'>
        <p className='conditionP'>선호하는 연령대</p>
        <Multiselect
          options={age}
          onSelect={(e) => handleAge(e)}
          onRemove={(e) => handleAge(e)}
          displayValue='name'
        />
      </div>
      <div className='conditionP'>*조건을 선택하지 않으면 해당 조건은 고려하지 않습니다</div>
      <div className='conditionP'>
        *매칭이 잡히지 않으면 조건에 맞지 않는 상대와 매칭될 수 있습니다
      </div>
    </div>
  );
};
export default MatchingCondition;

import React from 'react';
import { Button, Form } from 'react-bootstrap';
import './MatchingCondition.css';
interface conditionType {
  time: string;
  menu: string;
  num: string;
}
interface propsType {
  matchingCondition: conditionType;
  handleMatchingCondition: (a: conditionType) => void;
}
const GroupMatchingCondition: React.FunctionComponent<propsType> = (props) => {
  const { matchingCondition, handleMatchingCondition } = props;
  const handleTime: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
    handleMatchingCondition({ ...matchingCondition, time: e.target.value });
  };
  const handleMenu: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
    handleMatchingCondition({ ...matchingCondition, menu: e.target.value });
  };
  const handleNum: (e: React.ChangeEvent<HTMLSelectElement>) => void = (e) => {
    handleMatchingCondition({ ...matchingCondition, num: e.target.value });
  };
  const menus = ['메뉴1', '메뉴2', '메뉴3']; // this should be changed to get from redux store
  return (
    <div>
      <div className='conditions'>
        <p className='conditionP'>시간</p>
        <label className='selectLabel'>
          <Form.Select id='timeSelect' className='select' onChange={(e) => handleTime(e)}>
            <option value='0'>직접선택</option>
            <option value='1200'>12:00</option>
            <option value='1230'>12:30</option>
            <option value='1300'>13:00</option>
            <option value='1800'>18:00</option>
            <option value='1830'>18:30</option>
            <option value='1900'>19:00</option>
          </Form.Select>
        </label>
        <Button variant='outline-secondary'>시간표에서 선택하기</Button>
      </div>
      <div className='conditions'>
        <p className='conditionP'>메뉴</p>
        <label className='selectLabel'>
          <Form.Select id='menuSelect' className='select' onChange={(e) => handleMenu(e)}>
            <option value=''>선택</option>
            {menus.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Form.Select>
        </label>
      </div>
      <div className='conditions'>
        <p className='conditionP'>인원</p>
        <label className='selectLabel'>
          <Form.Select id='numSelect' className='select' onChange={(e) => handleNum(e)}>
            <option value=''>선택</option>
            <option value='34'>3~4</option>
            <option value='56'>5~6</option>
            <option value='78'>7~8</option>
          </Form.Select>
        </label>
      </div>
      <p className='conditionP'>*그룹 매칭은 조건을 반드시 선택해야 합니다</p>
    </div>
  );
};
export default GroupMatchingCondition;

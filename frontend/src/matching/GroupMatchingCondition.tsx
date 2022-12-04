import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import './MatchingCondition.css';
import { selectUser, MenuType } from '../store/slices/user';
import { useSelector } from 'react-redux';
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
  const userState = useSelector(selectUser);
  const menulist: MenuType[] = userState.menulist;
  const set = new Set(menulist.map((menu) => menu.menuplace));
  const spaces = [...set];
  const [space, handleSpace] = useState<string>(''); // user selected condition
  const menus: string[] = menulist
    .filter(
      (menu) =>
        menu.menuplace === space &&
        (matchingCondition.time === '1130' ||
        matchingCondition.time === '1200' ||
        matchingCondition.time === '1230' ||
        matchingCondition.time === '1300'
          ? menu.mealtype === 'lunch'
          : menu.mealtype === 'dinner'),
    )
    .map((menu) => menu.menuname);
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
          <Form.Select
            id='spaceSelect'
            className='select'
            onChange={(e) => handleSpace(e.target.value)}
          >
            <option value=''>선택</option>
            {spaces.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Form.Select>
        </label>
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
      <p className='conditionP'>*시간과 장소를 선택하면 해당되는 메뉴가 나타납니다</p>
    </div>
  );
};
export default GroupMatchingCondition;

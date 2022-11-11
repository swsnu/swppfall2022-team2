import { fireEvent, render, screen } from '@testing-library/react';
import MatchingCondition from './MatchingCondition';
import React from 'react';
import { conditionType } from './Matching';
interface propsType {
  matchingCondition: conditionType;
  handleMatchingCondition: (a: conditionType) => void;
}
const handleMatchingConditionMock = jest.fn();
const props: propsType = {
  matchingCondition: { time: '0', space: '', mbti: [], gender: '', age: { from: '50', to: '0' } },
  handleMatchingCondition: handleMatchingConditionMock,
};
const props2: propsType = {
  matchingCondition: { time: '0', space: '', mbti: [], gender: '', age: { from: '0', to: '100' } },
  handleMatchingCondition: handleMatchingConditionMock,
};
describe('MatchingCondition', () => {
  let condition: JSX.Element;
  beforeEach(() => {
    jest.clearAllMocks();
    condition = <MatchingCondition {...props} />;
  });
  it('timecondition', () => {
    const conditionRender = render(condition);
    const timeSelect = conditionRender.container.querySelector('#timeSelect');
    fireEvent.change(timeSelect!, { target: { value: '1200' } });
    expect(handleMatchingConditionMock).toHaveBeenCalled();
  });
  it('spacecondition', () => {
    const conditionRender = render(condition);
    const spaceSelect = conditionRender.container.querySelector('#spaceSelect');
    fireEvent.change(spaceSelect!, { target: { value: 'dormitory' } });
    expect(handleMatchingConditionMock).toHaveBeenCalled();
  });
  it('mbticondition', () => {
    render(condition);
    const mbtiSelect = screen.getByText('ESTJ');
    fireEvent.click(mbtiSelect!);
    const cancle = screen.getByRole('img');
    fireEvent.click(cancle!);

    expect(handleMatchingConditionMock).toHaveBeenCalled();
  });
  it('gendercondition', () => {
    const conditionRender = render(condition);
    const genderSelect = conditionRender.container.querySelector('#genderSelect');
    fireEvent.change(genderSelect!, { target: { value: 'M' } });
    expect(handleMatchingConditionMock).toHaveBeenCalled();
  });
  it('agecondition', () => {
    render(condition);
    const ageSelect = screen.getByText('20');
    fireEvent.click(ageSelect!);
    const cancle = screen.getByRole('img');
    fireEvent.click(cancle!);
    expect(handleMatchingConditionMock).toHaveBeenCalled();
  });
  it('handleAge', () => {
    condition = <MatchingCondition {...props2} />;
    render(condition);
    const ageSelect2 = screen.getByText('21');
    const ageSelect3 = screen.getByText('22');
    const ageSelect = screen.getByText('20');
    fireEvent.click(ageSelect2!);
    fireEvent.click(ageSelect3!);
    fireEvent.click(ageSelect!);
    expect(handleMatchingConditionMock).toHaveBeenCalled();
  });
});

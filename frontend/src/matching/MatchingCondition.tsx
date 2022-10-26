import { Button, Form } from "react-bootstrap";
import "./MatchingCondition.css";
import { conditionType } from "./Matching";
type propsType = {
  matchingCondition: conditionType;
  handleMatchingCondition: (a: conditionType) => void;
};
const MatchingCondition = (props: propsType) => {
  const { matchingCondition, handleMatchingCondition } = props;
  const handleTime = () => {
    //TODO
  };
  const handleSpace = () => {
    //TODO
  };
  const handleMBTI = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleMatchingCondition({ ...matchingCondition, mbti: e.target.value });
    console.log(matchingCondition);
  };
  const handleGender = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleMatchingCondition({ ...matchingCondition, gender: e.target.value });
    console.log(matchingCondition);
  };
  const handleAgeFrom = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleMatchingCondition({
      ...matchingCondition,
      age: {
        from: e.target.value,
        to: matchingCondition.age ? matchingCondition.age.to : null,
      },
    });
  };
  const handleAgeTo = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleMatchingCondition({
      ...matchingCondition,
      age: {
        from: matchingCondition.age ? matchingCondition.age.from : null,
        to: e.target.value,
      },
    });
  };
  return (
    <div>
      <p>matchingcondition</p>
      <div className="conditions">
        <p>시간</p>
        <Button variant="outline-secondary">직접 선택하기</Button>
        <Button variant="outline-secondary">시간표에서 선택하기</Button>
      </div>
      <div className="conditions">
        <p>장소</p>
        <Button variant="outline-secondary">직접 선택하기</Button>
        <Button variant="outline-secondary">시간표에서 선택하기</Button>
      </div>
      <div className="conditions">
        <p>선호하는 MBTI-여러개선택가능하게 바꿔야함</p>
        <Form.Select className="select" onChange={(e) => handleMBTI(e)}>
          <option value="">상관없음</option>
          <option value="ISTJ">ISTJ</option>
          <option value="ISTP">ISTP</option>
        </Form.Select>
      </div>
      <div className="conditions">
        <p>선호하는 성별</p>
        <Form.Select className="select" onChange={(e) => handleGender(e)}>
          <option value="">상관없음</option>
          <option value="M">남자</option>
          <option value="F">여자</option>
        </Form.Select>
      </div>
      <div className="conditions">
        <p>선호하는 연령대</p>
        <label className="selectLabel">
          <Form.Select className="select" onChange={(e) => handleAgeFrom(e)}>
            <option value="">상관없음</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
          </Form.Select>
        </label>
        ~
        <label className="selectLabel">
          <Form.Select className="select" onChange={(e) => handleAgeTo(e)}>
            <option value="">상관없음</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
          </Form.Select>
        </label>
      </div>
      <p>
        주의사항같은것 ex:매칭 상황에따라 선택한 조건에 맞지 않는 사람과
        매칭될수있다 등등
      </p>
    </div>
  );
};
export default MatchingCondition;

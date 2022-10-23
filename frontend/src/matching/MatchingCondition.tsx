import { Button, Form } from "react-bootstrap";
import "./MatchingCondition.css";
const MatchingCondition = () => {
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
        <Form.Select className="select">
          <option value="no">상관없음</option>
          <option value="ISTJ">ISTJ</option>
          <option value="ISTP">ISTP</option>
        </Form.Select>
      </div>
      <div className="conditions">
        <p>선호하는 성별</p>
        <Form.Select className="select">
          <option>상관없음</option>
          <option>남자</option>
          <option>여자</option>
        </Form.Select>
      </div>
      <div className="conditions">
        <p>선호하는 연령대</p>
        <label className="selectLabel">
          <Form.Select className="select">
            <option>상관없음</option>
            <option>20</option>
            <option>21</option>
            <option>22</option>
            <option>23</option>
          </Form.Select>
        </label>
        ~
        <label className="selectLabel">
          <Form.Select className="select">
            <option>상관없음</option>
            <option>20</option>
            <option>21</option>
            <option>22</option>
            <option>23</option>
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

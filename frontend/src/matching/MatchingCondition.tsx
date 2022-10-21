import "./MatchingCondition.css";

const MatchingCondition = () => {
  return (
    <div>
      <p>matchingcondition</p>
      <div className="conditions">
        <p>시간</p>
        <button>직접 선택하기</button>
        <button>시간표에서 선택하기</button>
      </div>
      <div className="conditions">
        <p>장소</p>
        <button>직접 선택하기</button>
        <button>시간표에서 선택하기</button>
      </div>
      <div className="conditions">
        <p>선호하는 MBTI-여러개선택가능하게 바꿔야함</p>
        <select>
          <option>상관없음</option>
          <option>istj</option>
          <option>istp</option>
        </select>
      </div>
      <div className="conditions">
        <p>선호하는 성별</p>
        <select>
          <option>상관없음</option>
          <option>남자</option>
          <option>여자</option>
        </select>
      </div>
      <div className="conditions">
        <p>선호하는 연령대</p>
        <select>
          <option>상관없음</option>
          <option>20</option>
          <option>21</option>
          <option>22</option>
          <option>23</option>
        </select>
        ~
        <select>
          <option>상관없음</option>
          <option>20</option>
          <option>21</option>
          <option>22</option>
          <option>23</option>
        </select>
      </div>
      <p>
        주의사항같은것 ex:매칭 상황에따라 선택한 조건에 맞지 않는 사람과
        매칭될수있다 등등
      </p>
    </div>
  );
};
export default MatchingCondition;

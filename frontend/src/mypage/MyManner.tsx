import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './MyPage.css';

const MyManner: React.FC = () => {
    function TempBar(){
        const now = 36.5
        return <ProgressBar now = {now}  className='tempbar'/>;
    }
    return (
        <div>
            <div className = 'barcontainer'>
                <TempBar/>
            </div>
            <p>
                당신의 매너 온도는 36.5입니다.
            </p>
        </div>
    );
}
export default MyManner;
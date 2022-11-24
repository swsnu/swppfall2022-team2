import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './MyPage.css';

type Temp = {
    temperature: number
}

const MyManner: React.FC<Temp> = ({temperature}) => {
    function TempBar(){
        return <ProgressBar variant='danger' animated now = {temperature}  className='tempbar'/>;
    }
    return (
        <div>
            <div className = 'barcontainer'>
                <TempBar/>
            </div>
            <p>
                당신의 매너 온도는 {temperature}입니다.
            </p>
        </div>
    );
}
export default MyManner;
import React, {useState} from "react";
import './MyPage.css';
import MyManner from './MyManner';
import MyMBTI from "./MyMBTI";
import MyTimeTable from "./MyTimeTable";
import axios from 'axios';

export interface timeTableDataType {
    mon: boolean[];
    tue: boolean[];
    wed: boolean[];
    thu: boolean[];
    fri: boolean[];
  }

const MyPage: React.FunctionComponent = () => {
    const [timeTable, handleTimeTable] = useState<timeTableDataType>({
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
      });
    return (
        <div>
            <div className = 'manner'>
                <MyManner/>
            </div>
            <div className = 'others'>
                <div>
                    <MyTimeTable
                        timeTable={timeTable} handleTimeTable={handleTimeTable}
                    />
                </div>
                <div>
                    <MyMBTI/>
                </div>
            </div>
        </div>
    );
}

export default MyPage;
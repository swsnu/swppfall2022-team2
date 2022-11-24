import React, {useState, useEffect} from 'react';
import './MyPage.css';
import styled from "styled-components";
import {statusType} from './MyPage'

interface propsType {
    status: statusType;
    handleStatus: (a: statusType) => void;
  }
const MyTimeTable: React.FC<propsType> = (props:propsType) => {
    function CustomCheckbox(){
        const handleTimeTable: (e:React.ChangeEvent<HTMLSelectElement>) => void = (e) =>{

        }
        return(
            <input type = {"checkbox"}/>
        );
    }
    
    return(
        <div>
            
        </div>
    );
    return (
        <div>
            <table align={"center"} width={"100%"} className="table table-bordered">
                <tr>
                    <th></th>
                    <th>월</th>
                    <th>화</th>
                    <th>수</th>
                    <th>목</th>
                    <th>금</th>
                </tr>
                <tr>
                    <th rowSpan={2}>9</th>
                    <td><CustomCheckbox/></td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                </tr>

                <tr>
                    <th rowSpan={2}>10</th>
                    <td><CustomCheckbox/></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><CustomCheckbox/></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>

        </div>
    );
}
export default MyTimeTable;
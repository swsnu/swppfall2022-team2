import React, {useState, useEffect} from 'react';
import { Button } from 'react-bootstrap';
import {statusType} from './MyPage'
import './MyPage.css';

interface propsType {
    status: statusType;
    blockSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, nickname:string) => any;
    unblockSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, nickname:string) => any;
  }
const BlockUser: React.FC<propsType> = (props:propsType) => {
    const {status, blockSubmit, unblockSubmit} = props;

    return (
    <div>
        <div className='halfdiv'>
            {status.matched_users.map((matched_user)=>(
                <div className='card pad userlist'>
                    <span className = 'usertext'>
                        {matched_user}
                        <Button className='blockbutton' variant='danger' onClick={(e)=>{blockSubmit(e, matched_user)}}>차단</Button>
                    </span>
                </div>
            ))}
        </div>
        <div className='halfdiv'>
            {status.blocked_users.map((blocked_user)=>(
                <div className='card pad userlist'>
                    <span className = 'usertext'>
                        {blocked_user}
                        <Button className='blockbutton' variant='success' onClick={(e)=>{unblockSubmit(e, blocked_user)}}>차단 해제</Button>
                    </span>
                </div>
            ))}
        </div>
    </div>
    );
}
export default BlockUser;
import React, {useState, useEffect, useCallback} from 'react';
import { Button } from 'react-bootstrap';
import {statusType} from './MyPage'
import axios from 'axios';
import './MyPage.css';

interface propsType {
    status: statusType;
    handleStatus: (a: statusType) => void;
  }
const BlockUser: React.FC<propsType> = (props:propsType) => {
    const {status, handleStatus} = props;
    // block someone
  const blockSubmit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, nickname: string) => {
      let i = 0;
      for (; ; i++) if (status.matched_users[i] === nickname) break;
      for (; i < status.matched_users.length - 1; i++)
        status.matched_users[i] = status.matched_users[i + 1];
      status.matched_users.pop();
      status.blocked_users.push(nickname);
      handleStatus({ ...status });
        await axios
          .post(`mypage/block/`, {
            nickname: nickname,
          })
          .catch((err) => {
          });
    },
    [status],
  );

  // unblock someone
  const unblockSubmit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, nickname: string) => {
      let i = 0;
      for (; ; i++) if (status.blocked_users[i] === nickname) break;
      for (; i < status.blocked_users.length - 1; i++)
        status.blocked_users[i] = status.blocked_users[i + 1];
      status.blocked_users.pop();
      status.matched_users.push(nickname);
      handleStatus({ ...status });
        await axios
          .post(`mypage/unblock/`, {
            nickname: nickname,
          })
          .catch((err) => {
          });
    },
    [status],
  );

    return (
    <div>
        <div className='halfdiv userlist'>
            {status.matched_users.map((matched_user)=>(
                <div className='card pad userlist' key={matched_user}>
                    <span className = 'usertext'>
                        {matched_user}
                        <Button className='blockbutton' variant='danger' onClick={(e)=>{blockSubmit(e, matched_user)}}
                        id={matched_user}>차단</Button>
                    </span>
                </div>
            ))}
        </div>
        <div className='halfdiv userlist'>
            {status.blocked_users.map((blocked_user)=>(
                <div className='card pad userlist' key={blocked_user}>
                    <span className = 'usertext'>
                        {blocked_user}
                        <Button className='blockbutton' variant='success' onClick={(e)=>{unblockSubmit(e, blocked_user)}}
                        id ={blocked_user}>차단 해제</Button>
                    </span>
                </div>
            ))}
        </div>
    </div>
    );
}
export default BlockUser;
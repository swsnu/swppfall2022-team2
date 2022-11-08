import React from 'react';
import { selectUser, ChatRoomType, userActions } from '../store/slices/user';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from '../store';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

const ChatList: React.FunctionComponent = () => {
    const userState = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const clickChatListTitleHandler= (chatroom: ChatRoomType)=>{
        dispatch(userActions.selectChatRoom(chatroom))
        navigate(`/chatroom/${chatroom.id}`);   
    }

    return(
        <div className="card chat-list overflow-auto">
          <h5 className="card-title">Chating Rooms</h5>
            <div className="list-group">
              {userState.loggedinuser?.chatrooms.map((chatroom)=>(
                <a className="list-group-item list-group-item-action" key={chatroom.id} onClick={()=>clickChatListTitleHandler(chatroom)}>
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{(userState.userlist.find(element => element.id===chatroom.opponent_id))?.username ?? ''}</h5>
                    <small>{chatroom.last_chat?.date}</small>
                  </div>
                  <p className="mb-1">{chatroom.last_chat?.content}</p>
                  <Button className="btn-primary">매너온도 주기</Button>
                </a>
              ))}
            </div>
        </div>
    )
}
    


export default ChatList;


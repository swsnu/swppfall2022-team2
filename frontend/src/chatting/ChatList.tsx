import React from 'react';
import { selectUser, ChatRoomType, userActions } from '../store/slices/user';
import { useDispatch, useSelector } from "react-redux";
import ChatListTitle from './ChatListTitle'
import { AppDispatch } from '../store';
import { useNavigate } from "react-router-dom";


const ChatList: React.FunctionComponent = () => {
    const userState = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const clickChatListTitleHandler = (chatroom: ChatRoomType)=>{
        dispatch(userActions.seleteChatRoom(chatroom))
        navigate("/chatroom/"+chatroom.id);   
    }

    return(
        <div className="ChatList">
            <p>This is List of Chats</p>
            {userState.loggedinuser?.chatrooms.map((chatroom)=>{
                return (
                        <div className="chatroom-titles">
                            <ChatListTitle 
                                key={chatroom.id} 
                                opponent={(userState.userlist.find(element => element.id===chatroom.opponentid))?.username!}
                                onClick={()=>clickChatListTitleHandler(chatroom)}
                            />
                        </div>
                        );
            })}
        </div>
    )
}
    


export default ChatList;
import React from 'react';
import { selectUser, ChatRoomType, userActions, UserType, createChatRoom } from '../store/slices/user';
import { useDispatch, useSelector } from "react-redux";
import ChatListTitle from './ChatListTitle'
import { AppDispatch } from '../store';
import { useNavigate } from "react-router-dom";


const ChatList: React.FunctionComponent = () => {
    const userState = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const clickChatListTitleHandler = (chatroom: ChatRoomType)=>{
        dispatch(userActions.selectChatRoom(chatroom))
        navigate("/chatroom/"+chatroom.id);   
    }

    const clickUserHandler = (user: UserType)=>{
        dispatch(createChatRoom(user.id))   
    }

    return(
        <div className="ChatList">
            <p>This is List of Chats</p>
            {userState.loggedinuser?.chatrooms.map((chatroom)=>{
                return (
                        <div className="chatroom-titles">
                            <ChatListTitle 
                                key={chatroom.id} 
                                opponent={(userState.userlist.find(element => element.id===chatroom.opponent_id))?.username!}
                                lastChat={chatroom.last_chat}
                                onClick={()=>clickChatListTitleHandler(chatroom)}
                            />
                        </div>
                        );
            })}
            {userState.userlist.map((user)=>{

                return (userState.loggedinuser?.user.id!=user.id)?(
                    <div className = "userlist">
                        <button onClick={()=>clickUserHandler(user)}>{user.id}</button>
                    </div>
                ) : (
                    <div className = "userlist">
                        <p>{user.id}</p>
                    </div>
                )
            }
            )}
        </div>
    )
}
    


export default ChatList;
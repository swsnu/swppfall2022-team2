import React from 'react';
import { ChatType } from '../store/slices/user';

export interface IProps {
    opponent: string;
    lastChat: ChatType
    onClick?: ()=> void;
}


export default function ChatListTitle(props: IProps){
    return(
        <div className="ChatListTitle">
            <button onClick={props.onClick}>Opponent: {props.opponent}</button>
            <p>{props.lastChat.content}     {props.lastChat.date}</p>
        </div>
    )
}

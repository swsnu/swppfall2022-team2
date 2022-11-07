import React from 'react';
import { ChatType } from '../store/slices/user';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export interface IProps {
    opponent: string;
    lastChat: ChatType
    onClick?: ()=> void;
}


export default function ChatListTitle(props: IProps){
    return(
        <div className="ChatListTitle">
            <Button className="mb-3" variant='primary' onClick={props.onClick}>
                Opponent: {props.opponent}  {props.lastChat.content}     {props.lastChat.date}
            </Button>
        </div>
    )
}

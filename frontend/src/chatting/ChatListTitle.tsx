import React from 'react';
export interface IProps {
    opponent: string;
    onClick?: ()=> void;
}


export default function ChatListTitle(props: IProps){
    return(
        <div className="ChatListTitle">
            <button onClick={props.onClick}>Opponent: {props.opponent}</button>
        </div>
    )
}

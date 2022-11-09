import React, { FC, useEffect, useRef } from "react";
import { UserType } from "../../../../store/slices/user";
import { IMessage, IChatUser } from "../Chat";

import "./styles.scss";

interface IMessagesProps {
  messages?: IMessage[];
  user?: UserType;
}

const MessagesList: FC<IMessagesProps> = ({ messages, user }) => (
  <>
    {messages ? (
      <>
        {messages.map((message: IMessage) => {
            return (
              <li className="myMessages" >
              <p className="userMessage">
                {"User"} <span> </span>
              </p>
              <p className="messageText">{message.text}</p>
            </li>
            );
        })}
      </>
    ) : null}
  </>
);

export default MessagesList;

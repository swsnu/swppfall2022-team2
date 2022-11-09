import React, { FC, useState, useEffect, useRef, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import MessagesList from "./MessagesList/MessagesList";
import { SEND_MESSAGE, LOGOUT } from "../../../socketEvents";


import "./styles.scss";
import { Socket } from "socket.io-client";
import { ChatRoomType, userActions, UserType } from "../../../store/slices/user";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";

interface IChatProps {
  socket?: Socket;
  setUser: Function;
  setSocket: Function;
}

interface IRoomData {
  users?: IChatUser[];
  error?: string;
}

export interface IChatUser {
  id: string;
  username?: string;
  room?: string;
  active?: boolean;
}

export interface IMessage {
  
  text: string;
  
}

const Chat: FC<IChatProps> = ({ socket, setSocket, setUser }) => {
  const [chatUsers, setChatUsers] = useState<UserType[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [new_msg, setnewmsg] = useState<IMessage>();
  const [user, setuser] = useState<UserType>();
  const dispatch = useDispatch<AppDispatch>();


  const navigate = useNavigate();
  const chatRef = useRef<HTMLUListElement>(null);

  useEffect(() => console.log(darkMode), [darkMode]);

  useEffect(() => {
      setMessages((messages: IMessage[]) => [...messages]);
  },[]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: SyntheticEvent) => {
    e.preventDefault();

    if (messageToSend){
      messages.push({text : messageToSend})
  }
    setMessageToSend("");
  };

  const handleLogout = () => {
    navigate('/main')
  }

  return (
    <div className={darkMode ? "page dark" : "page"}>
      <button className="logout" onClick={handleLogout}>
        Back
      </button>

        <div className="messagesBoard">
          <form onSubmit={handleSendMessage}>
            <ul ref={chatRef} className="messagesList">
              <MessagesList messages={messages} user={user} />
            </ul>
            <input
              className="input"
              type="text"
              name="room"
              value={messageToSend}
              placeholder="Write something..."
              onChange={(e) => setMessageToSend(e.target.value)}
            />
            <input className="input" type="submit" value="Send" />
            <p className="errorMessage">{errorMessage}</p>
          </form>
        </div>
      </div>
  );
};

export default Chat;

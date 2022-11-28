import React, { useState } from 'react';
import { selectUser, ChatRoomType, setTemperature, userActions } from '../store/slices/user';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from '../store';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import  Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export interface TemperatureFormType {
  user: number;
  eval: string;
}


const ChatList: React.FunctionComponent = () => {
    const userState = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [show, setShow] = useState(false);
    const [chatuser, setChatuser] = useState(0);
    const handleClose = () => setShow(false);
    const handleShow = (chatroom_opponent_id : number) => {
        setShow(true);
        setChatuser((userState.userlist.find(element => element.id===chatroom_opponent_id))?.id ?? 0)
    }

    const handleBest = () => {
      setShow(false);
      dispatch(setTemperature({user: chatuser, eval: "최고" }))
    }

    const handleGood = () => {
      setShow(false);
      dispatch(setTemperature({user: chatuser, eval: "좋음" }))
    }

    const handleMed = () => {
      setShow(false);
      dispatch(setTemperature({user: chatuser, eval: "보통" }))
    }

    const handleBad = () => {
      setShow(false);
      dispatch(setTemperature({user: chatuser, eval: "별로" }))
    }

    const handleWorst = () => {
      setShow(false);
      dispatch(setTemperature({user: chatuser, eval: "최악" }))
    }


    const clickChatListTitleHandler= (chatroom: ChatRoomType)=>{
        // problem if you enable this function, it redirects to the the chatroom page before 
        dispatch(userActions.selectChatRoom(chatroom))
        navigate(`/chatroom/${chatroom.id}`);   
    }

    return(
        <div className="card chat-list overflow-auto">
          <h5 className="card-title">Chating Rooms</h5>
            <div className="list-group">
              {userState.loggedinuser?.chatrooms.map((chatroom)=>(
                <a className="list-group-item list-group-item-action" key={chatroom.id} onClick={(e)=> {e.stopPropagation(); e.preventDefault();clickChatListTitleHandler(chatroom);}}>
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{(userState.userlist.find(element => element.id===chatroom.opponent_id))?.nickname ?? ''}</h5>
                    <small>{moment(chatroom.last_chat?.date).fromNow()}</small>
                  </div>
                  <p className="mb-1">{chatroom.last_chat?.content}</p>
                    <Button className="btn-primary" onClick={(e)=>{e.stopPropagation(); e.preventDefault(); handleShow(chatroom.opponent_id);}}>
                      {(userState.userlist.find(element => element.id===chatroom.opponent_id))?.nickname ?? ''} 
                    </Button>
                  <Modal show={show}>
                    <Modal.Header>
                      <button type="button" className="btn-close" aria-lable="Close" onClick={(e)=>{handleClose();  e.stopPropagation(); e.preventDefault();}}></button>
                      <Modal.Title>매너 평가를 해주세요</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                      <Button variant="success" onClick={(e)=>{handleBest(); e.stopPropagation(); e.preventDefault();}}>
                        최고
                      </Button>
                      <Button variant="primary" onClick={(e)=>{handleGood(); e.stopPropagation(); e.preventDefault();}}>
                        좋음
                      </Button>
                      <Button variant="secondary" onClick={(e)=>{handleMed(); e.stopPropagation(); e.preventDefault();}}>
                        보통
                      </Button>
                      <Button variant="warning" onClick={(e)=>{handleBad(); e.stopPropagation(); e.preventDefault();}}>
                        별로
                      </Button>
                      <Button variant="danger" onClick={(e)=>{handleWorst(); e.stopPropagation(); e.preventDefault();}}>
                        최악
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </a>
              ))}
            </div>
        </div>
    )
}
    


export default ChatList;


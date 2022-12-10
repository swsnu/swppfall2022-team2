import React, { useState, useEffect } from 'react';
import { selectUser, ChatRoomType, userActions, deleteChatRoom } from '../store/slices/user';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from '../store';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import  Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import "./ChatList.css";

export interface TemperatureFormType {
  user: number;
  eval: string;
}


const ChatList: React.FunctionComponent = () => {
    const userState = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [chatlist, setChatlist] = useState({"chatrooms": userState.loggedinuser?.chatrooms})

    const [show, setShow] = useState(false);
    const [chatuser, setChatuser] = useState(0);
    const handleClose = () => setShow(false);
    const handleShow = (chatroom_opponent_id : number) => {
        setShow(true);
        setChatuser((userState.userlist.find(element => element.id===chatroom_opponent_id))?.id ?? 0)
    }

    const handleBest = () => {
      setShow(false);
      axios.post(`/mypage/temp/${chatuser}/`, { eval: "최고" })
        .then((response)=>
          {if(response.status==204){
            window.alert("이미 평가한 유저입니다.")
          }})
        .catch()
    }

    const handleGood = () => {
      setShow(false);
      axios.post(`/mypage/temp/${chatuser}/`, { eval: "좋음" })
        .then((response)=>
          {if(response.status==204){
            window.alert("이미 평가한 유저입니다.")
          }})
        .catch()
    }

    const handleMed = () => {
      setShow(false);
      axios.post(`/mypage/temp/${chatuser}/`, { eval: "보통" })
        .then((response)=>
          {if(response.status==204){
            window.alert("이미 평가한 유저입니다.")
          }})
        .catch()
    }

    const handleBad = () => {
      setShow(false);
      axios.post(`/mypage/temp/${chatuser}/`, { eval: "별로" })
        .then((response)=>
          {if(response.status==204){
            window.alert("이미 평가한 유저입니다.")
          }})
        .catch()
    }

    const handleWorst = () => {
      setShow(false);
      axios.post(`/mypage/temp/${chatuser}/`, { eval: "최악" })
        .then((response)=>
          {if(response.status==204){
            window.alert("이미 평가한 유저입니다.")
          }})
        .catch()
    }


    const clickChatListTitleHandler= (chatroom: ChatRoomType)=>{
        dispatch(userActions.selectChatRoom(chatroom))
        navigate(`/chatroom/${chatroom.id}`);   
    }

    const closeChatroom= (chatroom: ChatRoomType)=>{
      dispatch(deleteChatRoom(chatroom))
    axios
    .get(`/chat/user/${userState.loggedinuser?.user.id}/`)
    .then((response)=>{
    setChatlist({...chatlist, 
    chatrooms: response.data
    });
  })
  .catch((err) => {console.log(err)})
  }


    return(
        <div className="card chat-list overflow-auto">
          <h5 className="card-title">채팅방</h5>
            <div className="list-group">
              {userState.loggedinuser?.chatrooms!.map((chatroom)=>(
                <a key={chatroom.id} className="list-group-item list-group-item-action list-group-item-color" onClick={(e)=> {e.stopPropagation(); e.preventDefault();clickChatListTitleHandler(chatroom);}}>
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{chatroom.name}</h5>
                    <small>{moment(chatroom.last_chat?.date).fromNow()}</small>
                    <button type="button" className="btn-close" onClick={(e)=>{e.stopPropagation(); e.preventDefault();closeChatroom(chatroom);}}></button>
                  </div>
                  <p className="mb-1">{chatroom.last_chat?.content}</p>
                  {chatroom.user_id.map((userid) =>(
                        <div key={userid}>
                        <Button className="btn-primary" style={{ backgroundColor: '#ffcf96', borderColor:'#ffcf96' }} onClick={(e)=>{e.stopPropagation(); e.preventDefault(); handleShow(userid);}}>
                          {(userState.userlist.find(element => element.id===userid))?.nickname ?? ''}님 평가하기
                        </Button>
                            <Modal show={show} onClick={(e:any)=>{e.stopPropagation(); e.preventDeafult();}}>
                            <Modal.Header>
                              <Modal.Title>매너 평가를 해주세요</Modal.Title>
                              <button type="button" className="btn-close" onClick={(e)=>{handleClose();  e.stopPropagation(); e.preventDefault();}}></button>
                            </Modal.Header>
                            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                            <Modal.Footer>
                              <Button variant="success" style={{ backgroundColor: '#FFB55D', borderColor:'#FFB55D' }} onClick={(e)=>{handleBest(); e.stopPropagation(); e.preventDefault();}}>
                                최고
                              </Button>
                              <Button variant="primary" style={{ backgroundColor: '#ffcf96', borderColor:'#ffcf96' }} onClick={(e)=>{handleGood(); e.stopPropagation(); e.preventDefault();}}>
                                좋음
                              </Button>
                              <Button variant="secondary" style={{ backgroundColor: '#FEE2A2', borderColor:'#FEE2A2' }} onClick={(e)=>{handleMed(); e.stopPropagation(); e.preventDefault();}}>
                                보통
                              </Button>
                              <Button variant="warning" style={{ backgroundColor: '#B8A985', borderColor:'#B8A985' }} onClick={(e)=>{handleBad(); e.stopPropagation(); e.preventDefault();}}>
                                별로
                              </Button>
                              <Button variant="danger" style={{ backgroundColor: '#666666', borderColor:'#666666' }} onClick={(e)=>{handleWorst(); e.stopPropagation(); e.preventDefault();}}>
                                최악
                              </Button>
                                </Modal.Footer>
                              </Modal>
                      </div>
                      ))}
                </a>
              ))}
            </div>
        </div>
    )
}
    


export default ChatList;


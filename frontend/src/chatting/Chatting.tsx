import { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { WebSocketContext } from './components/websocket/WebSocketProvider';
import { RootState } from '../store';
import { useParams } from 'react-router-dom';

function Chatting(){
  const user = useSelector( ({user} : RootState  )=>(
    {user : user.loggedinuser?.user
    }
  ));
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [author, setAuthor] = useState('');
  const {id} = useParams();
  var userId = String(user.user?.nickname)

  
  const ws = useContext(WebSocketContext);

  const handleChangeText = (e: any) => {
    setMessage(e.target.value);
    setAuthor(userId);
  };

  const handleClickSubmit = () => {

    ws.current.send(
      JSON.stringify({
        type: "message",
        content: message,
        author: author,
        room : id!,
      }),
    );
    console.log(id);
    setMessage('');
  };
  
  return (
    <div>
      <InputWrapper>
      <Input
        type='text'
        value={message}
        onChange={handleChangeText}
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleClickSubmit();
        }}
      ></Input>
      <button type='button' onClick={handleClickSubmit}>
        전송
      </button>
      </InputWrapper>
    </div>
  );
}
export default Chatting;


const InputWrapper = styled.div`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 5px 5px 20px #46464644;
  background-color: #ffffff;
  display: flex;
  border-top: 1px solid #d1d1d1;
`;
const Input = styled.input`
  width: calc(100% - 45px);
  height: 40px;
  border-radius: 5px;
  background-color: #ffffff;
  padding: 0 10px;
  font-size: 16px;
`;
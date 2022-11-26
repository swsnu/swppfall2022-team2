import React, { useState, useContext } from 'react';
import { WebSocketContext } from './components/websocket/WebSocketProvider';

function TextInputBox() {
  const [message, setMessage] = useState('');
  const ws = useContext(WebSocketContext);

  const handleChangeText = (e: any) => {
    setMessage(e.target.value);
  };

  const handleClickSubmit = () => {
    ws.current.send(
      JSON.stringify({
        type: 'chat_message',
        message: message,
      }),
    );

    setMessage('');
  };

  return (
    <div>
      <input
        type='text'
        value={message}
        onChange={handleChangeText}
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleClickSubmit();
        }}
      ></input>
      <button type='button' onClick={handleClickSubmit}>
        Send!
      </button>
    </div>
  );
}

export default TextInputBox;

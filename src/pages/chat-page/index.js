import { useState } from 'react'
import Comment from '../../component/comment'

function ChatPage() {
  const [roomId, setrRoomId] = useState([]);

  console.log('ChatPage');
  function onChangeRoomId () {
    setrRoomId('' + Date.now());
  }

  return (
    <div className="chat-page-component">
      <button onClick={onChangeRoomId}>更新</button>
      <Comment roomId={roomId}></Comment>
    </div>
  );
}

export default ChatPage;
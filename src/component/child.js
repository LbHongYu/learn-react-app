import { useState } from 'react'

function Child({ roomId }) {
  console.log('更新：', roomId);
  let [count, setCount] = useState(0)
  let [_roomId, setRoomId] = useState(roomId)

  function add () {
    setCount(++count);
  }

  return (
    <div className="child-component">
      <button onClick={add}>add count</button>
      <div>count: {count}</div>
      <div>roomId: {roomId}</div>
      <div>_roomId: {_roomId}</div>
    </div>
  );
}

export default Child;
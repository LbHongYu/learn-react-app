import { useState } from 'react'
import Child from '../../component/child';
function UseEffect() {
  const [roomId, setRoomId] = useState(0);
  /* useEffect(() => {
    console.log('每次渲染后都会执行此处的代码')
  });

  useEffect(() => {
    console.log('在组件挂载（首次出现）时运行')
  }, []);

  useEffect(() => {
    console.log('在组件挂载时运行，和当依赖值自上次渲染后发生变化后运行')
  }, [roomId]);
 */
  function onChangeRoomId () {
    setRoomId(Date.now());
  }

  return (
    <div className="chat-page-component">
      <button onClick={onChangeRoomId}>更新</button>
      <Child roomId={roomId} key={roomId}></Child>
    </div>
  );
}

export default UseEffect;
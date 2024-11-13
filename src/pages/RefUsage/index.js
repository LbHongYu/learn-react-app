import { useState, useRef, useEffect } from 'react'
import Comment from '../../component/Comment'

function RefUsage() {
  // 通过 ref 获取 DOM
  const pageRef = useRef();
  const CommentRef = useRef();
  const contentListRef = useRef(); // 列表的 ref

  useEffect(() => {
    // console.log(pageRef.current, CommentRef.current);
    // CommentRef.current.getContent(); //获取子组件中的方法
  }, []);

  useEffect(() => {
    console.log(contentListRef.current); // 获取数组元素的ref
  });

  const [roomId, setrRoomId] = useState(Date.now());
  const [contentList, setContentList] = useState([
    { content: '如果你的组件需要存储一些值，但不影响渲染逻辑：', id: 1 },
    { content: '存储 timeout ID', id: 2 },
    { content: '存储和操作 DOM 元素', id: 3 },
    { content: '存储不需要被用来计算 JSX 的其他对象', id: 4 },
  ]);

  function onChangeRoomId () {
    setrRoomId('' + Date.now());
  }

  function onRemoveContent (d) {
    let newContentList = contentList.filter(c => c.id !== d.id);
    setContentList(newContentList);
  }

  function getContentRefMap () {
    if (!contentListRef.current) {
      contentListRef.current = new Map();
    }

    return contentListRef.current;
  }

  return (
    <div className="ref-usage" ref={pageRef}>
      <button onClick={onChangeRoomId}>更新</button>
      <Comment roomId={roomId} content={contentList} ref={CommentRef}></Comment>

      <div className="content-wrapper">
        {
          contentList.map((d) => {
            return (
              <div 
                className="content" 
                onClick={() => onRemoveContent(d)} 
                key={d.id} 
                ref={
                (node) => {
                  const map = getContentRefMap();

                  console.log(node);
                  if (node) { 
                    map.set(d.id, node);
                  } else { // 需要清除它时会是 null
                    map.delete(d.id, node);
                  }
                }
              }>
                {d.id}: {d.content}
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default RefUsage;
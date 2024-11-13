import { forwardRef, useImperativeHandle, useState } from 'react'

function Comment({ roomId, content }, commentComponentRef) {
  let [childContent] = useState('childContent');

  useImperativeHandle(commentComponentRef, () => ({
    getContent () {
      console.log(childContent);
    },
  }));

  return (
    <div className="comment-component" ref={commentComponentRef}>
      <div className="title">
        房间：{roomId}
      </div>
    </div>
  );
}
/* 通过 forwardRef 将子组件的DOM暴露给父组件
forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
}) 
*/
export default forwardRef(Comment);
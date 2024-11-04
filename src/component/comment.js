// import { useEffect, useState, useRef } from 'react'

function comment({ roomId }) {
  console.log('更新：', roomId);
  
  return (
    <div className="comment-component">
      {roomId}
    </div>
  );
}

export default comment;
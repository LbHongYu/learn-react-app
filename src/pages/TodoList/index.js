import './index.css';
import { useEffect, useState, useRef } from 'react'
import { getTodoList } from '../../mock/index'

function TodoList() {
  const [listData, setListData] = useState([]);
  const [cardInPageView, setCardInPageView] = useState([])
  const [curRenderedItem, setCurRenderedItem] = useState()

  useEffect(() => {
    getTodoList().then(({ data }) => {
      setListData(data);
    });
  }, []);

  useEffect(() => {
    function touchmoveBody (e) {
      console.log('touchmove', e.target._isScroller);
      if (e.target._isScroller) return;
      e.preventDefault()
    }

    document.body.addEventListener(
      'touchmove', 
      touchmoveBody,
      { passive: false }
    );

    return () => {
      document.body.removeEventListener(
        'touchmove', 
        touchmoveBody,
        { passive: false }
      );
    }
  }, []);

  useEffect(() => {
    listData.length && getCardInPageView(listData);
  }, [listData]);
  
  useEffect(() => {
    console.log(cardInPageView);
  }, [cardInPageView]);

  const CardsWrapperRef = useRef(null);

  let debounceGetCardInPageView = debounce(getCardInPageView, 300);

  function getCardInPageView (listData) {
    let cardsElement = CardsWrapperRef.current.querySelectorAll('.card');
    let res = [];

    for (let index = 0; index < cardsElement.length - 1; index++) {
      let d = cardsElement[index];
      let y = d.getBoundingClientRect().y;
      
      if (y > window.innerHeight - 20) break;
      if (y > 60 && y < window.innerHeight - 20) {
        let { fdMobileLink, fdSubject, fdId } = listData[index];
        fdMobileLink = ~fdMobileLink.indexOf('?') 
          ? fdMobileLink + '&scene=notify' 
          : fdMobileLink + '?scene=notify';


        res.push({ index, fdMobileLink, fdId, fdSubject });
      }
    }
    console.log('getCardInPageView', res);
    setCardInPageView(res);
    // setCardInPageView(getSideIndex(res, listData, 3));
  }

  function onClosePoppup () {
    setCurRenderedItem(null);
  }

  const loadedIframe = useRef(0);

  function onLoadIframe (index) {
    console.log(index);
    loadedIframe.current++;
    if (loadedIframe.current === cardInPageView.length) {
      console.log('load all');
    }
  }

  function onClickCard (data) {
    setCurRenderedItem(data.fdId);
  }

  function onHandleTouch (e) {
    console.log('todo-list onHandleTouch');
    e.target._isScroller = true
  }

  function debounce (callback, wait) {
    let timer = null;
  
    return function(...args) {
      if (timer) {
        clearTimeout(timer);
      }
  
      timer = setTimeout(() => {
        callback.apply(null, [...args]);
        timer = null;
      }, wait);
    };
  }

  // 获取前后 count 个的索引
  /* function getSideIndex (arr, data, count) {
    let res = JSON.parse(JSON.stringify(arr));

    let firstIndex = arr[0].index;
    let lastIndex = arr[arr.length - 1].index;

    let prevCount = Math.max(firstIndex - count, 0);
    let nextCount = Math.min(data.length, lastIndex + count);

    if (prevCount < firstIndex) {
      for (let i = firstIndex - 1; i >= prevCount; i--) {
        let { fdMobileLink, fdSubject, fdId } = data[i];
        res.unshift({ index: i, fdMobileLink, fdSubject, fdId });
      }
    }

    if (nextCount > lastIndex) {
      for (let i = lastIndex + 1; i <= nextCount; i++) {
        let { fdMobileLink, fdSubject, fdId } = data[i];

        res.push({ index: i, fdMobileLink, fdSubject, fdId });
      }
    }
  
    return res;
  } */

  return (
    <div className="todo-list" onTouchMove={onHandleTouch}>
      <div className="blank"></div>
      <div className="cards" ref={CardsWrapperRef} onScroll={debounceGetCardInPageView}>
        {
          listData.map((d, index) => {
            return (
              <div className="card" key={d.fdId} onClick={ () => onClickCard(d)}>{d.fdSubject}</div>
            )
          })
        }
      </div>

      {
        cardInPageView.map((d) => {
          return ( 
            <div 
              className="popup-wrapper" 
              style={
                { display: curRenderedItem === d.fdId ? "block" : "none" }
              }
              onClick={onClosePoppup}
              data-fdmobilelinkindex={d.index}
              key={d.fdId}
            >
              <div className="popup-content">
                {d.fdSubject}
                {/* {<iframe className="business-system-iframe" src= {d.fdMobileLink} ></iframe>} */}
                {
                  <iframe 
                    className="business-system-iframe" 
                    title={d.fdSubject}
                    onLoad={() => onLoadIframe(d.index)}
                    src= {'https://zh-hans.react.dev/learn/updating-arrays-in-state#replacing-items-in-an-array'} >
                  </iframe>
                }
              </div>
            </div>
          )
        })
      }   
    </div>
  );
}

export default TodoList;

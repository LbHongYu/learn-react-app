* 仅开发环境下的行为： 开启 严格模式 时，React 在每次挂载组件后都会重新挂载组件（组件的 state 与 创建的 DOM 都会被保留）。它可以帮助你找出需要添加清理函数的 Effect

* Hook 只能在组件的顶层被调用

### ref
当一条信息用于渲染时，将它保存在 state 中。当一条信息仅被事件处理器需要，并且更改它不需要重新渲染时，使用 ref 可能会更高效。注意不要在渲染期间读取（或写入） ref.current 值，React 永远不会重新渲染ref的更新。

*何时使用 ref* 

如果你的组件需要存储一些值，但不影响渲染逻辑：
* 存储 timeout ID
* 存储和操作 DOM 元素，我们将在 下一页 中介绍
* 存储不需要被用来计算 JSX 的其他对象。

*使用命令句柄暴露一部分 API*
```
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // 只暴露 focus，没有别的
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        聚焦输入框
      </button>
    </>
  );
}

```

### useEffect —— 章节一
1. useEffect 的执行时机：
  * 每次渲染后运行
  * 在组件挂载（首次出现）时运行
  * 在组件挂载时运行，和当依赖值自上次渲染后发生变化后运行
```
// 会在每次渲染后运行
useEffect(() => {});

// 只会在组件挂载（首次出现）时运行
useEffect(() => {}, []);

// 不但会在组件挂载时运行，而且当 a 或 b 的值自上次渲染后发生变化后也会运行
useEffect(() => {}, [a, b]);
```
2. Effect 会在每次渲染后运行，切勿在 Effect 中更新依赖的 state， 否则会陷入死循环

3. 如果指定的所有依赖项的值都与上一次渲染时完全相同，React 会跳过重新运行该 Effect

4. Effect 使用了具有稳定的标识，在依赖数组中可以不指定

5. 可以在 Effect 中返回一个 清理（cleanup）函数， React会在再次运行之前和在组件卸载时调用。如果Effect 订阅了某些事件，清理函数应退订这些事件
```
// 调用清理函数
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);

// 退订事件
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

6. 每个 Effect 都会“捕获”它对应渲染时的 state 依赖值，每个渲染的 Effect 都是相互独立的。

7. 如果一个值可以基于现有的 props 或 state 计算得出，不要把它作为一个 state，而是在渲染期间直接计算这个值
```
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ 如果 getFilteredTodos() 的耗时不长，这样写就可以了。
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```


如果 `getFilteredTodos` 比较耗时，可以使用 useMemo Hook 缓存。
```
import { useMemo, useState } from 'react';

// todos 或 filter 发生变化，否则不会重新执行传入的函数
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ 除非 todos 或 filter 发生变化，否则不会重新执行
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
}
```

2. 当 props 变化时需要重置所有 state的话，可以从外部的组件传递一个 key 属性给内部的组件。
```
export default function ProfilePage({ userId }) {
  return (<Profile userId={userId} key={userId} />);
}
```

3.当决定将某些逻辑放入事件处理函数还是 Effect 中时，需要回答的主要问题是：从用户的角度来看它是 怎样的逻辑。如果这个逻辑是由某个特定的交互引起的，请将它保留在相应的事件处理函数中。如果是由用户在屏幕上 看到 组件时引起的，请将它保留在 Effect 中。


* 仅开发环境下的行为： 开启 严格模式 时，React 在每次挂载组件后都会重新挂载组件（组件的 state 与 创建的 DOM 都会被保留）。它可以帮助你找出需要添加清理函数的 Effect

* Hook 只能在组件的顶层被调用

### state
1. 当 props 变化时需要重置所有 state的话，可以从外部的组件传递一个 key 属性给内部的组件。
```
export default function ProfilePage({ userId }) {
  return (<Profile userId={userId} key={userId} />);
}
```

2. 如果一个值可以基于现有的 props 或 state 计算得出，不要把它作为一个 state，而是在渲染期间直接计算这个值
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

3. 对 state 更新进行批处理  
- 设置 state 不会更改现有渲染中的变量，但会请求一次新的渲染。React 会在事件处理函数执行完成之后处理 state 更新。这被称为批处理。
- 要在一个事件中多次更新某些 state，可以使用 `setNumber(n => n + 1) `更新函数。

4. 更新 state 中的对象
  - 不要直接修改一个对象，而要为它创建一个新版本，并通过把 state 设置成这个新版本来触发重新渲染。
  - 可以使用 {...obj, something: 'newValue'} 对象展开语法来创建对象的拷贝。对象的展开语法是浅层的：它的复制深度只有一层。想要减少重复的拷贝代码，可以使用 Immer。

5. 更新 state 中的数组
  - 可以把数组放入 state 中，但你不应该直接修改它。可以创建它的一份新的拷贝，然后使用新的数组来更新它的状态。
  - 可以使用 [...arr, newItem] 这样的数组展开语法来向数组中添加元素，使用 filter() 和 map() 来创建一个经过过滤或者变换的数组
  - 


### ref
1. 当一条信息仅被事件处理器需要，并且更改它不需要重新渲染时，可以使用 `ref`。注意不要在渲染期间读取（或写入） ref.current 值，ref 的更新不会导致 React 重新渲染。

2. ref 是一个普通的 JavaScript 对象，与 `state` 一样，React 会在每次重新渲染之间保留 `ref`，与 `state` 不同的是，`ref` 可以被读取和修改的 current 属性

3. 何时使用 ref

如果你的组件需要存储一些值，但不影响渲染逻辑：
* 存储 timeout ID
* 存储和操作 DOM 元素
* 存储不需要被用来计算 JSX 的其他对象。

4. 通过 forwardRef 将子组件的DOM暴露给父组件，通过 useImperativeHandle 将子组件的方法暴露给父组件
```
import { forwardRef, useRef, useImperativeHandle, useState } from 'react';
const child = forwardRef((props, childRef) => {
  let content = useState();
  useImperativeHandle(childRef, () => {
    return {
      childFn: function () {
        console.log('childFn: ', )
      }
    }
  });
  return (<div className='child' ref={childRef}>{props.name}</div>)
})
```

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

### useEffect —— 章节二

### useEffectEvent
1. 当决定将某些逻辑放入事件处理函数还是 Effect 中时。从用户的角度来看它是怎样的逻辑。如果这个逻辑是由某个特定的交互引起的，请将它保留在相应的事件处理函数中。如果是由用户在屏幕上 看到 组件时引起的，请将它保留在 Effect 中。

2. （实验中）useEffectEvent 看成和事件处理函数相似的东西。主要区别是事件处理函数只在响应用户交互的时候运行，而 useEffectEvent 是你在 Effect 中触发的。
```
import { useState, useEffect, useEffectEvent, useContext } from 'react';
const serverUrl = 'https://localhost:3000';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    alert(`${theme}: Connected!`);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();

    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}
```

useEffectEvent 的局限性在于你如何使用他们：
* 只在 Effect 内部调用他们。
* 永远不要把他们传给其他的组件或者 Hook

3. 避免将包含响应式数据的普通对象和函数作为依赖，在每次组件重新渲染时，即使响应式数据没有变化，因为不同对象是不相等的，也会触发 Effect
```
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);
  // ...
}
```

### 状态管理

1. 合并关联的 state。如果你总是同时更新两个或更多的 state 变量，请考虑将它们合并为一个单独的 state 变量。

2. 避免冗余的 state。如果你能在渲染期间从组件的 props 或其现有的 state 变量中计算出一些信息，则不应将这些信息放入该组件的 state 中。

3. 避免深度嵌套的 state。深度分层的 state 更新起来不是很方便。如果可能的话，最好以扁平化方式构建 state

### 添加交互

事件处理函数还将捕获任何来自子组件的事件。通常，我们会说事件会沿着树向上“冒泡”或“传播”：它从事件发生的地方开始，然后沿着树向上传播。
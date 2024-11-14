import logo from './logo.svg';
import './index.css';
import { useState } from 'react';

function Dashboard() {
  let [todoList, setTodoList] = useState([
    { title: '开发任务-1', status: '22-05-22 18:15' },
    { title: '开发任务-3', status: '22-05-22 18:15' },
    { title: '开发任务-5', status: '22-05-22 18:15' },
    { title: '测试任务-3', status: '22-05-22 18:15' }
  ]);
  const [ongoingList, setOngoingList] = useState([
    { title: '开发任务-4', status: '22-05-22 18:15' },
    { title: '开发任务-6', status: '22-05-22 18:15' },
    { title: '测试任务-2', status: '22-05-22 18:15' }
  ]);
  const [doneList, setDoneList] = useState([
    { title: '开发任务-2', status: '22-05-22 18:15' },
    { title: '测试任务-1', status: '22-05-22 18:15' }
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const handleAdd = (evt) => {
    setShowAdd(true); 
  }; 
  
  const handleSubmit = (title) => {
    setTodoList([
      { title, status: new Date().toDateString() },
      ...todoList,
    ]);
    // setShowAdd(false);
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>我的看板</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      <main className="kanban-board">
        <KanbanColumn type="todo" title={(<>待处理<button onClick={handleAdd}>&#8853; 添加新卡片</button></>)}>
          <ul>
            {showAdd && <KanbanNewCard onSubmit={handleSubmit}/>}
            { todoList.map(props => <KanbanCard {...props} key={props.title + props.status}/>) }
          </ul>         
        </KanbanColumn>
        <KanbanColumn type="ongoing" title="进行中">
          <ul>        
            {
              ongoingList.map(props => (<KanbanCard {...props} key={props.title + props.status}/>))
            }
          </ul>          
        </KanbanColumn>
        <KanbanColumn type="done" title="已完成">
          <ul>        
            {
              ongoingList.map(props => (<KanbanCard {...props} key={props.title + props.status}/>))
            }
          </ul>          
        </KanbanColumn>
      </main>
    </div>
  );
}

const KanbanCard = ({ title, status }) => {
  return (
    <li className="kanban-card">
      <div className="card-title">{title}</div>
      <div className="card-status">{status}</div>
    </li>
  );
};  

const KanbanNewCard = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const handleChange = (evt) => {
    setTitle(evt.target.value);
  };
  const handleKeyDown = (evt) => {
    if (evt.key === 'Enter') {
      onSubmit(title);
    }
  };

  return (
    <li className="kanban-card">
      <h3>添加新卡片</h3>
      <div className="card-title">
      <input type="text" value={title}
        onChange={handleChange} onKeyDown={handleKeyDown} />
      </div>
    </li>
  );
};

const KanbanColumn = ({ title, type, children }) => {
  return (
    <section className={`kanban-column column-${type}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
export default Dashboard;
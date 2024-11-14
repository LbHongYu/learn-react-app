import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import TodoList from './pages/TodoList/index';
// import RefUsage from './pages/RefUsage/index';
// import UseEffect from './pages/UseEffect/index';
// import SeparatingEvent from './pages/SeparatingEvent/index';
// import UseImmerReducer from './pages/UseImmerReducer/index';
// import UseReducer from './pages/UseReducer/index';
// import UseContext from './pages/UseContext/index';
import Dashboard from './pages/Dashboard/index';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <UseEffect /> */}
    {/* <RefUsage /> */}
    {/* <SeparatingEvent /> */}
    {/* <UseReducer /> */}
    {/* <UseImmerReducer /> */}
    {/* <UseContext /> */}
    <Dashboard />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

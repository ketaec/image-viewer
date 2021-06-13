import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Header from './common/header/Header';
import Login from './screens/login/Login';

ReactDOM.render(
  <React.StrictMode>
    <div>
      <Header />
      <Login />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);


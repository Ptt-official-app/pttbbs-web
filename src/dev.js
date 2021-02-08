import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import Routes from './routes/Dev'

import 'normalize.css/normalize.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'fixed-data-table-2/dist/fixed-data-table.css'

import './index.css'


ReactDOM.render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

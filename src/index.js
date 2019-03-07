import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from "axios";
import { Router } from 'react-router-dom';
import history from './history';

// axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common = {
    "responseType": "json",
    "Content-Type": "application/json",
};

ReactDOM.render(<Router history={history}>
    <App />
  </Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

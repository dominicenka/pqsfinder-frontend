import React, { Component } from 'react';
import './App.css';
import {Route} from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom'
import NavMenu from './components/NavMenu';


class App extends Component {
  render() {
    return (
      <div className="">
        <NavMenu />
      </div>
    );
  }
}

export default App;

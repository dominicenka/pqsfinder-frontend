import React, { Component } from 'react';
import './App.css';
import NavMenu from './components/NavMenu';

import {Switch, Route} from 'react-router-dom';
import { Router } from 'react-router-dom'
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Examples from './pages/Examples';
import Help from './pages/Help';
import Contact from './pages/Contact';
import ResultsTable from './pages/ResultsTable';
import RedirectPage from './pages/RedirectPage';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <Router history={history}>
      <div>
        <NavMenu />
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/analyze" component={Analyze}/>
            <Route exact path="/examples" component={Examples}/>
            <Route exact path="/help" component={Help}/>
            <Route exact path="/contact" component={Contact}/>
            <Route path="/resultsTable" component={ResultsTable}/>
            <Route path="/redirectPage" component={RedirectPage}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;

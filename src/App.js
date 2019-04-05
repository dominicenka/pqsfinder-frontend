import React, { Component } from 'react';
import './App.css';
import NavMenu from './components/NavMenu';

import {Switch, Route} from 'react-router-dom';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Examples from './pages/Examples';
import Help from './pages/Help';
import Contact from './pages/Contact';
import ResultsTable from './pages/ResultsTable';
import ResultsGraph from './pages/ResultsGraph';
import 'font-awesome/css/font-awesome.min.css';

class App extends Component {
  render() {
    return (
      <div>
        <NavMenu />
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/analyze" component={Analyze}/>
            <Route exact path="/examples" component={Examples}/>
            <Route exact path="/help" component={Help}/>
            <Route exact path="/contact" component={Contact}/>
            <Route path="/resultsTable" component={ResultsTable}/>
            <Route path="/resultsGraph" component={ResultsGraph}/>
          </Switch>
        </div>
    );
  }
}

export default App;

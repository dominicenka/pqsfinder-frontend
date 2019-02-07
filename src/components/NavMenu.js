import React, { Component } from 'react';
import '../App.css';
import {Switch, Route} from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom'
import {NavLink} from 'react-router-dom'
import Home from '../pages/Home';
import Analyze from '../pages/Analyze';
import Examples from '../pages/Examples';
import Help from '../pages/Help';
import Contact from '../pages/Contact';

import logo from "../images/logo_long.jpg";

class NavMenu extends Component {
    render() {
      return (
        <BrowserRouter>
			<div>
				<nav className="navbar fixed-top navbar-expand-lg navbar-dark nav" >
					<a className="navbar-brand" href="/">pqsfinder</a>
					<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarNav">
						<div className="navbar-nav">
							<a className="nav-item nav-link" href="/">Home <span className="sr-only">(current)</span></a>
							<a className="nav-item nav-link" href="/analyze">Analyze</a>
							<a className="nav-item nav-link" href="/examples">Examples</a>
							<a className="nav-item nav-link" href="/help" >Help</a>
							<a className="nav-item nav-link" href="/contact" >Contact</a>
						</div>
					</div>
					<form className="form-inline">
						<input className="form-control mr-sm-2" type="search" placeholder="job ID" aria-label="Search"/>
						<button className="btn btn-outline-secondary my-2 my-sm-0" type="submit">Find</button>
					</form>
				</nav>
				<Switch>
					<Route exact path="/" component={Home}/>
					<Route exact path="/analyze" component={Analyze}/>
					<Route exact path="/examples" component={Examples}/>
					<Route exact path="/help" component={Help}/>
					<Route exact path="/contact" component={Contact}/>
				</Switch>
			</div>
      	</BrowserRouter>
      );
    }
  }
  
  export default NavMenu;
  
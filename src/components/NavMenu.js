import React, { Component } from 'react';
import '../App.css';
import {Switch, Route} from 'react-router-dom';
import { BrowserRouter, Link } from 'react-router-dom'
import Home from '../pages/Home';
import Analyze from '../pages/Analyze';
import Examples from '../pages/Examples';
import Help from '../pages/Help';
import Contact from '../pages/Contact';
import ResultsTable from '../pages/ResultsTable';
import RedirectPage from '../pages/RedirectPage';

import logo from "../images/logo_long.jpg";
import findJobStore from '../stores/FindJobStore';
import * as FindJobActions from '../actions/FindJobActions';
import { Redirect } from "react-router-dom";

class NavMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			jobId: [],
			find: false
		}

		this.getJobId = this.getJobId.bind(this);
	}

	componentWillMount() {
        findJobStore.on("changeJobId", this.getJobId);
    }

    componentWillUnmount() {
        findJobStore.removeListener("changeJobId", this.getJobId);
	}
	
	getJobId() {
		this.setState({
			jobId: findJobStore.getJobId()
		});
	}

    render() {
      return (
        <BrowserRouter>
			<div>
				<nav className="navbar fixed-top navbar-expand-lg navbar-dark nav justify-content-center " >
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
						<input className="form-control mr-sm-2 search-inp" type="search" placeholder="job ID" aria-label="Search" 
								onChange={(e) => FindJobActions.changeJobId(e.target.value)}/>
							<Link to={{
								pathname: '/redirectPage/',
								state: { results: this.state.jobId  }
								}} >
						<button className="btn btn-outline-secondary my-2 my-sm-0" type="submit" >Find</button> </Link>
					</form>
				</nav>
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
      	</BrowserRouter> );
    }
  }
  
  export default NavMenu;
  
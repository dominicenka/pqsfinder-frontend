import React, { Component } from 'react';
import '../App.css';
import {  Link } from 'react-router-dom';

import logo from "../images/logo_long.jpg";
import findJobStore from '../stores/FindJobStore';
import * as FindJobActions from '../actions/FindJobActions';

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
								state: { id: this.state.jobId  }
								}} >
						<button className="btn btn-outline-secondary my-2 my-sm-0" type="submit" >Find</button> </Link>
					</form>
				</nav>
			</div>
	  )
    }
  }
  
  export default NavMenu;
  
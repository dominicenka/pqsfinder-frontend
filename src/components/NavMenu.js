import React, { Component } from 'react';
import '../App.css';
import { NavLink } from 'react-router-dom';

import findJobStore from '../stores/FindJobStore';
import * as FindJobActions from '../actions/FindJobActions';
import resultsStore from '../stores/ResultsStore';
import history from '../history';

const logo = '/images/logoTcrop.svg';

class NavMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			jobId: [],
			find: false,
			idInput: ''
		}

		this.getJobId = this.getJobId.bind(this);
		this.getResults = this.getResults.bind(this);
		this.invalidId = this.invalidId.bind(this);
	}

	componentWillMount() {
		findJobStore.on("changeJobId", this.getJobId);
		resultsStore.on("fetched", this.getResults);
		resultsStore.on("invalidId", this.invalidId);
		this.unlisten = history.listen(location => this.setState({jobId: '', idInput: ''}));
    }

    componentWillUnmount() {
		findJobStore.removeListener("changeJobId", this.getJobId);
		resultsStore.removeListener("fetched", this.getResults);
		resultsStore.removeListener("invalidId", this.invalidId);
		this.unlisten();
	}
	
	getJobId() {
		this.setState({
			jobId: findJobStore.getJobId()
		});
	}

	getJob() {
		resultsStore.fetchResults(this.state.jobId[0]);
	}

	getResults() {
		history.push(`/results/${resultsStore.getResults().id}`);
	}

	invalidId() {
		this.setState({idInput: 'is-invalid'});
	}

    render() {
      	return (
				<div className="blueNav">
					<nav className="navbar fixed-top navbar-expand-lg navbar-dark nav justify-content-center " >
							<img src={logo} className="logo" alt=""></img>
							<NavLink className="navbar-brand" to="/">pqsfinder</NavLink>
							<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
								<span className="navbar-toggler-icon"></span>
							</button>
							<div className="collapse navbar-collapse" id="navbarNav">
								<div className="navbar-nav">
									<NavLink exact className="nav-item nav-link" to="/">Analyze</NavLink>
									<NavLink className="nav-item nav-link" to="/genomes">Genomes</NavLink>
									<NavLink className="nav-item nav-link" to="/help" >Help</NavLink>
									<NavLink className="nav-item nav-link" to="/contact" >Contact</NavLink>
								</div>
							</div>
							<form className="form">
								<input className={`form-control mr-sm-2 search-inp ${this.state.idInput}`} type="search" placeholder="Job ID" aria-label="Search" 
										onChange={(e) => {this.setState({idInput: ''}); FindJobActions.changeJobId(e.target.value)}} value={this.state.jobId}/>
								<button className="btn getJob-btn my-2 my-sm-0" onClick={(e) => {e.preventDefault(); this.getJob();}}>Get job</button>
							</form>
					</nav>
					{/* <div className="error" style={{"height": this.props.error ? "30px" : "0px"}}>
						{this.props.error && <p>Sorry, there seems to be a problem. We are working hard on fixing it, please try again later.</p> }
					</div> */}
				</div>
	  )
    }
  }
  
  export default NavMenu;
  
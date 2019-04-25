import React, { Component } from 'react';
import './App.css';
import NavMenu from './components/NavMenu';

import {Switch, Route} from 'react-router-dom';
import Analyze from './pages/Analyze';
import Examples from './pages/Examples';
import Help from './pages/Help';
import Contact from './pages/Contact';
import ResultsTable from './pages/ResultsTable';
import 'font-awesome/css/font-awesome.min.css';
import subjectStore from './stores/SubjectStore';
import resultsStore from './stores/ResultsStore';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			version: 0,
			error: false
		}

		this.setVersion = this.setVersion.bind(this);
		this.setError = this.setError.bind(this);
		this.unsetError = this.unsetError.bind(this);
	}

	componentWillMount() {
		resultsStore.on("serverError", this.setError)
		subjectStore.on("serverError", this.setError)
		resultsStore.on("networkOk", this.unsetError)
		subjectStore.on("networkOk", this.unsetError)
		subjectStore.on("versionFetched", this.setVersion)
		subjectStore.fetchVersion();
	}

	componentWillUnmount() {
		resultsStore.removeListener("serverError", this.setError)
		subjectStore.removeListener("serverError", this.setError)
		resultsStore.removeListener("networkOk", this.unsetError)
		subjectStore.removeListener("networkOk", this.unsetError)
		subjectStore.removeListener("versionFetched", this.setVersion)
	}

	setVersion() {
		this.setState({
			version: subjectStore.getVersion()
		})
	}

	setError() {
		this.setState({
			error: true
		})
	}

	unsetError() {
		this.setState({
			error: false
		})
	}

  render() {
    return (
      <div>
       	<NavMenu error={this.state.error}/>
        <Switch>
            <Route exact path="/" component={Analyze}/>
            <Route exact path="/analyze" component={Analyze}/>
            <Route exact path="/examples" component={Examples}/>
            <Route exact path="/help" component={Help}/>
            <Route exact path="/contact" component={Contact}/>
            <Route path="/results" component={ResultsTable}/>
          </Switch>
        <footer>
					<div className="footer">
						<div className="cite">
							<p className="text">Cite: </p>
							<p className="cite-text"> Hon J, Martinek T, Zendulka J, Lexa M (2017). “pqsfinder: an exhaustive and imperfection-tolerant
												search tool for potential quadruplex-forming sequences in R.” Bioinformatics, 33(21), 3373-3379. 
												doi: 10.1093/bioinformatics/btx413.  </p>
						</div>
						<div className="version">
						<p className="text">Version: </p>
							<p className="version-text">
								<a href="http://bioconductor.org/packages/release/bioc/html/pqsfinder.html">{this.state.version}</a>
							</p>
						</div>
					</div>
        </footer>
	</div>
    );
  }
}

export default App;

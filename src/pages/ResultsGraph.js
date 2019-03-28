import React, { Component } from 'react';
import '../App.css';
import Graph from '../components/Graph';
import Loader from '../components/Loader';
import Utils from '../utils';
import resultsStore from '../stores/ResultsStore';

class ResultsGraph extends Component {

    constructor(props) {
        super(props);

        this.state = {};
        this.getResults = this.getResults.bind(this);
    }

    componentWillMount() {
        resultsStore.on("fetched-graph", this.getResults);
        // this.setState({results: resultsStore.getResultById(this.props.location.pathname.slice(this.props.location.pathname.lastIndexOf('/') + 1))});
    }

    componentWillUnmount() {
        resultsStore.removeListener("fetched-graph", this.getResults);
    }

    getResults() {
        this.setState({results: resultsStore.getResults()});
    }

    render(){
        let results = this.state.results || resultsStore.getResults();
        if (Utils.isEmpty(results)) {
            let url = this.props.location.pathname.split('/');
            resultsStore.fetchResults(url[url.length - 2], true);
        }
        // console.log(results);
        // console.log(results[this.props.location.pathname.slice(this.props.location.pathname.lastIndexOf('/') + 1)]);
        return (!Utils.isEmpty(results)) ? (
            <div>
                <Graph results={results[this.props.location.pathname.slice(this.props.location.pathname.lastIndexOf('/') + 1)]}/>
                <div className="row">
                <div className="col-sm-1 col-md-1"></div>
                <div className="col-sm-10">
                    <div className="card ">
                    <div className="card-header text-center"><h5>Citation</h5></div>
                        <div className="card-body">
                            <p className="card-text"> Hon J, Martinek T, Zendulka J, Lexa M (2017). “pqsfinder: an exhaustive and imperfection-tolerant
                                search tool for potential quadruplex-forming sequences in R.” Bioinformatics, 33(21), 3373-3379. 
                                doi: 10.1093/bioinformatics/btx413.  </p>
                        </div>
                    </div>
                </div>
                <div className="col-sm-1 col-md-1"></div>
            </div>
            </div>) 
            :  <div className="body container loading"><Loader/></div>;
    }
}

export default ResultsGraph;
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
            <Graph results={results[this.props.location.pathname.slice(this.props.location.pathname.lastIndexOf('/') + 1)]}/>) 
            :  <div className="body container loading"><Loader/></div>;
    }
}

export default ResultsGraph;
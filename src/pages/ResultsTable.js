import React, { Component } from 'react';
import '../App.css';
import ResultsTableHeader from '../components/ResultsTableHeader';
import ResultsTableTable from '../components/ResultsTableTable';

import * as ResultsActions from '../actions/ResultsActions';
import ResultsStore from '../stores/ResultsStore';

class ResultsTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            results: []
        }

        this.getResults = this.getResults.bind(this);
    }

    componentWillMount() {
        ResultsStore.on("fetched", this.getResults);

        ResultsActions.fetchResults(this.props.location.state);
    }

    componentWillUnmount() {
        ResultsStore.removeListener("fetched", this.getResults);
    }

    getResults() {
        this.setState({results: ResultsStore.getResults()});
    }

    renderResults() {
        let results = [];
        for (let[key, value] of Object.entries(this.state.results)) {
            //console.log(key, value);
            results.push(<ResultsTableHeader length={value.data.length} key={'header'+key} id={key} seq={value.seq}/>);
            results.push(<ResultsTableTable data={value.data} key={'table'+key}/>);
        }
        return results;
    }

    render(){
        //console.log(this.state.results);
        return this.state.results ? 
        (<div className="body container">
             {this.renderResults()}
        </div>) : <div></div>;
    }
}

export default ResultsTable;
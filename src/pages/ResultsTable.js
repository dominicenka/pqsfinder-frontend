import React, { Component } from 'react';
import '../App.css';
import ResultsTableHeader from '../components/ResultsTableHeader';
import ResultsTableTable from '../components/ResultsTableTable';
import ResultsHeader from '../components/ResultsHeader';

import * as ResultsActions from '../actions/ResultsActions';
import ResultsStore from '../stores/ResultsStore';
import subjectStore from '../stores/SubjectStore';
import Loader from '../components/Loader';
import isEmpty from '../utils';

class ResultsTable extends Component {

    constructor(props) {
        super(props);

        this.state = {};

        this.getResults = this.getResults.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
    }

    componentWillMount() {
        ResultsStore.on("fetched", this.getResults);
    }

    componentWillUnmount() {
        ResultsStore.removeListener("fetched", this.getResults);
    }

    getResults() {
        this.setState({results: ResultsStore.getResults()});
    }

    handleInvalid() {
        //this.props.history.push("/");
    }

    renderTables(results) {
        let tables = [];
        //console.log(this.state.results);
        for (let[key, value] of Object.entries(results)) {
            //console.log(key, value);
            if(key === 'id') continue;
            tables.push(<ResultsTableHeader length={value.data.length} key={'header'+key} id={key} seq={value.seq}/>);
            tables.push(<ResultsTableTable data={value.data} key={'table'+key}/>);
        }
        return tables;
    }

    render(){
        let results = this.state.results || ResultsStore.getResults();
        if (isEmpty(results)) ResultsActions.fetchResults(this.props.location.pathname.slice(this.props.location.pathname.lastIndexOf('/') + 1));
        return (!isEmpty(results)) ? 
        (<div className="body container">
            <ResultsHeader id={results.id}/>
            {this.renderTables(results)}
        </div>) : <div className="body container loading"><Loader/></div>;
    }
}

export default ResultsTable;
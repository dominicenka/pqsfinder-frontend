import React, { Component } from 'react';
import '../App.css';
import ResultsTableHeader from '../components/ResultsTableHeader';
import ResultsTableTable from '../components/ResultsTableTable';
import ResultsHeader from '../components/ResultsHeader';

import * as ResultsActions from '../actions/ResultsActions';
import ResultsStore from '../stores/ResultsStore';
import subjectStore from '../stores/SubjectStore';
import Loader from '../components/Loader';

class ResultsTable extends Component {

    constructor(props) {
        super(props);

        this.getResults = this.getResults.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
    }

    componentWillMount() {
        ResultsStore.on("fetched", this.getResults);
        ResultsStore.on("invalidId", this.handleInvalid);

        let pathname = this.props.location.pathname;
        ResultsActions.fetchResults(pathname.slice(pathname.lastIndexOf('/') + 1));
    }

    componentWillUnmount() {
        ResultsStore.removeListener("fetched", this.getResults);
    }

    getResults() {
        this.setState({results: ResultsStore.getResults()});
    }

    handleInvalid() {
        this.props.history.push("/");
    }

    renderResults() {
        let results = [];
        //console.log(this.state.results);
        for (let[key, value] of Object.entries(this.state.results)) {
            //console.log(key, value);
            if(key === 'id') continue;
            results.push(<ResultsTableHeader length={value.data.length} key={'header'+key} id={key} seq={value.seq}/>);
            results.push(<ResultsTableTable data={value.data} key={'table'+key}/>);
        }
        return results;
    }

    render(){
        //console.log(this.state.results);
        return this.state ? 
        (<div className="body container">
            <ResultsHeader id={this.state.results.id}/>
            {this.renderResults()}
        </div>) : <div className="body container loading"><Loader/></div>;
    }
}

export default ResultsTable;
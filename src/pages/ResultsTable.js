import React, { Component } from 'react';
import '../App.css';
import ResultsTableHeader from '../components/ResultsTableHeader';
import ResultsTableTable from '../components/ResultsTableTable';
import ResultsHeader from '../components/ResultsHeader';

import * as ResultsActions from '../actions/ResultsActions';
import ResultsStore from '../stores/ResultsStore';
import Loader from '../components/Loader';
import Utils from '../utils';


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
            tables.push(<ResultsTableHeader length={value.data.length} key={'header'+key} id={key} name={value.name} seq={value.seq} jobId={this.props.location.pathname.slice(this.props.location.pathname.lastIndexOf('/') + 1)}/>);
            tables.push(<ResultsTableTable data={value.data} key={'table'+key}/>);
        }
        return tables;
    }

    render(){
        let results = this.state.results || ResultsStore.getResults();
        if (Utils.isEmpty(results)) ResultsActions.fetchResults(this.props.location.pathname.slice(this.props.location.pathname.lastIndexOf('/') + 1));
        return (!Utils.isEmpty(results)) ? 
        (<div>
            <div className="body container">
                <ResultsHeader id={results.id}/>
                {this.renderTables(results)}
            </div>
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
        </div>) : <div className="body container loading"><Loader/></div>;
    }
}

export default ResultsTable;
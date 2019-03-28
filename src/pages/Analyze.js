import React, { Component } from 'react';
import Options from '../components/Options';
import DNAInput from '../components/DNAInput';
import '../App.css';

import SubjectStore from '../stores/SubjectStore';
import * as SubjectActions from '../actions/SubjectActions';
import * as ResultsActions from '../actions/ResultsActions';
import history from '../history';

class Analyze extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            results: {},
            fetched: false
        }

        this._redirect = this._redirect.bind(this);
    }

    componentWillMount() {
       // SubjectStore.on("fetching", this.getOpts);
        SubjectStore.on("fetched", this._redirect);
    }

    componentWillUnmount() {
       SubjectStore.removeListener("fetched", this._redirect);
    }

    _redirect() {
        ResultsActions.fetchResults(SubjectStore.getResults());
        history.push(`/resultsTable/${SubjectStore.getResults()}`);
    }

    render() {
        return (
            <div>
                <div className="body container">
                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-md-10 col-sm-10">
                            <div className="card">
                                <div className="card-body">
                                    <DNAInput />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-1"></div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-md-10 col-sm-10">
                            <div className="card">
                                <div className="card-body">
                                    <Options />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-5"></div>
                        <button type="button" className="btn btn-analyze btn-lg " onClick={() => SubjectActions.analyze()}>Analyze</button>
                        <div className="col-sm-5"></div>
                    </div>
                    
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
            </div>
        )
    }
}

export default Analyze;
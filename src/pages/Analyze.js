import React, { Component } from 'react';
import Options from '../components/Options';
import DNAInput from '../components/DNAInput';
import '../App.css';

import SubjectStore from '../stores/SubjectStore';
import * as SubjectActions from '../actions/SubjectActions';
import * as ResultsActions from '../actions/ResultsActions';
import Error from './Error';

class Analyze extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            results: {},
            fetched: false,
            error: false
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
        this.props.history.push(`/results/${SubjectStore.getResults()}`);
    }

    render() {
        return !this.props.error ? (
            <div>
                <div className="wrapper">
                <h1 className="mw">pqsfinder – imperfection-tolerant G-quadruplex prediction</h1>
                    <div className="row">
                            <div className="card input">
                                <div className="card-body">
                                    <DNAInput />
                                </div>
                            </div>
                    </div>
                    <div className="row">
                            <div className="card options">
                                <div className="card-body">
                                    <Options />
                                </div>
                            </div>
                    </div>
                    <div className="row mw">
                        <button type="button" className="btn btn-analyze" onClick={() => SubjectActions.analyze()}>Analyze</button>
                    </div>
                </div>
            </div>
        ) : <Error />
    }
}

export default Analyze;
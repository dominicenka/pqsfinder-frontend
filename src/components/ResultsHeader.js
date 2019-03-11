import React, { Component } from 'react';
import '../App.css';
import * as ResultsActions from '../actions/ResultsActions';

class ResultsHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-1"></div>
                        <div className="col-md-10 col-sm-10">
                            <div className="card results-header">
                                <div className="card-body ">
                                    <div className="row">
                                        <div className="col-md-5 job-id">
                                            Job ID: {this.props.id} <br></br>
                                        </div>
                                        <div className="col-md-6 ">
                                            <div className="dropdown">
                                                <button type="button" className="btn btn-info dropdown-toggle btn-padding-opt" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Export all results as..</button>
                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                    <a className="dropdown-item" href="#" onClick={() => ResultsActions.exportGffAll(this.props.id)}>.gff</a>
                                                    <a className="dropdown-item" href="#" onClick={() => ResultsActions.exportCsvAll(this.props.id)}>.csv</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div className="col-sm-1"></div>
                </div>
            </div>
        );
    }
}

export default ResultsHeader;
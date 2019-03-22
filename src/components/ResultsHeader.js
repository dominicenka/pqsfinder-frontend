import React, { Component } from 'react';
import '../App.css';
import * as ResultsActions from '../actions/ResultsActions';

class ResultsHeader extends Component {
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
                                                    <button className="dropdown-item" onClick={() => ResultsActions.exportGffAll(this.props.id)}>.gff</button>
                                                    <button className="dropdown-item" onClick={() => ResultsActions.exportCsvAll(this.props.id)}>.csv</button>
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
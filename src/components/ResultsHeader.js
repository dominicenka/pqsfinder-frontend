import React, { Component } from 'react';
import '../App.css';
import * as ResultsActions from '../actions/ResultsActions';

class ResultsHeader extends Component {
    render() {
        return (
            <div className="results-header">
                <div className="row">
                    <div className="col-sm-2"></div>
                        <div className="col-md-8 col-sm-8">
                            <div className="card">
                                <div className="card-body results-header-body">
                                    <div className="row">
                                    <div className="row header-content">
                                        <div className="job-id">
                                            Job ID: {this.props.id} <br></br>
                                        </div>
                                        {/* <div className="col-md-4 "> */}
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
                    <div className="col-sm-2"></div>
                </div>
            </div>
        );
    }
}

export default ResultsHeader;
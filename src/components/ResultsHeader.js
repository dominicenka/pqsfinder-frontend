import React, { Component } from 'react';
import '../pages/Results.css';
import * as ResultsActions from '../actions/ResultsActions';

class ResultsHeader extends Component {
    render() {
        return (
            <div className="results-header">
                    <div className="card">
                            <div className="card-body results-header-body">
                                <div className="header-content">
                                    <div className="job-id">
                                        <strong>Job ID:</strong> {this.props.id} <br></br>
                                    </div>
                                    <div className="dropdown header-export">
                                        <button type="button" className="btn btn-info dropdown-toggle btn-padding-opt" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Export all results as..</button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <button className="dropdown-item" onClick={() => ResultsActions.exportGffAll(this.props.id)}>.gff</button>
                                            <button className="dropdown-item" onClick={() => ResultsActions.exportCsvAll(this.props.id)}>.csv</button>
                                        </div>
                                    </div>
                                </div>
                                    <p>Bookmark this page or save the job ID to access the results later.</p>
                            </div>
                    </div>
            </div>
        );
    }
}

export default ResultsHeader;
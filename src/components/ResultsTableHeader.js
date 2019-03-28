import React, { Component } from 'react';
import '../App.css';
import * as ResultsActions from '../actions/ResultsActions';
import history from '../history';
 
class ResultsTableHeader extends Component {

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-1"></div>
                        <div className="col-md-10 col-sm-10">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-5">
                                            Name: {this.props.name} <br></br>
                                            Length: {this.props.seq.length} <br></br>
                                            Number of quadruplexes found: {this.props.length}
                                        </div>
                                        <div className="col-md-6 table-results-buttons">
                                            <button type="button" className="btn btn-info btn-padding" onClick={() => {history.push(`/resultsGraph/${this.props.jobId}/${this.props.id}`);}}>Show graph</button>
                                            <div className="dropdown">
                                                <button className="btn btn-info dropdown-toggle btn-padding" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    Export result as...
                                                </button>
                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                    <button className="dropdown-item" onClick={() => ResultsActions.exportGff(this.props.id)}>.gff</button>
                                                    <button className="dropdown-item" onClick={() => ResultsActions.exportCsv(this.props.id)}>.csv</button>
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

export default ResultsTableHeader;
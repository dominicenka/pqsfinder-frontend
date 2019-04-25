import React, { Component } from 'react';
import '../App.css';
import * as ResultsActions from '../actions/ResultsActions';
 
class ResultsTableHeader extends Component {

    render() {
        return (
            <div className="card results-header">
            <h2>{this.props.name}</h2>
                <div className="card-body result-table-header">
                        <div className="">
                            Length: {this.props.seq.length} <br></br>
                            Quadruplexes found: {this.props.length}
                        </div>
                        <div className="table-results-buttons">
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
        );
    }
}

export default ResultsTableHeader;
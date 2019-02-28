import React, { Component } from 'react';
import '../App.css';
import * as ResultsActions from '../actions/ResultsActions';
 
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
                                            Sequence name: {this.props.id} <br></br>
                                            Number of quadruplexes found: {this.props.length}<br></br>
                                            Input sequence length: {this.props.seq.length}
                                        </div>
                                        <div className="col-md-6 table-results-buttons">
                                            <button type="button" className="btn btn-info btn-padding" onClick={() => {}}>Show graph</button>
                                            <div className="dropdown">
                                                <button className="btn btn-info dropdown-toggle btn-padding" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    Export result as...
                                                </button>
                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                    <a className="dropdown-item" href="#" onClick={() => ResultsActions.exportGff(this.props.id)}>.gff</a>
                                                    <a className="dropdown-item" href="#" onClick={() => ResultsActions.exportCsv(this.props.id)}>.csv</a>
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
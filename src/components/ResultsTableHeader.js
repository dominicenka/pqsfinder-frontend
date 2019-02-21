import React, { Component } from 'react';
import '../App.css';
 
class ResultsTableHeader extends Component {
    constructor(props) {
        super(props);
    }

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
                                            Job ID: {this.props.id} <br></br>
                                            Number of quadruplexes found: {this.props.length}<br></br>
                                            Input sequence length: {this.props.seq.length}
                                        </div>
                                        <div className="col-md-6 table-results-buttons">
                                            <button type="button" className="btn btn-info btn-padding-opt" onClick={() => {}}>Show graph</button>
                                            <button type="button" className="btn btn-info btn-padding-opt" onClick={() => {}}>Export results as..</button>
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
import React, { Component } from 'react';
import '../App.css';
 
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
                                            <button type="button" className="btn btn-info btn-padding-opt" onClick={() => {}}>Export all results as..</button>
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
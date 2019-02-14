import React, { Component } from 'react';
import Options from '../components/Options';
import DNAInput from '../components/DNAInput';
import '../App.css';

import * as SubjectActions from '../actions/SubjectActions';

class Analyze extends Component {
    render() {
        return (
            <div className="body container">
                <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-md-10 col-sm-10">
                        <div className="card">
                            <div className="card-body">
                                <DNAInput />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-1"></div>
                </div>
                <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-md-10 col-sm-10">
                        <div className="card">
                            <div className="card-body">
                                <Options />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-5"></div>
                    <button type="button" className="btn btn-analyze btn-lg " onClick={() => SubjectActions.analyze()}>Analyze</button>
                    <div className="col-sm-5"></div>
                </div>
            </div>
        )
    }
}

export default Analyze;
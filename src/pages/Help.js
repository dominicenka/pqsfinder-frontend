import React, { Component } from 'react';
import '../App.css';
import './Help.css';

const optsImg = '/images/pqs_constraints.svg';

class Help extends Component {
    render(){
        return <div className="body">
        <div className="help-wrapper">
            <h1>Help</h1>
                <div className="question">
                        <p className="h">How to use pqsfinder</p>
                        <p className="text">
                            Pqsfinder is a tool for detection of potential G-quadruplex (G4) forming sequences that utilizes
                            <a href="https://bioconductor.org/packages/release/bioc/html/pqsfinder.html"> the pqsfinder package</a>, 
                            which is able to detect sequences responsible for G4s 
                            folded from  imperfect G-runs containing bulges or mismatches.
                        </p>
                </div>
                <div className="question">
                        <p className="h">Job ID</p>
                        <p className="text">
                            After submitting a sequence to be analyzed, you will receive a job ID, representing the ID of your results. 
                            You can use this ID in the search box in navigation bar to access old results.
                        </p>
                </div>
                <div className="question">
                        <p className="h">Search options</p>
                        <div className="text">
                            Pqsfinder is designed to be highly customizable. Listed bellow are all the options that 
                            can be changed by a user. <br></br>
                            <div className="img-wrapper"><img src={optsImg} alt="options explained" className="optsImg"></img></div>
                            <div className="flex"> 
                                <span className="opt">Maximum  length </span> <p>- Maximum PQS length. Minimum value is 1, maximum  100.</p>
                            </div>
                            <div className="flex">
                                <span className="opt">Minimum score</span>
                                <p>- Minimum  PQS score. Minimum value is 1.</p>
                            </div>
                            <div className="flex">
                                <span className="opt">Strand</span>
                                <p>- Strand specification. Allowed values are '+', '-' or both strands. When none strand is specified, the value is set to '+'.</p>
                            </div>
                            <div className="flex">
                                <span className="opt">Maximum  defects</span>
                                <p>-  Maximum number of defects in total (bulges & mismatches). Minimum value is 0, maximum  3.</p>
                            </div>
                            <div className="flex">
                                <span className="opt">Maximum  bulges</span>
                                <p>
                                - Maximum number of runs with bulge. Minimum value is 0, maximum  3.
                                </p>
                            </div>
                            <div className="flex">
                                <span className="opt">Maximum  mismatches</span>
                                <p>
                                - Maximum number of runs with mismatch. Minimum value is 0, maximum  3.
                                </p>
                            </div>
                            <div className="flex">
                                <span className="opt">Minimum loop length</span>
                                <p>- Minimum  length of quadruplex loop. At most one loop can have zero length. Minimum value is 0.</p>
                            </div>
                            <div className="flex">
                                <span className="opt">Maximum  loop length</span>
                                Maximum length of quadruplex loop. Minimum value is 0.
                            </div>
                            <div className="flex">
                                <span className="opt">Minimum run length</span>
                                <p>- Minimum  length of quadruplex run. Minimum value is 2.</p>
                            </div>
                            <div className="flex">
                                <span className="opt">Maximum  run length</span>
                                <p>- Maximum length of quadruplex run. Minimum value is 2.</p>
                            </div>
                        </div>
                </div>
                <div className="question">
                        <p className="h">Results export</p>
                        <p className="text">
                            Pqsfinder provides export of results in <b>gff</b> and <b>csv</b> formats.
                        </p>
                </div>
            </div>
        </div>
    }
}

export default Help;
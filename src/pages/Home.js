import React, { Component } from 'react';
import '../App.css';
import history from '../history';

class Home extends Component {
    render(){
        return (
        <div className="body">
            <div className="row">
                <div className="col-sm-2 col-md-2"></div>
                <div className="col-sm-5 col-md-5">
                    <div className="card ">
                        <div className="card-header text-center"><h5>About pqsfinder</h5></div>
                        <div className="card-body">
                            <p className="card-text">
                            The main functionality of pqsfinder is to provide users with simple tool for detection of DNA  
                            sequence patterns that are likely to fold into an intramolecular G-quadruplex (G4).
                            G4 is a DNA structure that can  form as an alternative to the canonical B-DNA. G4s are 
                            believed to be  involved in regulation of diverse biological processes, such as telomere  
                            maintenance, DNA replication, chromatin formation, transcription,  recombination or mutation 
                            (Maizels and Gray 2013; Kejnovsky, Tokan, and Lexa 2015). For detection, pqsfinder utilizes
                            <a href="https://bioconductor.org/packages/release/bioc/html/pqsfinder.html"> the pqsfinder package</a>, 
                            that is able to detect sequences responsible for G4s 
                            folded from  imperfect G-runs containing bulges or mismatches and as such is more  sensitive 
                            than competing algorithms.</p>
                        </div>
                    </div>
                </div>
                <div className="col-sm-3 col-md-3">
                        <div className="home-analyze-wrapper">
                            <button className="home-analyze" onClick={() => history.push('/analyze')}>
                                ANALYZE A SEQUENCE
                            </button>
                        </div>
                </div>
                <div className="col-sm-2 col-md-2"></div>
            </div>
            <div className="row">
                <div className="col-sm-2 col-md-2"></div>
                <div className="col-sm-8">
                    <div className="card ">
                    <div className="card-header text-center"><h5>Citation</h5></div>
                        <div className="card-body">
                            <p className="card-text"> Hon J, Martinek T, Zendulka J, Lexa M (2017). “pqsfinder: an exhaustive and imperfection-tolerant
                                search tool for potential quadruplex-forming sequences in R.” Bioinformatics, 33(21), 3373-3379. 
                                doi: 10.1093/bioinformatics/btx413.  </p>
                        </div>
                    </div>
                </div>
                <div className="col-sm-2 col-md-2"></div>
            </div>
        </div>)
    }
}

export default Home;
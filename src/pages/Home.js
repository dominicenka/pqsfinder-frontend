import React, { Component } from 'react';
import '../App.css';

class Home extends Component {
    render(){
        return (
        <div className="body">
            <div className="row">
                <div className="col-sm-1 col-md-1"></div>
                <div className="col-sm-10 col-md-5">
                    <div className="card ">
                        <div className="card-header text-center"><h5>About pqsfinder</h5></div>
                        <div className="card-body">
                            {/* <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                            <p className="card-text">The main functionality of the pqsfinder  package is to detect
                                DNA sequence patterns that are likely to fold into  an intramolecular G-quadruplex (G4).
                                G4 is a DNA structure that can  form as an alternative to the canonical B-DNA. G4s are 
                                believed to be  involved in regulation of diverse biological processes, such as telomere  
                                maintenance, DNA replication, chromatin formation, transcription,  recombination or mutation 
                                (Maizels and Gray 2013; Kejnovsky, Tokan, and Lexa 2015).  The main idea of our algorithmic 
                                approach is based on the fact that G4  structures arise from compact sequence motifs composed 
                                of four  consecutive and possibly imperfect guanine runs (G-run) interrupted by  loops of
                                semi-arbitrary lengths. The algorithm first identifies four  consecutive G-run sequences.
                                Subsequently, it examines the potential of  such G-runs to form a stable G4 and assigns a 
                                corresponding quantitative  score to each. Non-overlapping potential quadruplex-forming sequences 
                                (PQS) with positive score are then reported.It is important to note that unlike many
                                other approaches, our  algorithm is able to detect sequences responsible for G4s folded 
                                from  imperfect G-runs containing bulges or mismatches and as such is more  sensitive than competing algorithms.</p>
                            {/* <a href="#" className="card-link">Card link</a>
                            <a href="#" className="card-link">Another link</a> */}
                        </div>
                    </div>
                </div>
                <div className="col-sm-1 col-md-1"></div>
            </div>
            <div className="row">
                <div className="col-sm-1 col-md-1"></div>
                <div className="col-sm-10">
                    <div className="card ">
                    <div className="card-header text-center"><h5>Citation</h5></div>
                        <div className="card-body">
                            <p className="card-text"> Hon J, Martinek T, Zendulka J, Lexa M (2017). “pqsfinder: an exhaustive and imperfection-tolerant
                                search tool for potential quadruplex-forming sequences in R.” Bioinformatics, 33(21), 3373-3379. 
                                doi: 10.1093/bioinformatics/btx413.  </p>
                        </div>
                    </div>
                </div>
                <div className="col-sm-1 col-md-1"></div>
            </div>
        </div>)
    }
}

export default Home;
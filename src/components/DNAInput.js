import React, { Component } from 'react';
import AsyncSelectCustom from './AsyncSelect';
import '../pages/Analyze.css';

import SubjectStore from '../stores/SubjectStore';
import * as SubjectActions from '../actions/SubjectActions';
import NCBIStore from '../stores/NCBIStore';


class DNAInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            input: SubjectStore.getInput(),
            fileSelected: false,
            inputValidation: '',
            inputTitle: 'Enter nucleic acid sequences in FASTA format'
        }

        this.exampleData = ">HSGLTH1 Human theta 1-globin gene\nCCACTGCACTCACCGCACCCGGCCAATTTTTGTGTTTTTAGTAGAGACTAAATACCATATAGTGAACACCTAAGACGGGGGGCCTTGGATCCAGGGCGATTCAGAGGGCCCCGGTCGGAGCTGTCGGAGATTGAGCGCGCGCGGTCCCGGGATCTCCGACGAGGCCCTGGACCCCCGGGCGGCGAAGCTGCGGCGCGGCGCCCCCTGGAGGCCGCGGGACCCCTGGCCGGTCCGCGCAGGCGCAGCGGGGTCGCAGGGCGCGGCGGGTTCCAGCGCGGGGATGGCGCTGTCCGCGGAGGACCGGGCGCTGGTGCGCGCCCTGTGGAAGAAGCTGGGCAGCAACGTCGGCGTCTACACGACAGAGGCCCTGGAAAGGTGCGGCAGGCTGGGCGCCCCCGCCCCCAGGGGCCCTCCCTCCCCAAGCCCCCCGGACGCGCCTCACCCACGTTCCTCTCGCAGGACCTTCCTGGCTTTCCCCGCCACGAAGACCTACTTCTCCCACCTGGACCTGAGCCCCGGCTCCTCACAAGTCAGAGCCCACGGCCAGAAGGTGGCGGACGCGCTGAGCCTCGCCGTGGAGCGCCTGGACGACCTACCCCACGCGCTGTCCGCGCTGAGCCACCTGCACGCGTGCCAGCTGCGAGTGGACCCGGCCAGCTTCCAGGTGAGCGGCTGCCGTGCTGGGCCCCTGTCCCCGGGAGGGCCCCGGCGGGGTGGGTGCGGGGGGCGTGCGGGGCGGGTGCAGGCGAGTGAGCCTTGAGCGCTCGCCGCAGCTCCTGGGCCACTGCCTGCTGGTAACCCTCGCCCGGCACTACCCCGGAGACTTCAGCCCCGCGCTGCAGGCGTCGCTGGACAAGTTCCTGAGCCACGTTATCTCGGCGCTGGTTTCCGAGTACCGCTGAACTGTGGGTGGGTGGCCGCGGGATCCCCAGGCGACCTTCCCCGTGTTTGAGTAAAGCCTCTCCCAGGAGCAGCCTTCTTGCCGTGCTCTCTCGAGGTCAGGACGCGAGAGGAAGGCGC";
        this.getInput = this.getInput.bind(this);
        this.fileReader = new FileReader();
        this.invalidInput = this.invalidInput.bind(this);
        this.getSequence = this.getSequence.bind(this);
    }

    componentWillMount() {
        SubjectStore.on("changeInput", this.getInput);
        SubjectStore.on("invalidInput", this.invalidInput);
        NCBIStore.on("NCBISeqFetched", this.getSequence);
    }

    componentWillUnmount() {
        SubjectStore.removeListener("changeInput", this.getInput);
        SubjectStore.removeListener("invalidInput", this.invalidInput);
    }

    getInput() {
        this.setState({
            input: SubjectStore.getInput(),
        });
        this.setState({inputValidation: '', inputTitle: 'Enter nucleic acid sequences'});
    }

    getSequence() {
        SubjectActions.changeInput(NCBIStore.getSequence());
    }

    invalidInput() {
        this.setState({inputValidation: 'is-invalid', inputTitle: SubjectStore.getError()});
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        SubjectActions.changeInput(value);
    }

    handleFileRead = (e) => {
        const content = this.fileReader.result;
        SubjectActions.changeInput(content);
        this.setState({ fileSelected: true});
    }

    handleFiles(e){
        let file = e.target.files[0];
        this.fileReader.onload = this.handleFileRead;
        this.fileReader.readAsText(file);
    }

    deleteSelectedFile() {
        this.setState({ fileSelected: false});
        this.fileInput.value = null;
        SubjectActions.changeInput('');
    }

    render() { 
        return (
            <div className='input-wrapper'>
                <div className='input-left'>
                    <div className='input-text-div'>
                        <p className="inputText"> Enter nucleic acid sequence in <a href="https://en.wikipedia.org/wiki/FASTA_format">FASTA</a> format or upload a file in FASTA format.</p>
                        <p className="inputText">The size of the input is limited to {process.env.REACT_APP_MAX_BP/1000}k nucleic acids per analysis. For larger analyses, please use the <a href="https://bioconductor.org/packages/release/bioc/html/pqsfinder.html">pqsfinder package</a>.
                        </p>
                    </div>
                    <div className="input-ncbi">
                        <label>Find a sequence from NCBI database: </label>
                        <AsyncSelectCustom/>
                        <label className="extension-label">Extend the sequence: </label>
                        <input placeholder="0" onChange={
                            (e) => NCBIStore.setLength(e.target.value)
                        }></input>
                        <button type="button" className="btn btn-info btn-padding-input"    onClick={() => NCBIStore.fetchSequence()}>
                            Get gene
                            </button>
                    </div>
                    <div className='input'>
                        <textarea className={`form-control ${this.state.inputValidation}`} id="dnaTextInput" rows="10"
                            value={this.state.input} title={this.state.inputTitle}
                            onChange={(e) => this.handleInputChange(e)} />
                    </div>
                    <div className='input-buttons'>
                        <div className='buttons'>
                            <button type="button" className="btn btn-info btn-padding-input" onClick={() => {
                                if (this.state.fileSelected) this.deleteSelectedFile();
                                SubjectActions.changeInput('');
                            }}>Clear input</button>
                            <button type="button" className="btn btn-info btn-padding-input" onClick={() => SubjectActions.changeInput(this.exampleData)}>Example data</button>
                            <form>
                                <input type="file" className="form-control-file" id="file" accept=".fasta" onChange={(e) => this.handleFiles(e)} ref={(input) => { this.fileInput = input; }}/>
                            </form>
                        </div>
                    </div>
                </div>
                <div className='pqsText'>
                    <p className="card-text">
                    Pqsfinder is able to detect G4s folded from imperfect G-runs containing bulges or mismatches or G4s having long loops. Pqsfinder assigns an integer score to each hit that was fitted on G4 sequencing data and corresponds to expected stability of the folded G4.
                    </p>
                    <p className="card-text"><strong>Note:</strong> Although both DNA and RNA sequences can be analysed, the pqsfinder scoring function was trained and validated primarily on DNA sequences.</p>
                </div>
            </div>
        )
    }
}

export default DNAInput;
import React, { Component } from 'react';
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
            inputTitle: 'Enter nucleic acid sequences in FASTA format',
            limits: {}
        };

        this.exampleData = ">HSGLTH1 Human theta 1-globin gene\nCCACTGCACTCACCGCACCCGGCCAATTTTTGTGTTTTTAGTAGAGACTAAATACCATATAGTGAACACCTAAGACGGGGGGCCTTGGATCCAGGGCGATTCAGAGGGCCCCGGTCGGAGCTGTCGGAGATTGAGCGCGCGCGGTCCCGGGATCTCCGACGAGGCCCTGGACCCCCGGGCGGCGAAGCTGCGGCGCGGCGCCCCCTGGAGGCCGCGGGACCCCTGGCCGGTCCGCGCAGGCGCAGCGGGGTCGCAGGGCGCGGCGGGTTCCAGCGCGGGGATGGCGCTGTCCGCGGAGGACCGGGCGCTGGTGCGCGCCCTGTGGAAGAAGCTGGGCAGCAACGTCGGCGTCTACACGACAGAGGCCCTGGAAAGGTGCGGCAGGCTGGGCGCCCCCGCCCCCAGGGGCCCTCCCTCCCCAAGCCCCCCGGACGCGCCTCACCCACGTTCCTCTCGCAGGACCTTCCTGGCTTTCCCCGCCACGAAGACCTACTTCTCCCACCTGGACCTGAGCCCCGGCTCCTCACAAGTCAGAGCCCACGGCCAGAAGGTGGCGGACGCGCTGAGCCTCGCCGTGGAGCGCCTGGACGACCTACCCCACGCGCTGTCCGCGCTGAGCCACCTGCACGCGTGCCAGCTGCGAGTGGACCCGGCCAGCTTCCAGGTGAGCGGCTGCCGTGCTGGGCCCCTGTCCCCGGGAGGGCCCCGGCGGGGTGGGTGCGGGGGGCGTGCGGGGCGGGTGCAGGCGAGTGAGCCTTGAGCGCTCGCCGCAGCTCCTGGGCCACTGCCTGCTGGTAACCCTCGCCCGGCACTACCCCGGAGACTTCAGCCCCGCGCTGCAGGCGTCGCTGGACAAGTTCCTGAGCCACGTTATCTCGGCGCTGGTTTCCGAGTACCGCTGAACTGTGGGTGGGTGGCCGCGGGATCCCCAGGCGACCTTCCCCGTGTTTGAGTAAAGCCTCTCCCAGGAGCAGCCTTCTTGCCGTGCTCTCTCGAGGTCAGGACGCGAGAGGAAGGCGC";
        this.getInput = this.getInput.bind(this);
        this.fileReader = new FileReader();
        this.invalidInput = this.invalidInput.bind(this);
        this.getSequence = this.getSequence.bind(this);
        this.setLimits = this.setLimits.bind(this);
    }

    componentWillMount() {
        SubjectStore.on("changeInput", this.getInput);
        SubjectStore.on("invalidInput", this.invalidInput);
		SubjectStore.on("changeLimits", this.setLimits);
        NCBIStore.on("NCBISeqFetched", this.getSequence);
		SubjectStore.setDefaultLimits();
    }

    componentWillUnmount() {
        SubjectStore.removeListener("changeInput", this.getInput);
        SubjectStore.removeListener("invalidInput", this.invalidInput);
        SubjectStore.removeListener("changeLimits", this.setLimits);
    }

	setLimits() {
		this.setState({
			limits: SubjectStore.getLimits()
        });
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
                        { "max_sequence_len" in this.state.limits ?
                        <p className="inputText">The size of the input is limited to {this.state.limits.max_sequence_len[1]/1000}k nucleotides per analysis. For larger analyses, please use the <a href="https://bioconductor.org/packages/release/bioc/html/pqsfinder.html">pqsfinder package</a>.
                        </p>
                        : ''}
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
                    The pqsfinder web application predicts potential G4s folded from imperfect G-runs containing bulges or mismatches or G4s having long loops. It uses the most recent <a href="https://bioconductor.org/packages/release/bioc/html/pqsfinder.html" target="_blank" rel="noopener noreferrer">pqsfinder package</a> that uses easy-interpretable scoring function fitted on G4 sequencing data to estimate the stability of the G4.</p>
                    <p className="card-text">Both DNA and RNA sequences are supported. However, the pqsfinder scoring function was trained and validated primarily on DNA sequences. More details can be found in <a href="https://dx.doi.org/10.1093/bioinformatics/btx413" target="_blank" rel="noopener noreferrer">Hon et al. 2017</a>.</p>
                </div>
            </div>
        )
    }
}

export default DNAInput;
import React, { Component } from 'react';
import '../pages/Analyze.css';

import SubjectStore from '../stores/SubjectStore';
import * as SubjectActions from '../actions/SubjectActions';

class DNAInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            input: SubjectStore.getInput(),
            fileSelected: false,
            inputValidation: '',
            inputTitle: 'Enter nucleotide sequences'
        }

        this.exampleData = ">fasta format3 \nCCCCCCGGGTGGGTGGGTGGTAAAACCCCCCGGGTGGGTGGGTGGTAAAACCCCCCGGGTGGGTGGGTGGTAAAA";
        this.getInput = this.getInput.bind(this);
        this.fileReader = new FileReader();
        this.invalidInput = this.invalidInput.bind(this);
    }

    componentWillMount() {
        SubjectStore.on("changeInput", this.getInput);
        SubjectStore.on("invalidInput", this.invalidInput);
    }

    componentWillUnmount() {
        SubjectStore.removeListener("changeInput", this.getInput);
        SubjectStore.removeListener("invalidInput", this.invalidInput);
    }

    getInput() {
        this.setState({
            input: SubjectStore.getInput(),
        });
        this.setState({inputValidation: '', inputTitle: 'Enter nucleotide sequences'});
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
                        <p className="inputText"> Enter nucleotide sequence in <a href="https://en.wikipedia.org/wiki/FASTA_format">FASTA</a> format or choose a file which contains sequences in FASTA format.
                            <br></br>
                        </p>
                    </div>
                    <div className='input'>
                        <textarea className={`form-control ${this.state.inputValidation}`} id="dnaTextInput" rows="10"
                            value={this.state.input} title={this.state.inputTitle}
                            onChange={(e) => this.handleInputChange(e)} />
                    </div>
                    <div className='input-buttons'>
                        <div className='col-md-5'>
                            <button type="button" className="btn btn-info btn-padding-input" onClick={() => {
                                if (this.state.fileSelected) this.deleteSelectedFile();
                                SubjectActions.changeInput('');
                            }}>Clear input</button>
                            <button type="button" className="btn btn-info btn-padding-input" onClick={() => SubjectActions.changeInput(this.exampleData)}>Example data</button>
                        </div>
                        <div className='col-md-6'>
                            <form>
                                <input type="file" className="form-control-file" id="file" accept=".fasta" onChange={(e) => this.handleFiles(e)} ref={(input) => { this.fileInput = input; }}/>
                            </form>
                        </div>
                    </div>
                </div>
                <div className='pqsText'>
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
        )
    }
}

export default DNAInput;
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

        this.exampleData = ">fasta format 3 \nCCCCCCGGGTGGGTGGGTGGTAAAACCCCCCGGGTGGGTGGGTGGTAAAACCCCCCGGGTGGGTGGGTGGTAAAA";
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
            <div>
                <div className='row'>
                    <div className='col-md-8'>
                        <textarea className={`form-control ${this.state.inputValidation}`} id="dnaTextInput" rows="10"
                            value={this.state.input} title={this.state.inputTitle}
                            onChange={(e) => this.handleInputChange(e)} />
                    </div>
                    <div className='col-md-4'>
                        <p> Enter nucleotide sequence in <a href="https://en.wikipedia.org/wiki/FASTA_format">FASTA</a> format or choose a file which contains sequences in FASTA format.
                            <br></br>
                        </p>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-5'>
                        <button type="button" className="btn btn-info btn-padding-input" onClick={() => SubjectActions.changeInput('')}>Clear input</button>
                        <button type="button" className="btn btn-info btn-padding-input" onClick={() => SubjectActions.changeInput(this.exampleData)}>Example data</button>
                    </div>
                    <div className='col-md-4'>
                        <form>
                            <input type="file" className="form-control-file" id="file" accept=".fasta" onChange={(e) => this.handleFiles(e)} ref={(input) => { this.fileInput = input; }}/>
                        </form>
                    </div>
                    <div className='col-md-1'>
                        {this.state.fileSelected ? <button type="button" className="btn btn-danger btn-sm" onClick={() => this.deleteSelectedFile()}>X</button> : null}
                    </div>
                </div>
            </div>
        )
    }
}

export default DNAInput;
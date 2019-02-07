import React, { Component } from 'react';
import '../pages/Analyze.css';

class DNAInput extends Component {

    constructor(props) {
        super(props);

        this.state={
            dnaString: ''
        }

        this.exampleData="ATGGGTGGGAGGGCGGG";
    }

    render() {
        return (
            <div>
                <div className='row'>
                    <div className='col-md-8'>
                        <textarea class="form-control" id="dnaTextInput" rows="10" 
                            value={this.state.dnaString}
                            onChange={(obj) => this.setState({dnaString: obj.value})}/>
                    </div>
                    <div className='col-md-4'>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit,
                            vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus,
                            ac blandit elit tincidunt id. Sed rhoncus, tortor sed eleifend tristique,
                            tortor mauris molestie elit, et lacinia ipsum quam nec dui. Quisque nec 
                            </p>
                        <div className='row'>
                        <form>
                            <input type="file" class="form-control-file" id="file"/>
                        </form>
                        </div>
                    </div>
                </div>
                <div>
                    <button type="button" className="btn btn-info btn-padding" onClick={() => this.setState({dnaString: ''})}>Clear input</button>
                    <button type="button" className="btn btn-info btn-padding" onClick={() => this.setState({dnaString: this.exampleData})}>Example data</button>
                </div>
            </div>
        )
    }
}

export default DNAInput;
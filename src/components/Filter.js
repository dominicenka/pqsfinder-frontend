import React, { Component } from 'react';
import '../pages/Analyze.css';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import HelpTooltip from './HelpTooltip';

class Filter extends Component {

    constructor(props) {
        super(props);

        this.defaultOpts = {
            maxLength: 50,
            minScore: 26,
            strandSense: true,
            strandAnti: true,
            minLL: 0,
            maxLL: 30,
            maxNB: 3,
            maxNM: 3,
            maxND: 3
        }

        this.state={
            advOpts: false,
            opts: this.defaultOpts,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    advOpts() {
        const {advOpts} = this.state;
        return advOpts ? 
        <div>
            <CSSTransition
                in={true}
                appear={true}
                timeout={300}
                classNames="fade"
            >
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <HelpTooltip />
                        <label htmlFor='maxLength'>Min loop length</label>
                        <input type='number' min='0' className='form-control' id='minLL' value={this.state.opts.minLL} onChange={this.handleInputChange}></input>
                    </div>
                    <div className="col-md-6">
                        <HelpTooltip />
                        <label htmlFor='minScore'>Max loop length</label>
                        <input type='number' min='0' className='form-control' id='maxLL' value={this.state.opts.maxLL} onChange={this.handleInputChange}></input>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-md-4">
                        <HelpTooltip />
                        <label htmlFor='minScore'>Max bulges</label>
                        <input type='number' min='0' className='form-control' id='maxNB' value={this.state.opts.maxNB} onChange={this.handleInputChange}></input>
                    </div>
                    <div className="col-md-4">
                        <HelpTooltip />
                        <label htmlFor='minScore'>Max mismatches</label>
                        <input type='number' min='0' className='form-control' id='maxNM' value={this.state.opts.maxNM} onChange={this.handleInputChange}></input>
                    </div>
                    <div className="col-md-4">
                        <HelpTooltip />
                        <label htmlFor='minScore'>Max defects</label>
                        <input type='number' min='0' className='form-control' id='maxND' value={this.state.opts.maxND} onChange={this.handleInputChange}></input>
                    </div>
                </div>
            </div>
        </CSSTransition></div> : null;
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.id;

        this.setState((state) => ({
            opts: {
                ...state.opts,
                [name]: value
            }
        }));
    }

    render() {

        return (
            <div>
                <form>
                    <div className="row">
                        <div className="col-md-4">
                            <HelpTooltip />
                            <label htmlFor='maxLength'>Max length</label>
                            <input type='number' min='0' className='form-control' id='maxLength' value={this.state.opts.maxLength} onChange={this.handleInputChange}></input>
                        </div>
                        <div className="col-md-4">
                            <HelpTooltip />
                            <label htmlFor='minScore'>Min score</label>
                            <input type='number' min='0' className='form-control' id='minScore' value={this.state.opts.minScore} onChange={this.handleInputChange}></input>
                        </div>
                        <div className="col-md-4">
                            <HelpTooltip />
                            <label >Strand</label> <br></br>
                            <div className='strands'>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" id="strandSense" value="strandSense" checked={this.state.opts.strandSense} onChange={this.handleInputChange}/>
                                    <label className="form-check-label" htmlFor="sense">+</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" id="strandAnti" value="strandAnti" checked={this.state.opts.strandAnti} onChange={this.handleInputChange}/>
                                    <label className="form-check-label" htmlFor="antisense">-</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.advOpts()}
                </form>
                <div className='row'>
                    <div className='col-md-9'></div>
                    <div className='col-md-3'>
                        <button type="button" className="btn btn-info btn-padding" onClick={() => this.setState({opts: this.defaultOpts})}>Default values</button>
                        <button type="button" className="btn btn-info btn-padding" onClick={() => this.setState((state) => ({advOpts: !state.advOpts}))}>Advanced options</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Filter;
import React, { Component } from 'react';
import '../pages/Analyze.css';
import { CSSTransition} from "react-transition-group";
import HelpTooltip from './HelpTooltip';

import SubjectStore from '../stores/SubjectStore';
import * as SubjectActions from '../actions/SubjectActions';

const optsImg = '/images/options.png';

class Options extends Component {

    constructor(props) {
        super(props);

        this.state = {
            advOpts: false,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.getOpts = this.getOpts.bind(this);
    }

    componentWillMount() {
        SubjectStore.on("changeOpt", this.getOpts);

        SubjectStore.setDefaultOpts();
    }

    componentWillUnmount() {
        SubjectStore.removeListener("changeOpt", this.getOpts);
    }


    getOpts() {
        this.setState({
            opts: SubjectStore.getOpts(),
        });
    }

    advOpts() {
        const { advOpts } = this.state;
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
                            <div className="col">
                                <HelpTooltip content={
                                <div>
                                    Minimal length of quadruplex loop. At most one loop can have zero length.
                                </div>
                            }/>
                                <label htmlFor='minLL'>Min loop length</label>
                                <input type='number' min='0' className='form-control opt' id='minLL' value={this.state.opts.minLL} onChange={this.handleInputChange}></input>
                            </div>
                            <div className="col">
                                <HelpTooltip content={
                                <div>
                                    Maximal length of quadruplex loop.
                                </div>
                            }/>
                                <label htmlFor='maxLL'>Max loop length</label>
                                <input type='number' min='1' className='form-control opt' id='maxLL' value={this.state.opts.maxLL} onChange={this.handleInputChange}></input>
                            </div>
                            <div className="col">
                                <HelpTooltip content={
                                <div>
                                    Maximal number of runs with bulge.
                                </div>
                            }/>
                                <label htmlFor='maxNB'>Max bulges</label>
                                <input type='number' min='0' max='3' className='form-control opt' id='maxNB' value={this.state.opts.maxNB} onChange={this.handleInputChange}></input>
                            </div>
                            <div className="col">
                                <HelpTooltip content={
                                <div>
                                    Maximal number of runs with mismatch.
                                </div>
                            }/>
                                <label htmlFor='maxNM'>Max mismatches</label>
                                <input type='number' min='0' max='3' className='form-control opt' id='maxNM' value={this.state.opts.maxNM} onChange={this.handleInputChange}></input>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <HelpTooltip content={
                                <div>
                                   Minimal length of quadruplex run.
                                </div>
                            }/>
                                <label htmlFor='minRL'>Min run length</label>
                                <input type='number' min='0' className='form-control opt' id='minRL' value={this.state.opts.minRL} onChange={this.handleInputChange}></input>
                            </div>
                            <div className="col-md-3">
                                <HelpTooltip content={
                                <div>
                                    Maximal length of quadruplex run.
                                </div>
                            }/>
                                <label htmlFor='maxRL'>Max run length</label>
                                <input type='number' min='1' className='form-control opt' id='maxRL' value={this.state.opts.maxRL} onChange={this.handleInputChange}></input>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <img src={optsImg} alt="options explained" className="optsImg"></img>
                            </div>
                        </div>
                    </div>
                </CSSTransition></div> : null;
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : Number(target.value);
        const name = target.id;

        SubjectActions.changeOptValue(name, value);
    }

    render() {

        return (
            <div>
                <form>
                    <div className="row">
                        <div className="col">
                            <HelpTooltip content={
                                <div>
                                    Maximal lenth of PQS.
                                </div>
                            }/>
                            <label htmlFor='maxLength'>Max length</label>
                            <input type='number' min='0' max='100' className='form-control opt' id='maxLength' value={this.state.opts.maxLength} onChange={this.handleInputChange}></input>
                        </div>
                        <div className="col">
                            <HelpTooltip content={
                                <div>
                                    Minimal PQS score.
                                </div>
                            }/>
                            <label htmlFor='minScore'>Min score</label>
                            <input type='number' min='0' className='form-control opt' id='minScore' value={this.state.opts.minScore} onChange={this.handleInputChange}></input>
                        </div>
                        <div className="col">
                            <HelpTooltip content={
                                <div>
                                    Strand specification. Allowed values are "+", "-" or both strands. <br/>
                                    Implicitly, the input DNAString object is assumed to encode the "+" strand.
                                </div>
                            }/>
                            <label >Strand</label> <br></br>
                            <div className='strands'>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" id="strandSense" value="strandSense" checked={this.state.opts.strandSense} onChange={this.handleInputChange} />
                                    <label className="form-check-label" htmlFor="sense">+</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" id="strandAnti" value="strandAnti" checked={this.state.opts.strandAnti} onChange={this.handleInputChange} />
                                    <label className="form-check-label" htmlFor="antisense">-</label>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <HelpTooltip content={
                                <div>
                                    Maximum number of defects in total (max_bulges + max_mismatches).
                                </div>
                            }/>
                            <label htmlFor='maxND'>Max defects</label>
                            <input type='number' min='0' max='3' className='form-control opt' id='maxND' value={this.state.opts.maxND} onChange={this.handleInputChange}></input>
                        </div>
                    </div>
                    {this.advOpts()}
                </form>
                <div className='row'>
                    <div className='col-md-6'></div>
                    <div className='col-md-6'>
                        <div className="opt-btns">
                            <button type="button" className="btn btn-info btn-padding-opt" onClick={() => SubjectStore.setDefaultOpts()}>Default values</button>
                            <button type="button" className="btn btn-info btn-padding-opt" onClick={() => this.setState((state) => ({ advOpts: !state.advOpts }))}>Advanced options</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Options;
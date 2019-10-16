import React, { Component } from 'react';
import '../pages/Analyze.css';
import { CSSTransition} from "react-transition-group";
import HelpTooltip from './HelpTooltip';

import SubjectStore from '../stores/SubjectStore';
import * as SubjectActions from '../actions/SubjectActions';

const optsImg = '/images/options.svg';

class Options extends Component {

    constructor(props) {
        super(props);

        this.state = {
            advOpts: false,
            limits: {}
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.getOpts = this.getOpts.bind(this);
        this.setLimits = this.setLimits.bind(this);
    }

    componentWillMount() {
        SubjectStore.on("changeOpt", this.getOpts);
		SubjectStore.on("changeLimits", this.setLimits);

        SubjectStore.setDefaultOpts();
    }

    componentWillUnmount() {
        SubjectStore.removeListener("changeOpt", this.getOpts);
        SubjectStore.removeListener("changeLimits", this.setLimits);
    }

	setLimits() {
		this.setState({
			limits: SubjectStore.getLimits()
        });
	}

    getOpts() {
        this.setState({
            opts: SubjectStore.getOpts(),
        });
    }

    getLimit(name, i) {
        if ("loop_min_len" in this.state.limits && this.state.limits[name][i] !== "NA") {
            return this.state.limits[name][i];
        } else {
            return undefined;
        }
    }

    getMinLimit(name) {
        return this.getLimit(name, 0);
    }

    getMaxLimit(name) {
        return this.getLimit(name, 1);
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
                                <label htmlFor='loop_min_len'>Min loop length</label>
                                <input type='number' min={this.getMinLimit("loop_min_len")} max={this.getMaxLimit("loop_min_len")} className='form-control opt' id='loop_min_len' value={this.state.opts.loop_min_len} onChange={this.handleInputChange}></input>
                            </div>
                            <div className="col">
                                <HelpTooltip content={
                                <div>
                                    Maximal length of quadruplex loop.
                                </div>
                            }/>
                                <label htmlFor='loop_max_len'>Max loop length</label>
                                <input type='number' min={this.getMinLimit("loop_max_len")} max={this.getMaxLimit("loop_max_len")} className='form-control opt' id='loop_max_len' value={this.state.opts.loop_max_len} onChange={this.handleInputChange}></input>
                            </div>
                            <div className="col">
                                <HelpTooltip content={
                                <div>
                                    Maximal number of runs with bulge.
                                </div>
                            }/>
                                <label htmlFor='max_bulges'>Max bulges</label>
                                <input type='number' min={this.getMinLimit("max_bulges")} max={this.getMaxLimit("max_bulges")} className='form-control opt' id='max_bulges' value={this.state.opts.max_bulges} onChange={this.handleInputChange}></input>
                            </div>
                            <div className="col">
                                <HelpTooltip content={
                                <div>
                                    Maximal number of runs with mismatch.
                                </div>
                            }/>
                                <label htmlFor='max_mismatches'>Max mismatches</label>
                                <input type='number' min={this.getMinLimit("max_mismatches")} max={this.getMaxLimit("max_mismatches")} className='form-control opt' id='max_mismatches' value={this.state.opts.max_mismatches} onChange={this.handleInputChange}></input>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <HelpTooltip content={
                                <div>
                                   Minimal length of quadruplex run.
                                </div>
                            }/>
                                <label htmlFor='run_min_len'>Min run length</label>
                                <input type='number' min={this.getMinLimit("run_min_len")} max={this.getMaxLimit("run_min_len")} className='form-control opt' id='run_min_len' value={this.state.opts.run_min_len} onChange={this.handleInputChange}></input>
                            </div>
                            <div className="col-3">
                                <HelpTooltip content={
                                <div>
                                    Maximal length of quadruplex run.
                                </div>
                            }/>
                                <label htmlFor='run_max_len'>Max run length</label>
                                <input type='number' min={this.getMinLimit("run_max_len")} max={this.getMaxLimit("run_max_len")} className='form-control opt' id='run_max_len' value={this.state.opts.run_max_len} onChange={this.handleInputChange}></input>
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
                <h3>Options</h3>
                <form>
                    <div className="row">
                        <div className="col">
                            <HelpTooltip content={
                                <div>
                                    Maximal lenth of PQS.
                                </div>
                            }/>
                            <label htmlFor='max_len'>Max length</label>
                            <input type='number' min={this.getMinLimit("max_len")} max={this.getMaxLimit("max_len")} className='form-control opt' id='max_len' value={this.state.opts.max_len} onChange={this.handleInputChange}></input>
                        </div>
                        <div className="col">
                            <HelpTooltip content={
                                <div>
                                    Minimal PQS score.
                                </div>
                            }/>
                            <label htmlFor='min_score'>Min score</label>
                            <input type='number' min={this.getMinLimit("min_score")} max={this.getMaxLimit("min_score")} className='form-control opt' id='min_score' value={this.state.opts.min_score} onChange={this.handleInputChange}></input>
                        </div>
                        <div className="col">
                            <HelpTooltip content={
                                <div>
                                    Strand specification. Allowed values are '+', '-' or both strands. <br/>
                                    Implicitly, the input DNAString object is assumed to encode the '+' strand.
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
                            <label htmlFor='max_defects'>Max defects</label>
                            <input type='number' min={this.getMinLimit("max_defects")} max={this.getMaxLimit("max_defects")} className='form-control opt' id='max_defects' value={this.state.opts.max_defects} onChange={this.handleInputChange}></input>
                        </div>
                    </div>
                    {this.advOpts()}
                </form>
                <div className=''>
                        <div className="opt-btns">
                            <button type="button" className="btn btn-info btn-padding-opt" onClick={() => SubjectStore.setDefaultOpts()}>Default values</button>
                            <button type="button" className="btn btn-info btn-padding-opt" onClick={() => this.setState((state) => ({ advOpts: !state.advOpts }))}>Advanced options</button>
                        </div>
                </div>
            </div>
        )
    }
}

export default Options;
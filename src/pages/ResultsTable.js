import React, { Component } from 'react';
import '../App.css';
import ResultsTableHeader from '../components/ResultsTableHeader';
import ResultsTableTable from '../components/ResultsTableTable';
import ResultsHeader from '../components/ResultsHeader';

import * as ResultsActions from '../actions/ResultsActions';
import ResultsStore from '../stores/ResultsStore';
import Loader from '../components/Loader';
import Utils from '../utils';
import Graph from '../components/Graph';
import * as d3 from "d3";

class ResultsTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeStrands: ["sense", "antisense"],
        };

        this.getResults = this.getResults.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
    }

    componentWillMount() {
        ResultsStore.on("fetched", this.getResults);
    }

    componentWillUnmount() {
        ResultsStore.removeListener("fetched", this.getResults);
    }

    getResults() {
        this.setState({results: ResultsStore.getResults()});
    }

    handleInvalid() {
        //this.props.history.push("/");
    }

    computeData(data) {
        let activeStrands = this.state.activeStrands;
        let newData = [];
        data.forEach(val => {
            let strand = val.strand === "+" ? "sense" : "antisense";
            if (!activeStrands.includes(strand)) return;
            val.start = Number(val.start);
            val.end = Number(val.end);
            val.score = Number(val.score);
            newData.push(val);
        });
        return newData;
    }

    handleStrandChange(strand) {
        let {activeStrands} = this.state;
        let idx = activeStrands.indexOf(strand);
        if (idx <= -1)
            this.setState({
                activeStrands: [...activeStrands, strand]
            })
        else {
            activeStrands.splice(idx, 1);
            this.setState({
                activeStrands: activeStrands
            })
        };
    }

    renderTables(results,activeStrands) {
        let tables = [];
        let idx = 0;
        //console.log(this.state.results);
        for (let[key, value] of Object.entries(results)) {
            //console.log(key, value);
            if(key === 'id') continue;
            // let data = this.formatQuadruplexes(results[key].data);
            tables.push(<ResultsTableHeader 
                            length={value.data.length} 
                            key={'header'+key} 
                            id={key} 
                            name={value.name} 
                            seq={value.seq} 
                            jobId={this.props.location.pathname.slice(this.props.location.pathname.lastIndexOf('/') + 1)}/>);
            tables.push(<Graph 
                            idx={++idx} 
                            key={'graph'+key} 
                            results={results[key]} 
                            data={this.computeData(results[key].data)} 
                            activeStrands={activeStrands} 
                            onStrandChange={(strand) => this.handleStrandChange(strand)}
                            handleRectClick={() => this.handleRectClick()}/>)
            tables.push(<ResultsTableTable 
                            data={this.formatQuadruplexes(results[key].data)} 
                            key={'table'+key}/>);
        }
        return tables;
    }

    handleRectClick() {
    }

    formatQuadruplexes(data) {
        console.log(data);
        if (typeof(data[0].quadruplex) !== "string") return data;
        data.map(quad => {
            // quad.quadruplex = <span className="blue">{quad.quadruplex}</span>
            const { rl1, rl2, rl3, ll1, ll2, ll3, nb, nm } = quad;
            const wholeQuad = quad.quadruplex;
            const run1 = quad.quadruplex.slice(0, rl1);
            let pos = rl1;
            const loop1 = quad.quadruplex.slice(pos, pos + ll1);
            pos += ll1;
            const run2 = quad.quadruplex.slice(pos, pos + rl2);
            pos += rl2;
            const loop2 = quad.quadruplex.slice(pos, pos + ll2);
            pos += ll2;
            const run3 = quad.quadruplex.slice(pos, pos + rl3);
            pos += rl3;
            const loop3 = quad.quadruplex.slice(pos, pos + ll3);
            pos += ll3;
            const run4 = quad.quadruplex.slice(pos);
            // console.log({wholeQuad, run1, loop1, run2, loop2, run3, loop3, run4, nm, nb});
            let formatted = <span className="quadruplex-text">
                <span className="orange">{run1}</span>
                <span className="blue">{loop1}</span>
                <span className="orange">{run2}</span>
                <span className="blue">{loop2}</span>
                <span className="orange">{run3}</span>
                <span className="blue">{loop3}</span>
                <span className="orange">{run4}</span>
            </span>;
            quad.quadruplex = formatted;
            return quad
        });
        return data;
    }

    render(){
        let results = this.state.results || ResultsStore.getResults();
        let activeStrands = this.state.activeStrands
        if (Utils.isEmpty(results)) ResultsActions.fetchResults(this.props.location.pathname.slice(this.props.location.pathname.lastIndexOf('/') + 1));
        return (!Utils.isEmpty(results)) ? 
        (<div>
            <div className="body">
                <h1>Results</h1>
                <ResultsHeader id={results.id}/>
                {this.renderTables(results, activeStrands)}
            </div>
        </div>) : <div className="loading"><Loader/></div>;
    }
}

export default ResultsTable;
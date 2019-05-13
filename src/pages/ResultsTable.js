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

class ResultsTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeStrands: ["sense", "antisense"],
        };

        this.getResults = this.getResults.bind(this);
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
        for (let[key, value] of Object.entries(results)) {
            if(key === 'id') continue;
            // let data = this.formatQuadruplexes(results[key].data);
            tables.push(<ResultsTableHeader 
                            length={value.data.length} 
                            key={'header'+key} 
                            id={key} 
                            name={value.name} 
                            seq={value.seq} 
                            jobId={this.props.location.pathname.slice(this.props.location.pathname.lastIndexOf('/') + 1)}/>);
            if(value.data.length) tables.push(<Graph 
                            idx={++idx} 
                            key={'graph'+key} 
                            results={results[key]} 
                            data={this.computeData(results[key].data)} 
                            activeStrands={activeStrands} 
                            onStrandChange={(strand) => this.handleStrandChange(strand)}
                            handleRectClick={() => this.handleRectClick()}/>)
            if(value.data.length) tables.push(<ResultsTableTable 
                            data={this.formatQuadruplexes(results[key].data)} 
                            key={'table'+key}/>);
        }
        return tables;
    }

    colorDefects(run, nt, strand) {
        const runLen = run.length;
        const defectCount = runLen - nt;
        const Gcount = strand === '+' ? (run.match(/G/g) || []).length : (run.match(/C/g) || []).length;
        const regex = strand === '+' ? /[^G]/gm : /[^C]/gm;
        if(Gcount === nt && runLen === nt) return <span className="green">{run}</span>;
        else if (Gcount + 1 === nt) { //mismatch
            const pos = run.search(regex);
            return <span>
                <span className="green">{run.slice(0, pos)}</span>
                <span className="orange">{run.slice(pos, pos+1)}</span>
                <span className="green">{run.slice(pos+1)}</span>
            </span>
        }
        else { // bulge
            const match = run.match(regex);
            if (!match) { //all Gs or all Cs, but there is a bulge
                const defectLenHalf = Math.ceil((defectCount) / 2);
                const runLenHalf = Math.floor(runLen / 2);
                return <span>
                    <span className="green">{run.slice(0, runLenHalf - defectLenHalf)}</span>
                    <span className="purple">{run.slice(runLenHalf - defectLenHalf, runLenHalf + defectLenHalf - 1)}</span>
                    <span className="green">{run.slice(runLenHalf + defectLenHalf - 1)}</span>
                </span>
            }; 
            let firstIndex = run.indexOf(match[0]);
            let lastIndex = run.lastIndexOf(match[match.length - 1]);
            let defect = run.slice(firstIndex, lastIndex + 1);
            if (defect.length < defectCount) { // bulge starts or ends with Gs or Cs
                let GsToAdd = defectCount - defect.length;
                const spaceAtTheEnd = runLen - 2 - lastIndex;
                if (spaceAtTheEnd) {
                    lastIndex += GsToAdd > spaceAtTheEnd ? spaceAtTheEnd : GsToAdd;
                    GsToAdd -= spaceAtTheEnd;
                }
                if (GsToAdd > 0) {
                    firstIndex -= GsToAdd;
                }
                defect = run.slice(firstIndex, lastIndex + 1);
            }
            return <span>
                <span className="green">{run.slice(0, firstIndex)}</span>
                <span className="purple">{defect}</span>
                <span className="green">{run.slice(lastIndex+1)}</span>
            </span>;
        }
    }

    formatQuadruplexes(data) {
        if (typeof(data[0].quadruplex) !== "string") return data;
        data.map(quad => {
            const { rl1, rl2, rl3, ll1, ll2, ll3 } = quad;
            const wholeQuad = quad.quadruplex;
            let run1 = wholeQuad.slice(0, rl1);
            run1 = this.colorDefects(run1, quad.nt, quad.strand);
            let pos = rl1;
            const loop1 = wholeQuad.slice(pos, pos + ll1);
            pos += ll1;
            let run2 = wholeQuad.slice(pos, pos + rl2);
            run2 = this.colorDefects(run2, quad.nt, quad.strand);
            pos += rl2;
            const loop2 = wholeQuad.slice(pos, pos + ll2);
            pos += ll2;
            let run3 = wholeQuad.slice(pos, pos + rl3);
            run3 = this.colorDefects(run3, quad.nt, quad.strand);
            pos += rl3;
            const loop3 = wholeQuad.slice(pos, pos + ll3);
            pos += ll3;
            let run4 = wholeQuad.slice(pos);
            run4 = this.colorDefects(run4, quad.nt, quad.strand);
            let formatted = <span className="quadruplex-text">
                {run1}
                <span className="grey">{loop1}</span>
                {run2}
                <span className="grey">{loop2}</span>
                {run3}
                <span className="grey">{loop3}</span>
                {run4}
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
            <div className="wrapper">
                <h1>Results</h1>
                <ResultsHeader id={results.id}/>
                {this.renderTables(results, activeStrands)}
            </div>
        </div>) : <div className="loading"><Loader/></div>;
    }
}

export default ResultsTable;
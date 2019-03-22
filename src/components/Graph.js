import React, { Component } from 'react';
import './Graph.css';
import Loader from '../components/Loader';
import Utils from '../utils';

class Graph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            markersInterval: 50,
        }
    }

    componentDidMount() {
        if(this.props.results) this.prepareLengthVariables(this.props.results.seq.length);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.results !== this.props.results) this.prepareLengthVariables(this.props.results.seq.length);
    }

    prepareLengthVariables(len) {
        let markersInterval = 50;
        let markersShiftRatio = 5;
        let XAxisWidth = len/10;
        if (len < 10000) {
        }
        if (len < 100) {
            markersInterval = 10;
            markersShiftRatio = 10 + Math.ceil(len/100);
            XAxisWidth = 100;
        }
        this.setState({
            markersInterval: markersInterval,
            markersShiftRatio: markersShiftRatio,
            XAxisWidth: XAxisWidth
        });

    }

    renderLines(length) {
        let amount = Math.ceil(length/50);
        let interval = 5;
        if (length < 1000) amount = Math.ceil(length/20);
        if (length < 100) {
            amount = Math.ceil(length/10);
            interval = 100/amount;
        };
        return Array(amount + 1).fill(null).map((el, i) => (
            <Line
                left={i*interval+0.5}
                key={i}
            />
        ))
    }

    computeYAxis(){
        let scores = Utils.onlyUnique(this.props.results.data.map(q => {
            return q.score;
        }));
        let minScore = parseInt(Math.min.apply(null, scores)/10, 10) * 10;
        let maxScore = (parseInt(Math.max.apply(null, scores) / 10, 10) + 1 ) * 10;
        return Array((maxScore - minScore) / 5 + 1).fill().map((item, index) => minScore + index*5).reverse();
    }

    computeXAxis() {
        let len = this.props.results.seq.length;
        let interval = this.state.markersInterval;
        return Array((Math.ceil(len/interval) + 1)).fill().map((item, index) => index * interval);
    }

    render() {
        console.log(this.props.results);
        return this.props.results ? (
            <div className="graph-wrapper">
                <h2>{this.props.results.name}</h2>
                <div className="graph">
                    <YAxis content={this.computeYAxis()}/>

                    <div className="graph-content">
                        <div className="graph-lines-container">
                            <div>
                                {this.renderLines(this.props.results.seq.length)}
                            </div>
                            <Markers markerArr={this.computeXAxis()} ratio={this.state.markersShiftRatio}/>
                            <div className="vertical-line" style={{width: `${this.state.XAxisWidth}%`}}/>
                            {/* {this.renderMarkers(this.computeXAxis())} */}
                        </div>
                    </div>
                    <div className="graph-content-end"></div>
                </div>

            </div>
        ) :  <div className="body container loading"><Loader/></div>;
    }
}

const Line = ({left}) => {
    return (
        <div
            className="line"
            style={{left: `${left}%`}}
        />
    )
}

const computeLeftShift = (el, i, ratio) => {
    console.log(ratio);
    if (el.toString().length >= 5) return i * ratio + 5;
    if (el.toString().length >= 4) return i * ratio - 0.5;
    return i * ratio + 0.5;
}

const Markers = ({markerArr, ratio}) => {
    return (
      <div className="markers">
        {
          markerArr.map((el, i) => (
           <span key={i} className={`marker-${i%2 === 0 ? "top" : "bottom"}`} style={{ left: `${computeLeftShift(el, i, ratio)}%` }}>
            {el}
           </span>
          ))
        }
      </div>
    )
  }

const YAxis = ({content}) => {
    return (
        <div className="graph-y-content">
            {content.map((sc) => (
                <div className="text" style={{height: `${95/content.length}%`}} key={sc}>
                    {sc}
                </div>
            ))}
        </div>
    )
}

export default Graph;
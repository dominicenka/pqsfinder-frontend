import React, { Component } from 'react';
import './Graph.css';
import Loader from '../components/Loader';
import Utils from '../utils';
import * as d3 from "d3";

class Graph extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.results) this.drawChart();
    }

    componentDidUpdate(prevProps) {
        if (this.props.results !== prevProps.results) this.drawChart();
    }

    computeYAxis(){
        let scores = Utils.onlyUnique(this.props.results.data.map(q => {
            return q.score;
        }));
        let minScore = (parseInt(Math.min.apply(null, scores)/5, 10) * 5) - 5;
        let maxScore = (parseInt(Math.max.apply(null, scores) / 5, 10) + 1 ) * 5;
        return [maxScore, minScore];
    }

    makeXgridlines(x) {		
        return d3.axisBottom(x).ticks(10)
    }

    makeYgridlines(y) {		
        return d3.axisLeft(y).ticks(10)
    }   

    drawChart() {
        // const margin = { top: 20, right: 40, bottom: 20, left: 40 };
        const data = this.props.results.data;

        let scores = this.props.results.data.map(q => {
            return Number(q.score);
        });


        let startPositions = this.props.results.data.map(q => {
            return Number(q.start);
        });

        let endPositions = this.props.results.data.map(q => {
            return Number(q.end);
        });

        let len = this.props.results.seq.length;

        console.log(scores);
        console.log(startPositions);
        console.log(endPositions);


        const xScale = d3.scaleLinear()
            .domain([0, len])
            .range([0, 1700]);

        const yScale = d3.scaleLinear()
            .domain(this.computeYAxis())
            .range([0, 550]);

        const colorFillScale = d3.scaleLinear()
            .domain([Math.min.apply(null, scores), Math.max.apply(null, scores)])
            .range(['#ff3333', '#330000']);
          
        // const svg = d3.select(".graph").append("svg").attr("width", 1800).attr("height", 600);

        // const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        // g.append('g').call(d3.axisLeft(yScale));
        // g.append('g').call(d3.axisBottom(xScale.nice())).attr('transform', `translate(0,${590-margin.top - margin.bottom})`);

        // svg.append("g")			
        //     .attr("class", "grid")
        //     .attr('transform', `translate(${margin.left},${590-margin.top})`)
        //     .call(this.makeXgridlines(xScale)
        //         .tickSize(-590)
        //         .tickFormat("")
        //     );

        // svg.append("g")			
        //     .attr("class", "grid")
        //     .attr('transform', `translate(${margin.left},${20})`)
        //     .call(this.makeYgridlines(yScale)
        //         .tickSize(-1700)
        //         .tickFormat("")
        //     );

        // const gg = svg.append("g");
        // const innerSvg = gg.append("svg");

        // innerSvg.selectAll("rect")
        //     .data(startPositions)
        //     .enter()
        //     .append("rect")
        //     .attr("key", (d, i) => i)
        //     .attr("x", (d, i) => xScale(d))
        //     .attr("y", (d, i) => yScale(scores[i]))
        //     .attr("width", (d, i) => xScale(endPositions[i] - d))
        //     .attr("fill", (d, i) => colorFillScale(scores[i]))
        //     .attr("height", (d, i) => 15)
        //     .attr('transform', `translate(${margin.left},${margin.top - 7.5})`);

        const brushed = () => {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            var s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            focus.select(".axis--x").call(xAxis);
            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(width / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        const zoomed = () => {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            var t = d3.event.transform;
            x.domain(t.rescaleX(x2).domain());
            focus.select(".axis--x").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        }

        var svg = d3.select("svg"),
            margin = {top: 20, right: 20, bottom: 140, left: 40},
            margin2 = {top: 500, right: 20, bottom: 30, left: 40},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            height2 = +svg.attr("height") - margin2.top - margin2.bottom;

        var x = d3.scaleLinear().range([0, width]),
            x2 = d3.scaleLinear().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]);

        var xAxis = d3.axisBottom(x),
            xAxis2 = d3.axisBottom(x2),
            yAxis = d3.axisLeft(y);

        var brush = d3.brushX()
            .extent([[0, 0], [width, height2]])
            .on("brush end", brushed);
        
        var zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        var focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
            
            x.domain([0, len]);
            y.domain([0, d3.max(data, function(d) { return d.score; })]);
            x2.domain(x.domain());
            y2.domain(y.domain());
            
            focus.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
            
            focus.append("g")
                .attr("class", "axis axis--y")
                .call(yAxis);
            
            context.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height2 + ")")
                .call(xAxis2);
            
            context.append("g")
                .attr("class", "brush")
                .call(brush)
                .call(brush.move, x.range());

        svg.append("rect")
                .attr("class", "zoom")
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(zoom);
    }

    render() {
        console.log(this.props.results);
        return this.props.results ? (
            <div className="graph-wrapper">
                <h2>{this.props.results.name}</h2>
                <div className="graph">
                    <svg width="1800" height="600"></svg>
                </div>

            </div>
        ) :  <div className="body container loading"><Loader/></div>;
    }
}

export default Graph;
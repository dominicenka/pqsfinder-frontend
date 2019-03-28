import React, { Component } from 'react';
import './Graph.css';
import Loader from '../components/Loader';
import Utils from '../utils';
import * as d3 from "d3";

class Graph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeG: []
        }
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
        return [minScore, maxScore];
    }

    makeXgridlines(x) {		
        return d3.axisBottom(x)
    }

    makeYgridlines(y) {		
        return d3.axisLeft(y).ticks(10)
    }  
    
    getStartPositions(startPositions, endPositions, domain) {
        let result = [];
        startPositions.forEach((pos, index) => {
            if (pos < domain[0] && endPositions[index] > domain[0]) result.push(domain[0]);
            if (pos < domain[1] && endPositions[index] > domain[1]) result.push(pos);
            if (pos > domain[0] && endPositions[index] < domain[1]) result.push(pos);
        });
        return result;
    }

    getEndPositions(startPositions, endPositions, domain) {
        let result = [];
        endPositions.forEach((pos, index) => {
            if (startPositions[index] < domain[0] && pos > domain[0]) result.push(pos);
            if (startPositions[index] < domain[1] && pos > domain[1]) result.push(domain[1]);
            if (pos < domain[1] && startPositions[index] > domain[0]) result.push(pos);
        });
        return result;
    }

    getScores(startPositions, endPositions, scores, domain) {
        let result = [];
        startPositions.forEach((pos, index) => {
            if (pos < domain[0] && endPositions[index] > domain[0]) result.push(scores[index]);
            if (pos < domain[1] && endPositions[index] > domain[1]) result.push(scores[index]);
            if (pos > domain[0] && endPositions[index] < domain[1]) result.push(scores[index]);
        });
        return result;
    }

    getStrands(startPositions, endPositions, strands, domain) {
        let result = [];
        startPositions.forEach((pos, index) => {
            if (pos < domain[0] && endPositions[index] > domain[0]) result.push(strands[index]);
            if (pos < domain[1] && endPositions[index] > domain[1]) result.push(strands[index]);
            if (pos > domain[0] && endPositions[index] < domain[1]) result.push(strands[index]);
        });
        return result;
    }

    drawChart() {
        let data = this.props.results.data;

        let scores = data.map(q => {
            return Number(q.score);
        });

        let currentScores = scores;

        let startPositions = data.map(q => {
            return Number(q.start);
        });

        let currentStartPositions = startPositions;

        let endPositions = data.map(q => {
            return Number(q.end);
        });

        let currentEndPositions = endPositions;

        let strands = data.map(q => {
            return q.strand;
        });


        let len = this.props.results.seq.length;

        console.log(scores);
        console.log(startPositions);
        console.log(endPositions);
        console.log(strands);

        const colorFillScaleSense = d3.scaleLinear()
            .domain([Math.min.apply(null, scores), Math.max.apply(null, scores)])
            .range(['#ff3333', '#cc0000']);

        const colorFillScaleAnti = d3.scaleLinear()
            .domain([Math.min.apply(null, scores), Math.max.apply(null, scores)])
            .range(['#4d94ff', '#003d99']);

        const brushed = () => {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            var s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            focus.selectAll("rect").remove();
            const newStartPositions = this.getStartPositions(startPositions, endPositions, x.domain());
            currentStartPositions = newStartPositions;
            const newEndPositions = this.getEndPositions(startPositions, endPositions, x.domain());
            currentEndPositions = newEndPositions;
            const newScores = this.getScores(startPositions, endPositions, scores, x.domain());
            currentScores = newScores;
            const newStrands = this.getScores(startPositions, endPositions, strands, x.domain());
            focus.selectAll("rect")
                .data(newStartPositions)
                .enter()
                .append("rect")
                .attr("key", (d, i) => i)
                .attr("x", (d, i) => x(d))
                .attr("y", (d, i) => y(newScores[i]) - margin2.bottom)
                .attr("width", (d, i) => x(x.domain()[0] + newEndPositions[i] - d))
                .attr("fill", (d, i) => newStrands[i] === '+' ? colorFillScaleSense(newScores[i]) : colorFillScaleAnti(newScores[i]))
                .attr("height", (d, i) => 10)
                .attr('transform', `translate(0,${margin.top})`)
                .attr("class", "rect")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);
            focus.select(".axis--x").call(xAxis);
            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(width / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        const zoomed = () => {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            var t = d3.event.transform;
            x.domain(t.rescaleX(x2).domain());
            focus.selectAll("rect").remove();
            const newStartPositions = this.getStartPositions(startPositions, endPositions, x.domain());
            currentStartPositions = newStartPositions;
            const newEndPositions = this.getEndPositions(startPositions, endPositions, x.domain());
            currentEndPositions = newEndPositions;
            const newScores = this.getScores(startPositions, endPositions, scores, x.domain());
            currentScores = newScores;
            const newStrands = this.getScores(startPositions, endPositions, strands, x.domain());
            focus.selectAll("rect")
                .data(newStartPositions)
                .enter()
                .append("rect")
                .attr("key", (d, i) => i)
                .attr("x", (d, i) => x(d))
                .attr("y", (d, i) => y(newScores[i]) - margin2.bottom)
                .attr("width", (d, i) => x(x.domain()[0] + newEndPositions[i] - d))
                .attr("fill", (d, i) => newStrands[i] === '+' ? colorFillScaleSense(newScores[i]) : colorFillScaleAnti(newScores[i]))
                .attr("height", (d, i) => 10)
                .attr('transform', `translate(0,${margin.top})`)
                .attr("class", "rect")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);
            xGrid.call(
                d3.axisBottom(x)
                    .scale(t.rescaleX(x))
                    .ticks(5)
                    .tickSize(-height)
                    .tickFormat("")
                )
            focus.select(".axis--x").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        }

        var svg = d3.select("svg:nth-child(1)"),
            margin = {top: 20, right: 20, bottom: 140, left: 40},
            margin2 = {top: 490, right: 20, bottom: 30, left: 40},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            height2 = +svg.attr("height") - margin2.top - margin2.bottom;

        var zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        svg.append("rect")
            .attr("class", "zoom")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom);

        var x = d3.scaleLinear().range([0, width]),
            x2 = d3.scaleLinear().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]);

        var xAxis = d3.axisBottom(x),
            xAxis2 = d3.axisBottom(x2),
            yAxis = d3.axisLeft(y);

        let xGrid = svg.append("g")
            .attr('class', 'grid')     
            .attr("id", "grid")
            .attr("transform", `translate(${margin.left}, ${height + margin.top} )`)
            .call(this.makeXgridlines(x)
                .tickSize(-height)
                .tickFormat("")
            )

        svg.append("g")			
            .attr("class", "grid")
            .attr('transform', `translate(${margin.left},${20})`)
            .call(this.makeYgridlines(y)
                .tickSize(-width)
                .tickFormat("")
            );

        var brush = d3.brushX()
            .extent([[0, 0], [width, height2 + 5]])
            .on("brush end", brushed);

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
        y.domain(this.computeYAxis());
        x2.domain(x.domain());
        y2.domain(y.domain());

        var Tooltip = d3.select(".graph")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

        var mouseover = function(d) {
            // svg.select(".zoom").attr("class", "zoom disabled");
            Tooltip
                .style("opacity", 1);
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
            };

        var mousemove = function(d, i) {
            Tooltip
                .html("Score: " + currentScores[i] + "<br/> Start position: " + currentStartPositions[i] + "<br/> End position: " + currentEndPositions[i])
                .style("left", (d3.mouse(this)[0]+70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
            }

        var mouseleave = function(d) {
            Tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
            }

        focus.selectAll("rect")
            .data(startPositions)
            .enter()
            .append("rect")
            .attr("key", (d, i) => i)
            .attr("x", (d, i) => x(d))
            .attr("y", (d, i) => y(scores[i]) - margin2.bottom)
            .attr("width", (d, i) => x(endPositions[i] - d))
            .attr("fill", (d, i) => strands[i] === '+' ? colorFillScaleSense(scores[i]) : colorFillScaleAnti(scores[i]))
            .attr("height", (d, i) => 10)
            .attr('transform', `translate(0,${margin.top})`)
            .attr("class", "rect")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
        
        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);

        context.selectAll("rect")
            .data(startPositions)
            .enter()
            .append("rect")
            .attr("key", (d, i) => i)
            .attr("x", (d, i) => x2(d))
            .attr("y", (d, i) => y2(scores[i]) - margin2.bottom)
            .attr("width", (d, i) => x2(endPositions[i] - d))
            .attr("fill", (d, i) => strands[i] === '+' ? colorFillScaleSense(scores[i]) : colorFillScaleAnti(scores[i]))
            .attr("height", (d, i) => 10)
            .attr('transform', `translate(0,${margin.top})`);
            
        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);
            
        context.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, x.range());
    }

    renderLegend() {
        return (
            <svg width="1800" height="40">
                <rect x="800" y="0" width="20" height="20" fill="red"></rect>
                <text x="828" y="16" alignment-baseline="middle">sense</text>
                <rect x="1000" y="0" width="20" height="20" fill="blue"></rect>
                <text x="1028" y="16" alignment-baseline="middle">antisense</text>
            </svg>
        )
    }

    render() {
        console.log(this.props.results);
        return this.props.results ? (
            <div>
                <div className="graph-wrapper">
                    <h2>{this.props.results.name}</h2>
                    {this.renderLegend()}
                    <div className="graph">
                        <svg width="1800" height="600"></svg>
                    </div>

                </div>
                {this.state.data && <div className="detail-wrapper">
                    <div className="detail">
                        <span>Score: </span>{this.state.data.score}
                    </div>    
                </div>}
            </div>
        ) :  <div className="body container loading"><Loader/></div>;
    }
}

export default Graph;
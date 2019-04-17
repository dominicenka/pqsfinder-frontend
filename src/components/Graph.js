import React, { Component } from 'react';
import './Graph.css';
import Loader from '../components/Loader';
import Utils from '../utils';
import * as d3 from "d3";
import Detail from './Detail';

class Graph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            detailId: 1
        }

        this.handleRectClick = this.handleRectClick.bind(this);
        this.getId = this.getId.bind(this);
    }

    getId() {
        return this.state.detailId;
    }

    componentDidMount() {
        if (this.props.results) this.drawChart();
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) this.drawChart();
    }

    handleRectClick(d) {
        this.setState({detailId: d.key});
        this.props.handleRectClick();
    }

    computeYAxis(){
        let scores = Utils.onlyUnique(this.props.results.data.map(q => {
            return q.score;
        }));
        let minScore = (parseInt(Math.min.apply(null, scores)/5, 10) * 5) - 5;
        let maxScore = (parseInt(Math.max.apply(null, scores) / 5, 10) + 1 ) * 5;
        return [minScore, maxScore];
    }

    // makeXgridlines(x) {		
    //     return d3.axisBottom(x)
    // }

    // makeYgridlines(y) {		
    //     return d3.axisLeft(y)
    // } 

    computeVisibleData(data, domain) {
        let x = domain[0];
        let y = domain[1];
        let visibleData = [];
        data.forEach((quad, index) => {
            let newQuad = {...quad};
            if(quad.end < x || quad.start > y) return;
            if(quad.start < x) newQuad.start = x;
            if(quad.end > y) newQuad.end = y;
            visibleData.push(newQuad);
        });
        return visibleData;
    }

    drawChart() {
        let data = this.props.data;

        let scores = data.map(val => Number(val.score));

        let len = this.props.results.seq.length;
        var svg = d3.select(`.svg${this.props.idx}`),
            margin = {top: 20, right: 20, bottom: 140, left: 40},
            margin2 = {top: 490, right: 20, bottom: 30, left: 40},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            height2 = +svg.attr("height") - margin2.top - margin2.bottom;

        svg.selectAll("*").remove();
        d3.select(`.graph${this.props.idx}`).selectAll('tooltip').remove();

        var x = d3.scaleLinear().range([0, width]),
            x2 = d3.scaleLinear().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]);

        var xAxis = d3.axisBottom(x),
            xAxis2 = d3.axisBottom(x2),
            yAxis = d3.axisLeft(y);

        let visibleData = this.computeVisibleData(data, x.domain());

        const colorFillScaleSense = d3.scaleLinear()
            .domain([Math.min.apply(null, scores), Math.max.apply(null, scores)])
            .range(['#ff0066', '#b30059']);

        const colorFillScaleAnti = d3.scaleLinear()
            .domain([Math.min.apply(null, scores), Math.max.apply(null, scores)])
            .range(['#0099ff', '#0059b3']);

        const brushed = () => {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            var s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            focus.selectAll("rect").remove();
            visibleData = this.computeVisibleData(data, x.domain());
            focus.selectAll("rect")
                .data(visibleData)
                .enter()
                .append("rect")
                .attr("key", (d, i) => i)
                .attr("x", (d, i) => x(d.start))
                .attr("y", (d, i) => y(d.score) - margin2.bottom)
                .attr("width", (d, i) => x(x.domain()[0] + d.end - d.start))
                .attr("fill", (d, i) => d.strand === '+' ? colorFillScaleSense(d.score) : colorFillScaleAnti(d.score))
                .attr("height", (d, i) => 15)
                .attr('transform', `translate(0,${margin.top})`)
                .attr("class",  (d, i) => `rect ${d.key === this.state.detailId ? "active" : ""}`)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
                .on("mouseup", mouseup)
                .on("mousedown", mousedown)
                .on("click", this.handleRectClick.bind(this));
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
            visibleData = this.computeVisibleData(data, x.domain());
            focus.selectAll("rect")
                .data(visibleData)
                .enter()
                .append("rect")
                .attr("key", (d, i) => i)
                .attr("x", (d, i) => x(d.start))
                .attr("y", (d, i) => y(d.score) - margin2.bottom)
                .attr("width", (d, i) => x(x.domain()[0] + d.end - d.start))
                .attr("fill", (d, i) => d.strand === '+' ? colorFillScaleSense(d.score) : colorFillScaleAnti(d.score))
                .attr("height", (d, i) => 15)
                .attr('transform', `translate(0,${margin.top})`)
                .attr("class", (d, i) => `rect ${d.key === this.state.detailId ? "active" : ""}`)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
                .on("mouseup", mouseup)
                .on("mousedown", mousedown)
                .on("click", this.handleRectClick.bind(this));
            // xGrid.call(
            //     d3.axisBottom(x)
            //         .scale(t.rescaleX(x))
            //         .ticks(5)
            //         .tickSize(-height)
            //         .tickFormat("")
            //     )
            focus.select(".axis--x").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        }

        var zoom = d3.zoom()
            .scaleExtent([1, len/14]) //14 because magic
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        var brush = d3.brushX()
            .extent([[0, 0], [width, height2 + 5]])
            .on("brush end", brushed);

        svg.append("rect")
            .attr("class", "zoom")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom);

        // let xGrid = svg.append("g")
        //     .attr('class', 'grid')     
        //     .attr("id", "grid")
        //     .attr("transform", `translate(${margin.left}, ${height + margin.top} )`)
        //     .call(this.makeXgridlines(x)
        //         .tickSize(-height)
        //         .tickFormat("")
        //     )

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

        var Tooltip = d3.select(`.graph.i${this.props.idx}`)
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
                .style("stroke-width", "1px")
                // .style("opacity", 0.7)
            };

        var mousedown = function(d) {
            Tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("opacity", 1)
        }

        var mouseup = function(d) {
            d3.select('.active').attr("class", "rect");
            d3.select(this)
                .style("opacity", 0.8)
                .attr("class", "rect active");
        }

        var mousemove = function(d, i) {
            let item = data.find(o => o.key === d.key);
            Tooltip
                .html("Score: " + item.score + "<br/> Start position: " + item.start + "<br/> End position: " + item.end)
                .style("left", (d3.mouse(this)[0]) + 50 + "px")
                .style("top", (d3.mouse(this)[1]) - 35 + "px")
            }

        var mouseleave = function(d) {
            Tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
            }

        focus.selectAll("rect")
            .data(visibleData)
            .enter()
            .append("rect")
            .attr("key", (d, i) => i)
            .attr("x", (d, i) => x(d.start))
            .attr("y", (d, i) => y(d.score) - margin2.bottom)
            .attr("width", (d, i) => x(d.end - d.start))
            .attr("fill", (d, i) => d.strand === '+' ? colorFillScaleSense(d.score) : colorFillScaleAnti(d.score))
            .attr("height", (d, i) => 15)
            .attr('transform', `translate(0,${margin.top})`)
            .attr("class", (d, i) => `rect ${d.key === this.state.detailId ? "active" : ""}`)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("mouseup", mouseup)
            .on("mousedown", mousedown)
            .on("click", this.handleRectClick.bind(this));
        
        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);

        // svg.append("g")			
        // .attr("class", "grid")
        // .attr('transform', `translate(${margin.left},${20})`)
        // .call(this.makeYgridlines(y)
        //     .tickSize(-width)
        //     .tickFormat("")
        // );

        context.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("key", (d, i) => i)
            .attr("x", (d, i) => x2(d.start))
            .attr("y", (d, i) => y2(d.score) - 20)
            .attr("width", (d, i) => x2(d.end - d.start))
            .attr("fill", (d, i) => d.strand === '+' ? colorFillScaleSense(d.score) : colorFillScaleAnti(d.score))
            .attr("height", (d, i) => 5)
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
            <div className="graph-legend">
                <input type="checkbox" value="sense" className="sense"
                    onChange={(e) => this.props.onStrandChange("sense")}
                    checked={this.props.activeStrands.includes("sense") ? true : false}/>sense
                <input type="checkbox" value="antisense" className="antisense"
                    onChange={(e) => this.props.onStrandChange("antisense")}
                    checked={this.props.activeStrands.includes("antisense") ? true : false}/>antisense
            </div>
        )
    }

    render() {
        return this.props.data ? (
            <div>
                <div className="row">
                    <div className="graph-wrapper">
                        {/* <h2>{this.props.results.name}</h2> */}
                        {this.renderLegend()}
                        <div className={`graph i${this.props.idx}`}>
                            <svg width="1200" height="600" className={`svg${this.props.idx}`}></svg>
                        </div>

                    </div>
                </div>
                <div className="row">
                    <Detail data={this.props.data[this.state.detailId - 1]}/>
                </div>
            </div>
        ) :  <div className="body container loading"><Loader/></div>;
    }
}

export default Graph;
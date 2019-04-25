import React, { Component } from 'react';
import './Graph.css';
import Loader from '../components/Loader';
import Utils from '../utils';
import * as d3 from "d3";
import Detail from './Detail';
import {ScrollLocky} from 'react-scroll-locky';

let zoom, zoomed;

class Graph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            detailId: 2,
            zoom: false,
            scroll: true
        }

        this.mouseover = this.mouseover.bind(this);
        this.mouseleave = this.mouseleave.bind(this);
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

    mouseover = function(d) {
        // svg.select(".zoom").attr("class", "zoom disabled");
        let para = document.querySelector('.nav');
        let compStyles = window.getComputedStyle(para);
        d3.select('.nav').style("margin-right", `${compStyles.getPropertyValue("margin-right")}`);
        d3.select('.nav').style("margin-left", `${compStyles.getPropertyValue("margin-left")}`);
        this.setState({detailId: d.key, scroll: false})
        d3.select(`.graph.i${this.props.idx} .detail-wrapper`)
            .attr("class", 'detail-wrapper visible');
        };

    mouseleave = function(d) {
        d3.select('.nav').style("margin-right", `auto`);
        d3.select('.nav').style("margin-left", `auto`);
        this.setState({detailId: d.key, scroll: true})
        d3.select(`.graph.i${this.props.idx} .detail-wrapper`)
            .attr("class", 'detail-wrapper ');
    }

    computeYAxis(){
        let scores = Utils.onlyUnique(this.props.results.data.map(q => {
            return q.score;
        }));
        let minScore = (parseInt(Math.min.apply(null, scores)/5, 10) * 5) - 5;
        let maxScore = (parseInt(Math.max.apply(null, scores) / 5, 10) + 1 ) * 5;
        return [minScore, maxScore];
    }

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
            margin = {top: 20, right: 20, bottom: 170, left: 40},
            margin2 = {top: 510, right: 20, bottom: 30, left: 40},
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
            focus.select(".axis--x").call(xAxis);
            focus.selectAll('.gridLine-x').remove();
            document.querySelectorAll(`.i${this.props.idx} .focus .axis--x .tick`).forEach(tick => {
                focus.append("line")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", height)
                    .attr("transform", tick.attributes.transform.nodeValue)
                    .attr("stroke-width", 1)
                    .attr("stroke", "lightgrey")
                    .attr("class", 'gridLine-x');
            });
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
                .attr("class",  (d, i) => `rect`)
                .on("mouseover", this.mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", this.mouseleave)
                .on("zoom", zoomed);
            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(width / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        zoomed = () => {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            var t = d3.event.transform;
            x.domain(t.rescaleX(x2).domain());
            focus.select(".axis--x").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
            focus.selectAll('.gridLine-x').remove();
            document.querySelectorAll(`.i${this.props.idx} .focus .axis--x .tick`).forEach(tick => {
                focus.append("line")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", height)
                    .attr("transform", tick.attributes.transform.nodeValue)
                    .attr("stroke-width", 1)
                    .attr("stroke", "lightgrey")
                    .attr("class", 'gridLine-x');
            });
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
                .attr("class", (d, i) => `rect`)
                .on("mouseover", this.mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", this.mouseleave)
                .on("zoom", zoomed);
            
        }

        zoom = d3.zoom()
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

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        var focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("line")
            .attr("x1", 0)
            .attr("y1", height + 70)
            .attr("x2", width + 50)
            .attr("y2", height + 70)
            .attr("stroke-width", 2)
            .attr("stroke", "#02425854")
            .attr("class", 'separator');

        svg.append('text')
            .attr("x", 3)
            .attr("y", height + 90)
            .attr("fill", "#024258e1")
            .html("Zoom selection")

        focus.on("mouseover", this.mouseoverFocus)
            .on("mouseleave", this.mouseleaveFocus)

        var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
            
        x.domain([0, len]);
        y.domain(this.computeYAxis());
        x2.domain(x.domain());
        y2.domain(y.domain());

        var Tooltip = d3.select(`.graph.i${this.props.idx} .detail-wrapper`);

        var mousemove = function(d, i) {
            let left = (d3.mouse(this)[0]); 
            left -= left > 600 ? 550 : 50;
            let top = (d3.mouse(this)[1]); 
            top -= top > 220 ? 850 : 540;
            Tooltip
                .style("left", left + "px")
                .style("top", top + "px")
            }

        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);

        document.querySelectorAll(`.i${this.props.idx} .focus .axis--y .tick`).forEach(tick => {
            focus.append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", width)
                .attr("y2", 0)
                .attr("transform", tick.attributes.transform.nodeValue)
                .attr("opacity", 0.7)
                .attr("stroke-width", 1)
                .attr("stroke", "lightgrey")
                .attr("class", 'gridLine-y');
        });

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
            .attr("class", (d, i) => `rect`)
            .on("mouseover", this.mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", this.mouseleave)
        
        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

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

        d3.selectAll('.handle.handle--e')
            .attr("fill", "#024358")

        d3.selectAll('.handle.handle--w')
            .attr("fill", "#024358")
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
        const graph = <div className="graph-wrapper">
                {this.renderLegend()}
            <div className={`graph i${this.props.idx}`}>
                <svg width="1170" height="600" className={`svg${this.props.idx}`}></svg>
                <Detail data={this.props.data[this.state.detailId - 1]}/>
            </div>
        </div>
        return this.props.data ? (
            <div>
                <ScrollLocky enabled={!this.state.scroll} > {graph} </ScrollLocky> 
            </div>
        ) :  <div className="body container loading"><Loader/></div>;
    }
}

export default Graph;
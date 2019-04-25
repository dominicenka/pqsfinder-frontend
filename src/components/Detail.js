import React, { Component } from 'react';

class Detail extends Component {

    constructor(props) {
        super(props);

        this.state={
        }
    }

    render() {
        let data = this.props.data;
        return data ? <div className="detail-wrapper" >
            <div className="detail">
                <p className="detail-q">{data.quadruplex}</p>
                <div className="detail-info">
                    <div>
                        <p><b>Start</b>: {data.start}</p>
                        <p><b>End</b>: {data.end}</p>
                        <p><b>Length</b>: {data.length}</p>
                        <p><b>Score</b>: {data.score}</p>
                    </div>
                    <div>
                        <p><b>Strand</b>: {data.strand}</p>
                        <p><b>Number of tetrads</b>: {data.nt}</p>
                        <p><b>Number of bulges</b>: {data.nb}</p>
                        <p><b>Number of mismatches</b>: {data.nm}</p>
                    </div>
                </div>
            </div>
        </div> : null;
    }
}

export default Detail;
import React, { Component } from 'react';

class Error extends Component {
    render() {
        return <div className="error-wrapper">
            <p className="big">Error</p>
            <p className="small">Sorry, there seems to be a problem. We are working hard on fixing it, please try again later.</p>
        </div>;
    }
}

export default Error;
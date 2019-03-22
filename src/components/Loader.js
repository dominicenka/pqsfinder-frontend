import Loader from 'react-loader-spinner';
import React, { Component } from 'react';
import '../App.css';
 
class LoaderCustom extends Component {
    render() {
        return (
            <Loader 
                type="Circles"
                color="#024358"
                height="100"	
                width="100"
            />   
        );
    }
}

export default LoaderCustom;
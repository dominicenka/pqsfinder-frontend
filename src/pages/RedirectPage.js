import React, { Component } from 'react';
import '../App.css';
import { Redirect } from "react-router-dom";

class RedirectPage extends Component {
	constructor(props) {
		super(props);
	}

  render() {
    return  <Redirect to={{
      pathname: '/resultsTable',
      state: this.props.location.state
      }}
    />;
  }
}
  
export default RedirectPage;
  
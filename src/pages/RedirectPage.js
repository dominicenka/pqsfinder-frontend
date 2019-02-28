import React, { Component } from 'react';
import '../App.css';
import { Redirect } from "react-router-dom";

class RedirectPage extends Component {
  render() {
    return  <Redirect push to={{
        pathname: `/resultsTable/${this.props.location.state.id}`
      }}
    />;
  }
}
  
export default RedirectPage;
  
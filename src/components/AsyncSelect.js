import React, { Component } from 'react';
import AsyncSelect from 'react-select/lib/Async';
import NCBIStore from '../stores/NCBIStore';
import _ from 'lodash';

import '../App.css';

class AsyncSelectCustom extends Component {
    constructor(props) {
       super(props);
       this.state = {
           searchOpts: [],
           selectedOption: {}
       }

       this.fetchData = _.debounce(this.fetchData, 600);
    }

    fetchData = (inputValue, callback) => {
        if (!inputValue) {
          callback([]);
        } else {
            setTimeout(async () => {
                await NCBIStore.fetchSearchOptions(inputValue);
                callback(NCBIStore.getSearchOptions());
            });
        }
    }

    onSearchChange = (selectedOption) => {
        if (selectedOption) {
            this.setState({
                selectedOption
               });
            NCBIStore.setSelectedOption(selectedOption);
        }
    }

    render() {
        // console.log(this.state);
        return (
            <AsyncSelect
                value={this.state.selectedOption}
                loadOptions={this.fetchData}
                defaultOptions={false}
                onChange={this.onSearchChange}
          />
        );
    }
}

export default AsyncSelectCustom;
import React, { Component } from 'react';
import IconHelp from '../images/help.png';

class HelpTooltip extends Component {

    constructor(props) {
        super(props);

        this.state={
            showTooltip: false,
        }
    }

    render() {
        return <div>
            <a href="#" data-toggle="popover" data-trigger="focus" title="Popover Header" data-content="Some content inside the popover">
                <img src={IconHelp} alt="help" className='help-icon' 
                    onMouseOver={() => this.setState({showTooltip: true})} 
                    onMouseOut={() => this.setState({showTooltip: false})}></img>
            </a>
            
        </div>
    }
}

export default HelpTooltip;
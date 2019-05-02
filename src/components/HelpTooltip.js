import React, { Component } from 'react';
import IconHelp from '../images/help.png';
import Popover, { ArrowContainer } from 'react-tiny-popover';

class HelpTooltip extends Component {

    constructor(props) {
        super(props);

        this.state={
            showTooltip: false,
        }
    }

    render() {
        return <div>
            <Popover
                isOpen={this.state.showTooltip}
                position={'top'} // preferred position
                content={({ position, targetRect, popoverRect }) =>(
                    <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                        position={position}
                        targetRect={targetRect}
                        popoverRect={popoverRect}
                        arrowColor={'black'}
                        arrowSize={10}
                        arrowStyle={{ opacity: 0.7 }}
                    >
                        <div className="toolTip">
                            {this.props.content}
                        </div>
                    </ArrowContainer>
                )}
            >
                <img src={IconHelp} alt="help" className='help-icon' ref={(e) => {this.target = e;}}
                    onMouseOver={() => {
                        this.setState({showTooltip: true});
                    }} 
                    onMouseOut={() => this.setState({showTooltip: false})}></img>
            </Popover>
            
        </div>
    }
}

export default HelpTooltip;
import React, { Component } from 'react';
import './Contact.css';

const fit = '/images/fit.png';

class Contact extends Component {
    render(){
        return <div className="body">
            <div className="contact-wrapper">
                <h1>Contact</h1>
                <div className="flex">
                    <span>Authors: </span> Jiri Hon, Matej Lexa and Tomas Martinek
                </div>
                <div className="flex">
                    <span>Maintainer: </span> Jiri Hon &lt;jiri.hon at gmail.com&gt; 
                </div>
                <div className="flex">
                    <a href="https://www.fit.vutbr.cz/"><img src={fit} className="fit" alt=""></img></a>
                </div>
            </div>
        </div>
    }
}

export default Contact;
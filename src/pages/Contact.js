import React, { Component } from 'react';
import './Contact.css';

class Contact extends Component {
    render(){
        return <div className="body">
            <div className="contact-wrapper">
                <h1>Contact</h1>
                <div className="flex">
                    <span>Authors: </span> Jiri Hon, Dominika Labudova, Matej Lexa and Tomas Martinek
                </div>
                <div className="flex">
                    <span>Maintainer: </span> Jiri Hon &lt;jiri.hon at gmail.com&gt; 
                </div>
                <div className="flex">
                Faculty of Information Technology<br></br>
                    Brno University of Technology<br></br>
                    Božetěchova 1/2<br></br>
                    612 66 Brno, Czech Republic <br></br>
                </div>
                <div className="flex">
                    Faculty of Informatics<br></br>
                    Masaryk University<br></br>
                    Botanická 68a<br></br>
                    602 00 Brno, Czech Republic <br></br>
                </div>
            </div>
        </div>
    }
}

export default Contact;
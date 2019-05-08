import React, { Component } from "react";
import  "./styles.css";

import PropTypes from "prop-types";
import { TrackState } from "../../state/tracker";

class Swan extends Component {
    static contextTypes = {store: PropTypes.object};
    constructor(props) {
        super(props);
        this.state = {
            theme : ""
        };
        
    }

    componentDidMount() {        	        
        TrackState(this.context.store,"Swan");              
    } 

    
	componentWillMount() {
		window.scrollTo(0, 0);
    }
    
    render() {
        return (

        <div className = "swan-container">

            <h1>Hover or tap below to assemble the swan</h1>
            <h3>(CSS only)</h3>
            <div className="swan">

                <div className="swan-head1">
                    <div></div>
                    <div><p></p></div>
                    <div></div>
                    <div></div>
                </div>

                <div className="swan-neck1">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

                <div className="swan-neck2">
                    <div></div>
                    <div></div>
                </div>

                <div className="swan-body">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

                <div className="swan-neck3">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

                <div className="swan-wing">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>

                </div>               

            </div>
            <p>Not supported on IE and Edge</p>
        </div>

        ) 
    
    }

}
export default Swan;
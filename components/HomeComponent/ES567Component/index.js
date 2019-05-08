import React, { Component } from "react";
import  "./styles.css";
import PropTypes from "prop-types";

class ES567 extends Component {
	static contextTypes = {store: PropTypes.object};
    constructor(props) {
        super(props); 
        this.unsubscribe=null;
        this.container = React.createRef();
        this.es6 = React.createRef();        
        this.state = {
            theme:""
        }       
    }

    componentDidMount() {  
        this.observeState();
        this.unsubscribe  = this.context.store.subscribe(this.observeState);           
    }

    observeState = () => {
        this.setState({
            theme:this.context.store.getState().theme
        })
    }

    componentWillUnmount() {
        this.unsubscribe();		
	}  
	
    changeWidth = (event) => {   
        let elementInfo = this.container.current.getBoundingClientRect();        
        let x = event.clientX - elementInfo.left;                 
        if (x <= elementInfo.width && window.innerWidth >= 600) {
            this.es6.current.style.width = x + "px";  
        }        
    }
	
	render() {
		return (
            <div className = {this.state.theme === "light"?"es67-container es67-container-light":"es67-container es67-container-dark"}>
                <div className = "es67-description">
                    <h2>"Our JavaScript is always up to date"</h2>
                    <p>When it comes to JavaScript, we always like to search for the newest and best solutions
                    for our applications. From ES5 to ES7, JavaScript doesn't hold any more secrets.
                </p>
                </div>
                <div className = "es67-code-container">
                    <div ref = {this.container} className = "slider-container" onMouseMove ={this.changeWidth}>
                        <div  className = "es7"></div>
                        <div ref = {this.es6} className = "es6"></div>
                    </div>
                    <p></p>
                    <div className = "es67-code-result" >
                        <p>['flower']</p>
                        <p>['flower', 'fruit']</p>
                        <p>['flower', 'fruit', 'seed']</p>
                    </div>
                </div>
            </div>
		);
	}
}
export default ES567;
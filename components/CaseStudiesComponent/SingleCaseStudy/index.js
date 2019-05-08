import React, { Component } from "react";// eslint-disable-line no-unused-vars
import "./styles.css";
import { Link } from "react-router-dom"; // eslint-disable-line no-unused-vars
import {images} from "./imageImporter";
import PropTypes from 'prop-types';// To render available the state in the component


class SingleCaseStudy extends Component {
	static contextTypes = {store: PropTypes.object};

	constructor(props) {
		super(props);
		this.state = {theme:""};
		this.unsubscribe=null;
	}

	componentDidMount() {	
		this.observeState();		
		this.unsubscribe = this.context.store.subscribe(this.observeState); 		  
	  }
	  
	  componentWillUnmount() {
		this.unsubscribe();
	  }

  	observeState = () =>{ 
		this.setState({			
			theme:this.context.store.getState().theme
		}); 		
	}  


	render() {	

		const inlineStyle = {
			backgroundImage: "url(" + images[this.props.case.Image] + ")",
			width:this.props.case.Size !== null ? this.props.case.Size : "220px"				
		};		
		//this.props.delay/5
		return(
			<div  className = {this.state.theme === "light" ? "singleCaseContainer single-case-light" : "singleCaseContainer single-case-dark"}>
				<header>
					<h3>{this.props.case.Title}</h3>
				</header>
				<p>{this.props.case.Description}</p>	
				<div className="case-logo" style = {inlineStyle}> </div>	
				<Link to={this.props.case.Path}><button >Go</button></Link>
			</div>
		);
	}

}

export default SingleCaseStudy;
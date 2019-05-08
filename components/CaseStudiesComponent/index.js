import React, { Component } from "react";
import "./styles.css";
import SingleCaseStudy from "./SingleCaseStudy/index";
import casesJSON from "../../appData/casesDescription";

import PropTypes from "prop-types";// To render available the state in the component
import { TrackState } from "../../state/tracker";

class CaseStudies extends Component {
	static contextTypes = {store: PropTypes.object}; 
	constructor(props) {
		super(props);
		this.casesJSON = casesJSON.Cases;
	}
	
	componentDidMount () { TrackState(this.context.store,"Case Studies");};

	componentWillMount() {
		window.scrollTo(0, 0);
	}

	render() {		
		let cases = this.casesJSON.map((item, index)=> {			
			return(
				<SingleCaseStudy key={index+"case"} case = {item} delay={index}/>					
			);
		});

		return(
			<div className="caseStudiesContainer">
				<section>
					<div>
						<h1 className="nav-component-heading">Case studies</h1>
						<hr className = "nav-component-hr"/>	
					</div>			
					<div className = "gridCases">
						{cases.reverse()}
					</div>
				</section>
				
			</div>
		);
	}

}

export default CaseStudies;